import React from 'react';
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';

type StatsByDay = { date: string; count: number };
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ key?: string }> };

export default async function StatsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { key } = await searchParams;
  if (!key || typeof key !== 'string') notFound();

  const db = await getDb();
  const link = await db.get<{ id: number; stats_key: string }>(
    'SELECT id, stats_key FROM links WHERE slug = ?',
    slug
  );
  if (!link || link.stats_key !== key) notFound();

  const totalRes = await db.get<{ count: number }>(
    'SELECT COUNT(*) as count FROM clicks WHERE link_id = ?',
    link.id
  );
  const byDay: StatsByDay[] = await db.all(
    `SELECT DATE(timestamp) as date, COUNT(*) as count
     FROM clicks
     WHERE link_id = ?
     GROUP BY DATE(timestamp)
     ORDER BY DATE(timestamp)`,
    link.id
  );
  console.log(byDay)
  

  const totalClicks = totalRes?.count ?? 0;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Clicks stats</h1>
      <p className="mb-2">Total clicks: {totalClicks}</p>
      <table className="w-full table-auto">
        <thead>
          <tr><th className="px-2 py-1">Date</th><th className="px-2 py-1">Clicks</th></tr>
        </thead>
        <tbody>
          {byDay.map(({ date, count }) => (
            <tr key={date}>
              <td className="border px-2 py-1">{date}</td>
              <td className="border px-2 py-1">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}