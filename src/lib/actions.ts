"use server";

import type {
  SEOAnalysisResult,
  HeadingStructure,
  ImageAnalysis,
  LinkAnalysis,
  StructuredData,
} from "./types";
import * as cheerio from "cheerio";
import { getLighthouseScore } from "./lighthouse";
import { generateRecommendations } from "./recommendations";
import { calculateReadability } from "./readability";
import { extractKeywords } from "./keywords";

export async function analyzeUrl(url: string): Promise<SEOAnalysisResult> {
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SEO Analyzer Bot/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch URL: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Parse the HTML with cheerio
    const $ = cheerio.load(html);

    // Extract basic SEO elements
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const h1Tags = $("h1")
      .map((_, el) => $(el).text().trim())
      .get();
    const h1Count = h1Tags.length;
    const imagesCount = $("img").length;

    // Count words in the visible text
    const bodyText = $("body").text();
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

    // Get canonical URL
    const canonical = $('link[rel="canonical"]').attr("href") || null;

    // Calculate content score (simple metric based on word count)
    const contentScore = Math.min(Math.round((wordCount / 300) * 100), 100);

    // Get Lighthouse score
    const lighthouseData = await getLighthouseScore(url);

    // Analyze headings structure
    const headings: HeadingStructure = {
      h1: h1Tags,
      h2: $("h2")
        .map((_, el) => $(el).text().trim())
        .get(),
      h3: $("h3")
        .map((_, el) => $(el).text().trim())
        .get(),
      h4: $("h4")
        .map((_, el) => $(el).text().trim())
        .get(),
      h5: $("h5")
        .map((_, el) => $(el).text().trim())
        .get(),
      h6: $("h6")
        .map((_, el) => $(el).text().trim())
        .get(),
    };

    // Calculate readability score
    const readabilityScore = calculateReadability(bodyText);

    // Extract keyword density
    const keywordDensity = extractKeywords(bodyText);

    // Analyze images
    const images: ImageAnalysis = analyzeImages($);

    // Analyze links
    const links: LinkAnalysis = analyzeLinks($, url);

    // Analyze URL structure
    const urlStructure = {
      isClean: !url.includes("?") && !url.includes("&"),
      hasDynamicParameters: url.includes("?") || url.includes("&"),
      length: url.length,
    };

    // Extract structured data
    const structuredData = extractStructuredData($);

    // Extract meta tags
    const metaTags = {
      robots: $('meta[name="robots"]').attr("content") || null,
      viewport: $('meta[name="viewport"]').attr("content") || null,
      ogTitle: $('meta[property="og:title"]').attr("content") || null,
      ogDescription:
        $('meta[property="og:description"]').attr("content") || null,
      ogImage: $('meta[property="og:image"]').attr("content") || null,
      twitterCard: $('meta[name="twitter:card"]').attr("content") || null,
    };

    // Generate recommendations based on the analysis
    const recommendations = generateRecommendations({
      title,
      metaDescription,
      h1Count,
      imagesCount,
      wordCount,
      lighthouseScore: lighthouseData.score,
      lighthouseMetrics: lighthouseData.metrics,
      headings,
      images,
      links,
      readabilityScore,
      urlStructure,
      structuredData,
      metaTags,
    });

    // Add the analyzed URL to the sitemap (in a real app, this would be stored in a database)
    await updateSitemap(url);

    return {
      url,
      title,
      metaDescription,
      h1Count,
      h1Tags,
      imagesCount,
      wordCount,
      lighthouseScore: lighthouseData.score,
      lighthouseMetrics: lighthouseData.metrics,
      contentScore,
      recommendations,
      canonical,
      headings,
      readabilityScore,
      keywordDensity,
      images,
      links,
      urlStructure,
      structuredData,
      metaTags,
    };
  } catch (error) {
    console.error("Error analyzing URL:", error);

    // Return a more informative error message
    if (error instanceof Error) {
      throw new Error(`Échec de l'analyse : ${error.message}`);
    }
    throw new Error("Échec de l'analyse de l'URL");
  }
}

function analyzeImages($: cheerio.CheerioAPI): ImageAnalysis {
  const images = $("img");
  const imagesList: Array<{
    src: string;
    alt: string | null;
    hasAlt: boolean;
  }> = [];
  let withAlt = 0;
  let withoutAlt = 0;

  images.each((_, img) => {
    const src = $(img).attr("src") || "";
    const alt = $(img).attr("alt");
    const hasAlt = alt !== undefined && alt !== "";

    if (hasAlt) {
      withAlt++;
    } else {
      withoutAlt++;
    }

    imagesList.push({
      src,
      alt: alt ?? null,
      hasAlt,
    });
  });

  return {
    total: images.length,
    withAlt,
    withoutAlt,
    images: imagesList,
  };
}

function analyzeLinks($: cheerio.CheerioAPI, baseUrl: string): LinkAnalysis {
  const links = $("a");
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  const brokenLinks: string[] = [];

  // Parse the base URL to get the domain
  let domain: string;
  try {
    const urlObj = new URL(baseUrl);
    domain = urlObj.hostname;
  } catch (e) {
    domain = baseUrl;
  }

  links.each((_, link) => {
    const href = $(link).attr("href");
    if (!href) return;

    try {
      const url = new URL(href, baseUrl);
      if (url.hostname === domain) {
        internalLinks.push(href);
      } else {
        externalLinks.push(href);
      }
    } catch (e) {
      // Relative URLs or malformed URLs
      if (
        href.startsWith("/") ||
        href.startsWith("#") ||
        href.startsWith("./") ||
        href.startsWith("../")
      ) {
        internalLinks.push(href);
      } else if (href.startsWith("http")) {
        externalLinks.push(href);
      } else {
        brokenLinks.push(href);
      }
    }
  });

  return {
    total: links.length,
    internal: internalLinks.length,
    external: externalLinks.length,
    broken: brokenLinks.length,
    internalLinks,
    externalLinks,
    brokenLinks,
  };
}

function extractStructuredData($: cheerio.CheerioAPI): StructuredData[] {
  const structuredData: StructuredData[] = [];
  const jsonLdScripts = $('script[type="application/ld+json"]');

  jsonLdScripts.each((_, script) => {
    try {
      const content = $(script).html();
      if (content) {
        const data = JSON.parse(content);
        const type = data["@type"] || "Unknown";
        structuredData.push({
          type,
          found: true,
          properties: Object.keys(data),
        });
      }
    } catch (e) {
      // Invalid JSON
    }
  });

  // Check for common schema types if none found
  if (structuredData.length === 0) {
    const commonTypes = [
      "Organization",
      "Person",
      "WebSite",
      "Article",
      "Product",
      "BreadcrumbList",
    ];
    commonTypes.forEach((type) => {
      structuredData.push({
        type,
        found: false,
      });
    });
  }

  return structuredData;
}

// This would typically store URLs in a database
// For this example, we'll just log it
async function updateSitemap(url: string) {
  console.log(`Added ${url} to sitemap`);
  // In a real app, you would store this in a database
}
