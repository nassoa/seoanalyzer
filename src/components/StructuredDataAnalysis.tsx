"use client"

import type { StructuredData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Code } from "lucide-react"

interface StructuredDataAnalysisProps {
  structuredData: StructuredData[]
}

export default function StructuredDataAnalysis({ structuredData }: StructuredDataAnalysisProps) {
  const hasAnyStructuredData = structuredData.some((data) => data.found)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Données structurées (Schema.org)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAnyStructuredData ? (
          <div className="space-y-4">
            {structuredData
              .filter((data) => data.found)
              .map((data, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="font-semibold">{data.type}</h3>
                  </div>
                  {data.properties && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Propriétés :</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.properties.map((prop, idx) => (
                          <span key={idx} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <X className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-semibold">Aucune donnée structurée trouvée</h3>
            </div>
            <p className="text-sm text-gray-500">
              Les données structurées aident les moteurs de recherche à comprendre le contenu de votre page et peuvent
              améliorer l'affichage dans les résultats de recherche (rich snippets).
            </p>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Types de données structurées recommandés</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">
              <span className="font-medium">Article</span> - Pour les pages de blog ou d'actualités
            </li>
            <li className="text-sm">
              <span className="font-medium">Product</span> - Pour les pages de produits
            </li>
            <li className="text-sm">
              <span className="font-medium">Organization</span> - Pour les informations sur votre entreprise
            </li>
            <li className="text-sm">
              <span className="font-medium">LocalBusiness</span> - Pour les entreprises locales
            </li>
            <li className="text-sm">
              <span className="font-medium">FAQPage</span> - Pour les pages de FAQ
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
