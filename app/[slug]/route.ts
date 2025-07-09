import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { recordClick } from '@/lib/recorder';

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = await context.params;
  const db = await getDb();
  const link = await db.get<{ id: number; destination: string }>(
    'SELECT id, destination FROM links WHERE slug = ?',
    slug
  );
  if (!link) {
    return NextResponse.redirect('/404', 302);
  }

  const referrer = request.headers.get('referer');
  const userAgent = request.headers.get('user-agent');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || null;
  console.log(request.headers)
  await recordClick(link.id, referrer, userAgent, ip);

  let dest = link.destination;
  if (!/^https?:\/\//i.test(dest)) dest = 'https://' + dest;
  return NextResponse.redirect(dest, 302);
}