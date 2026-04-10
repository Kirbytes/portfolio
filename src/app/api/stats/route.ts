import { NextResponse } from 'next/server';

export async function GET() {
  const websiteId = '68a0413b-1279-4458-bd20-be613265bc5f';
  // Note: For production, you should use an environment variable for the token
  // Checks for the API key in environment variables
  const apiToken = process.env.UMAMI_API_TOKEN || process.env.UMAMI_API_KEY;

  if (!apiToken) {
    return NextResponse.json({
      visitors: 0,
      pageviews: 0,
      status: 'MISSING_API_TOKEN',
      message: 'Add UMAMI_API_TOKEN or UMAMI_API_KEY to your environment variables.'
    });
  }

  try {
    const now = Date.now();
    const startAt = now - 30 * 24 * 60 * 60 * 1000; // Last 30 days

    // Fetch stats from Umami Cloud API using the specific header x-umami-api-key
    const res = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${now}`, {
      headers: {
        'x-umami-api-key': apiToken,
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
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
