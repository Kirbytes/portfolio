'use client';

import React, { useEffect, useRef } from 'react';

interface MeshOrb {
  x: number;
  y: number;
  c: { h: number; s: number; l: number };
  in: number;
  out: number;
}

interface MeshConfig {
  bg: { h: number; s: number; l: number };
  orbs: MeshOrb[];
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}

export const DitheredBackground: React.FC<{ configStr: string }> = ({ configStr }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let config: MeshConfig;
    try {
      config = JSON.parse(configStr.replace('dither:', ''));
    } catch {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false });
    if (!gl) return;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader warning/error:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_bg_color;
      uniform vec3 u_orb_colors[5];
      uniform vec4 u_orb_params[5]; 
      
      uniform sampler2D u_bayer_tex;
      uniform float u_pixel_size;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Apply domain warping to st coordinates for "cursive mountain flow" and "water/ocean" motion
        // The sine waves create a fluid displacement grid
        float t = u_time * 0.08; // extremely slow general time
        vec2 warp = vec2(
          sin(st.y * 3.5 + t) * 0.18 + cos(st.x * 2.1 - t * 0.8) * 0.12,
          cos(st.x * 3.2 - t * 1.1) * 0.20 + sin(st.y * 2.5 + t * 0.5) * 0.14
        );
        vec2 warped_st = st + warp;

        vec3 color = u_bg_color;

        for(int i = 0; i < 5; i++) {
          vec2 anchor = u_orb_params[i].xy;
          
          // Orbs drift incredibly slowly
          float offset_t = u_time * 0.02 + float(i) * 3.0;
          anchor += vec2(sin(offset_t), cos(offset_t * 0.8)) * 0.1;
          
          float inner = u_orb_params[i].z;
          float outer = u_orb_params[i].w * 1.2; // Expand slightly because of warp compression

          vec2 diff = warped_st - anchor;
          diff.x *= aspect; // maintain roughly circular origin before warp
          
          float dist = length(diff);
          
          float alpha = smoothstep(outer, inner, dist);
          color = mix(color, u_orb_colors[i], alpha);
        }

        // Apply 3px pixelation via Bayer matrix
        // Subtract tiny offset so it doesn't drift if resized perfectly
        vec2 pcoord = floor(gl_FragCoord.xy / u_pixel_size);
        vec2 bayer_uv = fract(pcoord / 8.0);
        
        float threshold = texture2D(u_bayer_tex, bayer_uv).r;
        
        // Soften the dither step size to match the pastel flowing look
        float amount = 0.10;
        color += (threshold - 0.5) * amount;
        
        // Smooth quantization (16 steps for creamy pixel flow)
        float steps = 16.0;
        color = floor(color * steps + 0.5) / steps;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uBgColor = gl.getUniformLocation(program, "u_bg_color");
    const uOrbColors = gl.getUniformLocation(program, "u_orb_colors");
    const uOrbParams = gl.getUniformLocation(program, "u_orb_params");
    const uBayerTex = gl.getUniformLocation(program, "u_bayer_tex");
    const uPixelSize = gl.getUniformLocation(program, "u_pixel_size");

    // Force exact 3px pixelation
    gl.uniform1f(uPixelSize, 3.0);

    const bayerArray = new Uint8Array([
       0, 32,  8, 40,  2, 34, 10, 42,
      48, 16, 56, 24, 50, 18, 58, 26,
      12, 44,  4, 36, 14, 46,  6, 38,
      60, 28, 52, 20, 62, 30, 54, 22,
       3, 35, 11, 43,  1, 33,  9, 41,
      51, 19, 59, 27, 49, 17, 57, 25,
      15, 47,  7, 39, 13, 45,  5, 37,
      63, 31, 55, 23, 61, 29, 53, 21
    ].map(v => (v / 64.0) * 255));

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 8, 8, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bayerArray);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.uniform1i(uBayerTex, 0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uPixelSize, 3.0);
    };

    window.addEventListener('resize', resize);
    resize();

    const bgRgb = hslToRgb(config.bg.h, config.bg.s, config.bg.l);
    gl.uniform3f(uBgColor, bgRgb[0], bgRgb[1], bgRgb[2]);

    const orbColorsFlat = new Float32Array(15);
    const orbParamsFlat = new Float32Array(20);
    
    config.orbs.slice(0, 5).forEach((orb, i) => {
      const rgb = hslToRgb(orb.c.h, orb.c.s, orb.c.l);
      orbColorsFlat[i * 3 + 0] = rgb[0];
      orbColorsFlat[i * 3 + 1] = rgb[1];
      orbColorsFlat[i * 3 + 2] = rgb[2];
      
      orbParamsFlat[i * 4 + 0] = orb.x / 100;
      orbParamsFlat[i * 4 + 1] = 1.0 - (orb.y / 100);
      orbParamsFlat[i * 4 + 2] = orb.in / 100;
      orbParamsFlat[i * 4 + 3] = orb.out / 100;
    });

    gl.uniform3fv(uOrbColors, orbColorsFlat);
    gl.uniform4fv(uOrbParams, orbParamsFlat);

    let animationId = 0;
    let lastTime = 0;
    const render = (time: number) => {
      animationId = requestAnimationFrame(render);
      const elapsed = time - lastTime;
      if(elapsed > 33) {
        lastTime = time - (elapsed % 33);
        gl.uniform1f(uTime, time / 1000.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };
    
    animationId = requestAnimationFrame((t) => { lastTime = t; render(t); });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [configStr]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
    />
  );
};
