"use client"

import { useState } from "react"
import type { SEOAnalysisResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Check, X, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ComparisonPDFButton from "./pdf/ComparisonPDFButton"

interface ComparisonViewProps {
  results: SEOAnalysisResult[]
}

export default function ComparisonView({ results }: ComparisonViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("lighthouse")

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  const getBestSite = (metric: string): number => {
    if (metric === "lighthouse") {
      return results.findIndex(
        (result) => result.lighthouseScore === Math.max(...results.map((r) => r.lighthouseScore)),
      )
    } else if (metric === "wordCount") {
      return results.findIndex((result) => result.wordCount === Math.max(...results.map((r) => r.wordCount)))
    } else if (metric === "readability") {
      return results.findIndex(
        (result) => result.readabilityScore === Math.max(...results.map((r) => r.readabilityScore)),
      )
    } else if (metric === "images") {
      return results.findIndex(
        (result) =>
          result.images.withAlt / (result.images.total || 1) ===
          Math.max(...results.map((r) => r.images.withAlt / (r.images.total || 1))),
      )
    } else if (metric === "links") {
      return results.findIndex((result) => result.links.total === Math.max(...results.map((r) => r.links.total)))
    } else if (metric === "headings") {
      return results.findIndex(
        (result) =>
          result.headings.h1.length + result.headings.h2.length ===
          Math.max(...results.map((r) => r.headings.h1.length + r.headings.h2.length)),
      )
    }
    return -1
  }

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comparaison des analyses SEO</h2>
        <ComparisonPDFButton results={results} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="technical">Technique</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer ${selectedMetric === "lighthouse" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("lighthouse")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Score Lighthouse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`text-center ${getBestSite("lighthouse") === index ? "font-bold" : ""}`}
                      >
                        <span className={`text-xl ${getScoreColor(result.lighthouseScore)}`}>
                          {result.lighthouseScore}
                        </span>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedMetric === "wordCount" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("wordCount")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Nombre de mots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`text-center ${getBestSite("wordCount") === index ? "font-bold" : ""}`}
                      >
                        <span className="text-xl">{result.wordCount}</span>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedMetric === "readability" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("readability")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Lisibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`text-center ${getBestSite("readability") === index ? "font-bold" : ""}`}
                      >
                        <span className={`text-xl ${getScoreColor(result.readabilityScore)}`}>
                          {result.readabilityScore}
                        </span>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer ${selectedMetric === "images" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("images")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Images avec alt (%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => {
                      const altPercentage =
                        result.images.total > 0 ? Math.round((result.images.withAlt / result.images.total) * 100) : 0
                      return (
                        <div
                          key={index}
                          className={`text-center ${getBestSite("images") === index ? "font-bold" : ""}`}
                        >
                          <span className={`text-xl ${getScoreColor(altPercentage)}`}>{altPercentage}%</span>
                          <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedMetric === "links" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("links")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Nombre de liens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => (
                      <div key={index} className={`text-center ${getBestSite("links") === index ? "font-bold" : ""}`}>
                        <span className="text-xl">{result.links.total}</span>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedMetric === "headings" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setSelectedMetric("headings")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Structure des titres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`text-center ${getBestSite("headings") === index ? "font-bold" : ""}`}
                      >
                        <span className="text-xl">
                          {result.headings.h1.length}/{result.headings.h2.length}
                        </span>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détails de la métrique sélectionnée</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMetric === "lighthouse" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Score Lighthouse</h3>
                    {results.map((result, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{result.url}</span>
                          <span className={getScoreColor(result.lighthouseScore)}>{result.lighthouseScore}</span>
                        </div>
                        <Progress value={result.lighthouseScore} className={getProgressColor(result.lighthouseScore)} />
                      </div>
                    ))}
                  </div>
                )}

                {selectedMetric === "wordCount" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Nombre de mots</h3>
                    {results.map((result, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{result.url}</span>
                          <span>{result.wordCount}</span>
                        </div>
                        <Progress value={Math.min((result.wordCount / 1000) * 100, 100)} className="bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}

                {selectedMetric === "readability" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Score de lisibilité</h3>
                    {results.map((result, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{result.url}</span>
                          <span className={getScoreColor(result.readabilityScore)}>{result.readabilityScore}</span>
                        </div>
                        <Progress
                          value={result.readabilityScore}
                          className={getProgressColor(result.readabilityScore)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedMetric === "images" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Images avec attribut alt</h3>
                    {results.map((result, index) => {
                      const altPercentage =
                        result.images.total > 0 ? Math.round((result.images.withAlt / result.images.total) * 100) : 0
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="truncate max-w-[200px]">{result.url}</span>
                            <span>
                              {result.images.withAlt}/{result.images.total} ({altPercentage}%)
                            </span>
                          </div>
                          <Progress value={altPercentage} className={getProgressColor(altPercentage)} />
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedMetric === "links" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Répartition des liens</h3>
                    {results.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{result.url}</span>
                          <span>{result.links.total} liens au total</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-blue-500">
                            {result.links.internal} internes (
                            {Math.round((result.links.internal / result.links.total) * 100)}%)
                          </Badge>
                          <Badge className="bg-purple-500">
                            {result.links.external} externes (
                            {Math.round((result.links.external / result.links.total) * 100)}%)
                          </Badge>
                          {result.links.broken > 0 && (
                            <Badge className="bg-red-500">
                              {result.links.broken} cassés (
                              {Math.round((result.links.broken / result.links.total) * 100)}%)
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedMetric === "headings" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Structure des titres</h3>
                    {results.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[200px]">{result.url}</span>
                          <span>
                            H1: {result.headings.h1.length}, H2: {result.headings.h2.length}, H3:{" "}
                            {result.headings.h3.length}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={result.headings.h1.length === 1 ? "bg-green-500" : "bg-red-500"}>
                            {result.headings.h1.length} H1
                          </Badge>
                          <Badge className={result.headings.h2.length > 0 ? "bg-green-500" : "bg-amber-500"}>
                            {result.headings.h2.length} H2
                          </Badge>
                          <Badge className="bg-blue-500">{result.headings.h3.length} H3</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison du contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Site</th>
                        <th className="text-left py-2">Mots</th>
                        <th className="text-left py-2">Lisibilité</th>
                        <th className="text-left py-2">H1</th>
                        <th className="text-left py-2">H2</th>
                        <th className="text-left py-2">Images</th>
                        <th className="text-left py-2">Mots-clés principaux</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 truncate max-w-[150px]">{result.url}</td>
                          <td className="py-2">{result.wordCount}</td>
                          <td className="py-2">
                            <span className={getScoreColor(result.readabilityScore)}>{result.readabilityScore}</span>
                          </td>
                          <td className="py-2">{result.headings.h1.length}</td>
                          <td className="py-2">{result.headings.h2.length}</td>
                          <td className="py-2">
                            {result.images.withAlt}/{result.images.total}
                          </td>
                          <td className="py-2">
                            {result.keywordDensity.slice(0, 3).map((kw, i) => (
                              <span key={i} className="inline-block mr-2 text-xs">
                                {kw.keyword} ({kw.density}%)
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mots-clés communs</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 1 ? (
                  <div>
                    <p className="text-sm mb-4">Mots-clés qui apparaissent dans plusieurs sites analysés :</p>
                    <div className="flex flex-wrap gap-2">
                      {findCommonKeywords(results).map((keyword, index) => (
                        <Badge key={index} className="bg-emerald-500">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    {findCommonKeywords(results).length === 0 && (
                      <p className="text-sm text-gray-500">Aucun mot-clé commun trouvé</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Analysez au moins deux sites pour voir les mots-clés communs</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison technique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Site</th>
                        <th className="text-left py-2">Meta Description</th>
                        <th className="text-left py-2">Canonical</th>
                        <th className="text-left py-2">Open Graph</th>
                        <th className="text-left py-2">Données structurées</th>
                        <th className="text-left py-2">URL propre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 truncate max-w-[150px]">{result.url}</td>
                          <td className="py-2">
                            {result.metaDescription ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                          <td className="py-2">
                            {result.canonical ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                          <td className="py-2">
                            {result.metaTags.ogTitle && result.metaTags.ogDescription ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : result.metaTags.ogTitle || result.metaTags.ogDescription ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                          <td className="py-2">
                            {result.structuredData.some((sd) => sd.found) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                          <td className="py-2">
                            {result.urlStructure.isClean ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="truncate max-w-[200px]">{result.url}</span>
                        <span className={getScoreColor(result.lighthouseScore)}>Score: {result.lighthouseScore}</span>
                      </div>
                      <Progress value={result.lighthouseScore} className={getProgressColor(result.lighthouseScore)} />
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {result.lighthouseMetrics.map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <p className="truncate">{metric.name}</p>
                            <span className={getScoreColor(metric.score * 100)}>{Math.round(metric.score * 100)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations par site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold truncate">{result.url}</h3>
                      <div className="space-y-2">
                        {result.recommendations
                          .filter((rec) => rec.severity === "high")
                          .map((rec, idx) => (
                            <div key={idx} className="flex items-start">
                              <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{rec.text}</span>
                            </div>
                          ))}
                        {result.recommendations.filter((rec) => rec.severity === "high").length === 0 && (
                          <p className="text-sm text-green-500">Aucun problème critique détecté pour ce site</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Problèmes communs</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 1 ? (
                  <div className="space-y-4">
                    <p className="text-sm">Problèmes qui apparaissent dans plusieurs sites :</p>
                    <div className="space-y-2">
                      {findCommonIssues(results).map((issue, index) => (
                        <div key={index} className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))}
                      {findCommonIssues(results).length === 0 && (
                        <p className="text-sm text-gray-500">Aucun problème commun détecté</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Analysez au moins deux sites pour voir les problèmes communs</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// Fonction pour trouver les mots-clés communs entre les sites
function findCommonKeywords(results: SEOAnalysisResult[]): string[] {
  if (results.length <= 1) return []

  const keywordSets = results.map((result) => new Set(result.keywordDensity.map((kw) => kw.keyword)))

  const commonKeywords = [...keywordSets[0]].filter((keyword) => keywordSets.slice(1).every((set) => set.has(keyword)))

  return commonKeywords
}

// Fonction pour trouver les problèmes communs entre les sites
function findCommonIssues(results: SEOAnalysisResult[]): string[] {
  if (results.length <= 1) return []

  const issueTexts = results.map((result) => result.recommendations.map((rec) => rec.text))

  const allIssues = issueTexts.flat()
  const issueCounts = allIssues.reduce(
    (acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(issueCounts)
    .filter(([_, count]) => count > 1)
    .map(([issue]) => issue)
}
