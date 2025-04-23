"use client";

import { CardContent } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import type { SEOAnalysisResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  AlertTriangle,
  X,
  FileText,
  ImageIcon,
  Type,
  Heading1,
  Gauge,
  Info,
} from "lucide-react";
import HeadingsAnalysis from "./HeadingsAnalysis";
import ImagesAnalysis from "./ImagesAnalysis";
import LinksAnalysis from "./LinksAnalysis";
import KeywordAnalysis from "./KeywordAnalysis";
import MetaTagsAnalysis from "./MetaTagsAnalysis";
import StructuredDataAnalysis from "./StructuredDataAnalysis";
import AnalysisPDFButton from "./pdf/AnalysisPDFButton";
// Remplacer l'import de SimplePerformanceCharts par ChartJsPerformanceCharts
import ChartJsPerformanceCharts from "./ChartJsPerformanceCharts";

interface ResultsSectionProps {
  results: SEOAnalysisResult;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Résultats de l'analyse SEO</h2>
        <AnalysisPDFButton result={results} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="technical">Technique</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                <h3 className="font-semibold">Titre</h3>
              </div>
              <p className="text-sm">{results.title || "Non défini"}</p>
              <div className="mt-2 flex items-center">
                {results.title ? (
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="text-xs">
                  {results.title ? "Présent" : "Manquant"}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="h-5 w-5 mr-2 text-emerald-600" />
                <h3 className="font-semibold">Meta Description</h3>
              </div>
              <p className="text-sm">
                {results.metaDescription || "Non définie"}
              </p>
              <div className="mt-2 flex items-center">
                {results.metaDescription ? (
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="text-xs">
                  {results.metaDescription ? "Présente" : "Manquante"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <Heading1 className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{results.h1Count}</p>
              <p className="text-xs text-gray-500">Balises H1</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <ImageIcon className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{results.imagesCount}</p>
              <p className="text-xs text-gray-500">Images</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <Type className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{results.wordCount}</p>
              <p className="text-xs text-gray-500">Mots</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <Gauge className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
              <p
                className={`text-2xl font-bold ${getScoreColor(
                  results.lighthouseScore
                )}`}
              >
                {results.lighthouseScore}
              </p>
              <p className="text-xs text-gray-500">Score Lighthouse</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Recommandations principales</h3>
            <ul className="space-y-2">
              {results.recommendations
                .slice(0, 5)
                .map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    {recommendation.severity === "high" ? (
                      <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : recommendation.severity === "medium" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">{recommendation.text}</span>
                  </li>
                ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KeywordAnalysis
              keywords={results.keywordDensity}
              readabilityScore={results.readabilityScore}
            />
            <HeadingsAnalysis headings={results.headings} />
          </div>
          <ImagesAnalysis images={results.images} />
          <LinksAnalysis links={results.links} />
        </TabsContent>

        <TabsContent value="technical" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetaTagsAnalysis
              metaTags={results.metaTags}
              canonical={results.canonical}
            />
            <StructuredDataAnalysis structuredData={results.structuredData} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Structure de l'URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">URL analysée</h3>
                <p className="text-sm break-all bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {results.url}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    {results.urlStructure.isClean ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="text-sm">
                      URL propre{" "}
                      {results.urlStructure.isClean
                        ? "(sans paramètres dynamiques)"
                        : "(contient des paramètres dynamiques)"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    {results.urlStructure.length <= 100 ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    )}
                    <span className="text-sm">
                      Longueur: {results.urlStructure.length} caractères{" "}
                      {results.urlStructure.length <= 100
                        ? "(bonne longueur)"
                        : "(trop longue)"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remplacer l'utilisation de SimplePerformanceCharts par ChartJsPerformanceCharts dans la section performance */}
        <TabsContent value="performance" className="space-y-6 mt-4">
          {/* Utilisation du composant Chart.js */}
          <ChartJsPerformanceCharts
            lighthouseScore={results.lighthouseScore}
            lighthouseMetrics={results.lighthouseMetrics}
          />

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Recommandations de performance
            </h3>
            <ul className="space-y-2">
              {results.recommendations
                .filter(
                  (rec) =>
                    rec.text.toLowerCase().includes("performance") ||
                    rec.text.toLowerCase().includes("vitesse") ||
                    rec.text.toLowerCase().includes("chargement") ||
                    rec.text.toLowerCase().includes("temps") ||
                    rec.text.toLowerCase().includes("optimis") ||
                    rec.text.toLowerCase().includes("image") ||
                    rec.text.toLowerCase().includes("css") ||
                    rec.text.toLowerCase().includes("javascript") ||
                    rec.text.toLowerCase().includes("cache") ||
                    rec.text.toLowerCase().includes("mobile") ||
                    rec.text.toLowerCase().includes("lighthouse")
                )
                .map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    {recommendation.severity === "high" ? (
                      <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : recommendation.severity === "medium" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">{recommendation.text}</span>
                  </li>
                ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
