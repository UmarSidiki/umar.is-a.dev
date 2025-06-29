import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  const baseUrl = 'https://umarsiddiqui.dev' // Replace with your actual domain

  try {
    const db = await getDatabase()
    const collection = db.collection('blogposts')
    
    const posts = await collection
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    const rssItems = posts.map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.excerpt}]]></description>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
        <author>siddiquiumar0007@gmail.com (Umar Siddiqui)</author>
        <category>${post.category}</category>
        ${post.tags ? post.tags.map((tag: string) => `<category>${tag}</category>`).join('\n        ') : ''}
      </item>
    `).join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Umar Siddiqui Blog</title>
        <description>Web development articles, tutorials, and insights about modern programming technologies</description>
        <link>${baseUrl}/blog</link>
        <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
        <language>en-US</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <managingEditor>siddiquiumar0007@gmail.com (Umar Siddiqui)</managingEditor>
        <webMaster>siddiquiumar0007@gmail.com (Umar Siddiqui)</webMaster>
        <generator>Next.js</generator>
        <image>
          <url>${baseUrl}/api/og?type=rss</url>
          <title>Umar Siddiqui Blog</title>
          <link>${baseUrl}/blog</link>
          <width>1200</width>
          <height>630</height>
        </image>
        ${rssItems}
      </channel>
    </rss>`

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
