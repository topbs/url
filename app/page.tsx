"use client";
import React, { useState, FormEvent } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [statsUrl, setStatsUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.shortUrl);
        setStatsUrl(data.statsUrl);
      } else {
        setError(data.error || 'error');
      }
    } catch (err) {
      setError('network error: ' + (err instanceof Error ? err.message : 'unknown error'));
    }
  }

  return (
    <div className="w-full h-full mx-auto p-3 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-4">url shortener</h1>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          placeholder="enter link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow border rounded-l px-3 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Shorten
        </button>
      </form>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {shortUrl && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Short url: <a href={shortUrl} className="text-blue-600">{shortUrl}</a></p>
          <p>Stats: <a href={statsUrl} className="text-blue-600">{statsUrl}</a></p>
        </div>
      )}
    </div>
  );
}