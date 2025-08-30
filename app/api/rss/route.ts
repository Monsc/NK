import { NextResponse } from 'next/server'

export async function GET() {
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>NoKing - Democratic UK</title>
    <link>https://noking.org</link>
    <description>Advocating for a democratic UK without hereditary privilege</description>
    <item>
      <title>Latest Royal Expenses Revealed</title>
      <link>https://noking.org/latest/royal-expenses-2024</link>
      <description>The latest figures show increasing costs to taxpayers</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
    <item>
      <title>Public Support for Republic Grows</title>
      <link>https://noking.org/latest/public-opinion-poll</link>
      <description>Recent polls show declining support for hereditary privilege</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`

  return new NextResponse(rssContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
