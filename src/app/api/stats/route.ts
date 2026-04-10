import { NextResponse } from 'next/server';

export async function GET() {
  const websiteId = '68a0413b-1279-4458-bd20-be613265bc5f';
  const apiToken = process.env.UMAMI_API_TOKEN || process.env.UMAMI_API_KEY;

  if (!apiToken) {
    return NextResponse.json({
      visitors: 0,
      pageviews: 0,
      status: 'MISSING_API_TOKEN'
    });
  }

  try {
    const now = Date.now();
    const startAt = now - 30 * 24 * 60 * 60 * 1000; // Last 30 days

    // We try both headers to ensure maximum compatibility with different Umami Cloud regions/versions
    const res = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${now}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'x-umami-api-key': apiToken,
        'Accept': 'application/json'
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Umami API error:', res.status, errorText);
      return NextResponse.json({ status: 'API_ERROR', code: res.status, visitors: 0, pageviews: 0 });
    }
    
    const data = await res.json();
    console.log('Umami API Raw Data:', data);

    // Support both the "value" object structure and the flat number structure
    const visitors = typeof data.visitors === 'object' ? (data.visitors.value ?? 0) : (data.visitors ?? 0);
    const pageviews = typeof data.pageviews === 'object' ? (data.pageviews.value ?? 0) : (data.pageviews ?? 0);
    
    return NextResponse.json({
      visitors: visitors,
      pageviews: pageviews,
      status: 'LIVE',
      raw: data // For debugging if needed
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ visitors: 0, pageviews: 0, status: 'FETCH_FAILED' }, { status: 500 });
  }
}
