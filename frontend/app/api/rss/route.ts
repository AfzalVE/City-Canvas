import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await req.json().catch(() => ({}));
    const backendUrl = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const res = await fetch(`${backendUrl}/rss-feeds/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'RSS fetch failed' }, { status: 500 });
  }
}
