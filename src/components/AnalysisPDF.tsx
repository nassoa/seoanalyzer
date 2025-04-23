"use client"

import { useState, useEffect } from "react"
import type { SEOAnalysisResult, LighthouseMetric } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import dynamic from "next/dynamic"

// Styles pour le PDF
const styles = {
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#10b981",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: "#10b981",
    fontWeight: "bold",
  },
  url: {
    fontSize: 14,
    marginBottom: 15,
    color: "#4b5563",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    width: "40%",
    fontSize: 12,
    color: "#4b5563",
  },
  value: {
    width: "60%",
    fontSize: 12,
    color: "#111827",
  },
  scoreGood: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  scoreMedium: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
  scoreBad: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  recommendationTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  recommendation: {
    fontSize: 10,
    marginBottom: 5,
    flexDirection: "row",
  },
  recommendationText: {
    flex: 1,
    paddingLeft: 5,
  },
  recommendationHigh: {
    color: "#ef4444",
  },
  recommendationMedium: {
    color: "#f59e0b",
  },
  recommendationLow: {
    color: "#3b82f6",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
}

// Composant pour le PDF d'analyse individuelle - sera chargé dynamiquement
const PDFDocument = ({ result }: { result: SEOAnalysisResult }) => {
  // Importation dynamique des composants react-pdf
  const { Document, Page, Text, View, StyleSheet } = require("@react-pdf/renderer")

  // Création des styles avec StyleSheet
  const pdfStyles = StyleSheet.create(styles)

  const getScoreColor = (score: number) => {
    if (score >= 90) return pdfStyles.scoreGood
    if (score >= 50) return pdfStyles.scoreMedium
    return pdfStyles.scoreBad
  }

  const getRecommendationStyle = (severity: "high" | "medium" | "low") => {
    if (severity === "high") return pdfStyles.recommendationHigh
    if (severity === "medium") return pdfStyles.recommendationMedium
    return pdfStyles.recommendationLow
  }

  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* En-tête */}
        <Text style={pdfStyles.header}>Rapport d'analyse SEO</Text>
        <Text style={pdfStyles.url}>{result.url}</Text>
        <Text style={{ fontSize: 10, marginBottom: 20, color: "#9ca3af" }}>Généré le {formatDate()}</Text>

        {/* Informations générales */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Informations générales</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Titre</Text>
            <Text style={pdfStyles.value}>{result.title || "Non défini"}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Meta Description</Text>
            <Text style={pdfStyles.value}>{result.metaDescription || "Non définie"}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Nombre de mots</Text>
            <Text style={pdfStyles.value}>{result.wordCount}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Balises H1</Text>
            <Text style={pdfStyles.value}>{result.h1Count}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Images</Text>
            <Text style={pdfStyles.value}>{result.imagesCount}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Score de lisibilité</Text>
            <Text style={[pdfStyles.value, getScoreColor(result.readabilityScore)]}>{result.readabilityScore}/100</Text>
          </View>
        </View>

        {/* Performance */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Performance</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Score Lighthouse</Text>
            <Text style={[pdfStyles.value, getScoreColor(result.lighthouseScore)]}>{result.lighthouseScore}/100</Text>
          </View>
          {result.lighthouseMetrics.map((metric: LighthouseMetric, index: number) => (
            <View key={index} style={pdfStyles.row}>
              <Text style={pdfStyles.label}>{metric.name}</Text>
              <Text style={[pdfStyles.value, getScoreColor(metric.score * 100)]}>
                {Math.round(metric.score * 100)}/100
              </Text>
            </View>
          ))}
        </View>

        {/* Mots-clés */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Mots-clés principaux</Text>
          {result.keywordDensity.slice(0, 5).map((keyword, index) => (
            <View key={index} style={pdfStyles.row}>
              <Text style={pdfStyles.label}>{keyword.keyword}</Text>
              <Text style={pdfStyles.value}>
                {keyword.count} occurrences ({keyword.density}%)
              </Text>
            </View>
          ))}
        </View>

        {/* Recommandations */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Recommandations</Text>
          {result.recommendations.map((recommendation, index) => (
            <View key={index} style={pdfStyles.recommendation}>
              <Text style={getRecommendationStyle(recommendation.severity)}>•</Text>
              <Text style={pdfStyles.recommendationText}>{recommendation.text}</Text>
            </View>
          ))}
        </View>

        {/* Pied de page */}
        <Text style={pdfStyles.footer}>Rapport généré par Analyseur SEO • {formatDate()}</Text>
      </Page>
    </Document>
  )
}

// Composant bouton pour télécharger le PDF
export default function AnalysisPDFExport({ result }: { result: SEOAnalysisResult }) {
  const [isClient, setIsClient] = useState(false)

  // Utilisation de useEffect pour s'assurer que le composant est rendu côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Chargement dynamique du composant PDFDownloadLink
  const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
    ssr: false,
    loading: () => (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <FileDown className="h-4 w-4" />
        Préparation du PDF...
      </Button>
    ),
  })

  // Chargement dynamique du composant PDFDocument
  const AnalysisPDFDocument = dynamic(() => Promise.resolve(PDFDocument), { ssr: false })

  if (!isClient) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <FileDown className="h-4 w-4" />
        Chargement...
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={<AnalysisPDFDocument result={result} />}
      fileName={`analyse-seo-${result.url.replace(/https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]/gi, "-")}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          {loading ? "Génération du PDF..." : "Télécharger le rapport PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
