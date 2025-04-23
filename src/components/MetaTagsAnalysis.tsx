"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface MetaTagsAnalysisProps {
  metaTags: {
    robots: string | null
    viewport: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
  }
  canonical: string | null
}

export default function MetaTagsAnalysis({ metaTags, canonical }: MetaTagsAnalysisProps) {
  const metaTagsList = [
    {
      name: "Canonical",
      value: canonical,
      description: "Indique la version préférée d'une page aux moteurs de recherche",
    },
    {
      name: "Robots",
      value: metaTags.robots,
      description: "Contrôle comment les moteurs de recherche indexent et suivent votre page",
    },
    {
      name: "Viewport",
      value: metaTags.viewport,
      description: "Optimise l'affichage sur les appareils mobiles",
    },
    {
      name: "Open Graph Title",
      value: metaTags.ogTitle,
      description: "Titre utilisé lors du partage sur les réseaux sociaux",
    },
    {
      name: "Open Graph Description",
      value: metaTags.ogDescription,
      description: "Description utilisée lors du partage sur les réseaux sociaux",
    },
    {
      name: "Open Graph Image",
      value: metaTags.ogImage,
      description: "Image utilisée lors du partage sur les réseaux sociaux",
    },
    {
      name: "Twitter Card",
      value: metaTags.twitterCard,
      description: "Contrôle l'apparence lors du partage sur Twitter",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balises Meta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metaTagsList.map((tag, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-1">
                {tag.value ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <h3 className="font-semibold">{tag.name}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">{tag.description}</p>
              {tag.value ? (
                <p className="text-sm break-all bg-gray-100 dark:bg-gray-700 p-2 rounded">{tag.value}</p>
              ) : (
                <p className="text-sm text-red-500">Non défini</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
