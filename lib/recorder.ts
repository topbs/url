import { getDb } from './db';

export async function recordClick(
  linkId: number,
  referrer: string | null,
  userAgent: string | null,
  ip: string | null
) {
  const db = await getDb();
  await db.run(
    'INSERT INTO clicks (link_id, referrer, user_agent, ip) VALUES (?, ?, ?, ?)',
    linkId, referrer, userAgent, ip
  );
}