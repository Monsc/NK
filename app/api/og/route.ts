import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'NoKing - Democratic UK'
  const description = searchParams.get('description') || 'Advocating for a democratic UK'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://noking.org" />
        <meta property="og:image" content="https://noking.org/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
