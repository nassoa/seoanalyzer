"use client"

import type { KeywordDensity } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface KeywordAnalysisProps {
  keywords: KeywordDensity[]
  readabilityScore: number
}

export default function KeywordAnalysis({ keywords, readabilityScore }: KeywordAnalysisProps) {
  const getReadabilityLabel = (score: number) => {
    if (score >= 80) return "Très facile à lire"
    if (score >= 60) return "Facile à lire"
    if (score >= 40) return "Moyennement difficile"
    if (score >= 20) return "Difficile à lire"
    return "Très difficile à lire"
  }

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-emerald-500"
    if (score >= 40) return "text-amber-500"
    if (score >= 20) return "text-orange-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-emerald-500"
    if (score >= 40) return "bg-amber-500"
    if (score >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse du contenu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Score de lisibilité</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getReadabilityColor(readabilityScore)}`}>
                  {readabilityScore}
                </span>
              </div>
              <svg className="h-32 w-32" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={
                    readabilityScore >= 80
                      ? "#22c55e"
                      : readabilityScore >= 60
                        ? "#10b981"
                        : readabilityScore >= 40
                          ? "#f59e0b"
                          : readabilityScore >= 20
                            ? "#f97316"
                            : "#ef4444"
                  }
                  strokeWidth="2"
                  strokeDasharray={`${readabilityScore}, 100`}
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm mb-2">
            <span className={getReadabilityColor(readabilityScore)}>{getReadabilityLabel(readabilityScore)}</span>
          </p>
          <p className="text-xs text-center text-gray-500">
            {readabilityScore >= 60
              ? "Votre contenu est facile à lire et accessible à un large public."
              : readabilityScore >= 40
                ? "Votre contenu est moyennement difficile. Essayez de simplifier certaines phrases."
                : "Votre contenu est difficile à lire. Utilisez des phrases plus courtes et un vocabulaire plus simple."}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Tag className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-semibold">Mots-clés principaux</h3>
          </div>
          {keywords.length > 0 ? (
            <div className="space-y-3">
              {keywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{keyword.keyword}</span>
                    <span>
                      {keyword.count} ({keyword.density}%)
                    </span>
                  </div>
                  <Progress value={keyword.density * 10} className="bg-emerald-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun mot-clé significatif trouvé</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
