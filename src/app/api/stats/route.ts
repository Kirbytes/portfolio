import { NextResponse } from 'next/server';

export async function GET() {
  const websiteId = '68a0413b-1279-4458-bd20-be613265bc5f';
  // Note: For production, you should use an environment variable for the token
  const apiToken = process.env.UMAMI_API_TOKEN;

  // If no token is provided yet, we return 1s (as a visible sign it's trying) but with a config status
  if (!apiToken) {
    return NextResponse.json({
      visitors: 0,
      pageviews: 0,
      status: 'MISSING_API_TOKEN',
      message: 'Add UMAMI_API_TOKEN to your environment variables.'
    });
  }

  try {
    const now = Date.now();
    const startAt = now - 30 * 24 * 60 * 60 * 1000; // Last 30 days

    // Fetch stats from Umami API
    const res = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${now}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!res.ok) throw new Error('Failed to fetch from Umami');
    
    const data = await res.json();
    
    return NextResponse.json({
      visitors: data.visitors.value,
      pageviews: data.pageviews.value,
      status: 'LIVE'
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ visitors: 0, pageviews: 0, status: 'ERROR' }, { status: 500 });
  }
}
