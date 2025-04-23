import { NextResponse } from "next/server"

// In a real app, you would store analyzed URLs in a database
// For this example, we'll use a simple in-memory array
const analyzedUrls: string[] = []

export async function GET() {
  // Generate XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seo-analyzer.vercel.app/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${analyzedUrls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `,
    )
    .join("")}
</urlset>`

  // Return the XML response
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}

export async function POST(request: Request) {
  const { url } = await request.json()

  // Add URL to the list if it doesn't exist
  if (url && !analyzedUrls.includes(url)) {
    analyzedUrls.push(url)
  }

  return NextResponse.json({ success: true })
}
