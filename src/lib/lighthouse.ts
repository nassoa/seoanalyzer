"use server"

import type { LighthouseMetric } from "./types"

export async function getLighthouseScore(url: string): Promise<{
  score: number
  metrics: LighthouseMetric[]
}> {
  try {
    const API_KEY = process.env.PAGESPEED_API_KEY

    if (!API_KEY) {
      throw new Error("PageSpeed API key is not configured")
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile`

    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract the overall score
    const score = Math.round(data.lighthouseResult.categories.performance.score * 100)

    // Extract key metrics
    const metrics: LighthouseMetric[] = [
      {
        name: "First Contentful Paint",
        score: data.lighthouseResult.audits["first-contentful-paint"].score,
      },
      {
        name: "Largest Contentful Paint",
        score: data.lighthouseResult.audits["largest-contentful-paint"].score,
      },
      {
        name: "Total Blocking Time",
        score: data.lighthouseResult.audits["total-blocking-time"].score,
      },
      {
        name: "Cumulative Layout Shift",
        score: data.lighthouseResult.audits["cumulative-layout-shift"].score,
      },
      {
        name: "Speed Index",
        score: data.lighthouseResult.audits["speed-index"].score,
      },
    ]

    return {
      score,
      metrics,
    }
  } catch (error) {
    console.error("Error fetching Lighthouse score:", error)

    // Return fallback data in case of error
    return {
      score: 0,
      metrics: [
        { name: "First Contentful Paint", score: 0 },
        { name: "Largest Contentful Paint", score: 0 },
        { name: "Total Blocking Time", score: 0 },
        { name: "Cumulative Layout Shift", score: 0 },
        { name: "Speed Index", score: 0 },
      ],
    }
  }
}
