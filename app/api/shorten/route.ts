import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { generateSlug, generateStatsKey } from '../../../lib/slug';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const slug = generateSlug();
    const statsKey = generateStatsKey();
    const db = await getDb();
    await db.run(
      'INSERT INTO links (slug, destination, stats_key) VALUES (?, ?, ?)',
      slug, url, statsKey
    );
    const shortUrl = `https://url.topb.dev/${slug}`;
    const statsUrl = `https://url.topb.dev/stats/${slug}?key=${statsKey}`;
    return NextResponse.json({ shortUrl, statsUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}