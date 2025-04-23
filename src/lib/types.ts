export interface LighthouseMetric {
  name: string
  score: number
}

export interface SEORecommendation {
  text: string
  severity: "high" | "medium" | "low"
}

export interface HeadingStructure {
  h1: string[]
  h2: string[]
  h3: string[]
  h4: string[]
  h5: string[]
  h6: string[]
}

export interface ImageAnalysis {
  total: number
  withAlt: number
  withoutAlt: number
  images: Array<{
    src: string
    alt: string | null
    hasAlt: boolean
  }>
}

export interface LinkAnalysis {
  total: number
  internal: number
  external: number
  broken: number
  internalLinks: string[]
  externalLinks: string[]
  brokenLinks: string[]
}

export interface KeywordDensity {
  keyword: string
  count: number
  density: number
}

export interface StructuredData {
  type: string
  found: boolean
  properties?: string[]
}

export interface SEOAnalysisResult {
  url: string
  title: string
  metaDescription: string
  h1Count: number
  h1Tags: string[]
  imagesCount: number
  wordCount: number
  lighthouseScore: number
  lighthouseMetrics: LighthouseMetric[]
  contentScore: number
  recommendations: SEORecommendation[]
  canonical: string | null

  // Nouvelles propriétés
  headings: HeadingStructure
  readabilityScore: number
  keywordDensity: KeywordDensity[]
  images: ImageAnalysis
  links: LinkAnalysis
  urlStructure: {
    isClean: boolean
    hasDynamicParameters: boolean
    length: number
  }
  structuredData: StructuredData[]
  metaTags: {
    robots: string | null
    viewport: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
  }
}
