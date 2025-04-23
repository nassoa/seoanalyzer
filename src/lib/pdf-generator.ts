"use client"

import type { SEOAnalysisResult, LighthouseMetric } from "@/lib/types"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Fonction pour générer un PDF d'analyse individuelle
export function generateAnalysisPDF(result: SEOAnalysisResult) {
  // Création d'un nouveau document PDF
  const doc = new jsPDF()

  // Formatage de la date
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

  // Fonction pour obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return [34, 197, 94] // vert
    if (score >= 50) return [245, 158, 11] // ambre
    return [239, 68, 68] // rouge
  }

  // Titre du document
  doc.setFontSize(24)
  doc.setTextColor(16, 185, 129) // couleur emerald
  doc.text("Rapport d'analyse SEO", 105, 20, { align: "center" })

  // URL analysée
  doc.setFontSize(14)
  doc.setTextColor(75, 85, 99) // gris
  doc.text(result.url, 105, 30, { align: "center" })

  // Date de génération
  doc.setFontSize(10)
  doc.setTextColor(156, 163, 175) // gris clair
  doc.text(`Généré le ${formatDate()}`, 105, 38, { align: "center" })

  // Informations générales
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Informations générales", 14, 50)

  const generalInfoData = [
    ["Titre", result.title || "Non défini"],
    ["Meta Description", result.metaDescription || "Non définie"],
    ["Nombre de mots", result.wordCount.toString()],
    ["Balises H1", result.h1Count.toString()],
    ["Images", result.imagesCount.toString()],
    ["Score de lisibilité", `${result.readabilityScore}/100`],
  ]

  autoTable(doc, {
    startY: 55,
    head: [["Métrique", "Valeur"]],
    body: generalInfoData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
  })

  // Performance
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Performance", 14, doc.lastAutoTable.finalY + 15)

  const performanceData = [
    ["Score Lighthouse", `${result.lighthouseScore}/100`],
    ...result.lighthouseMetrics.map((metric: LighthouseMetric) => [
      metric.name,
      `${Math.round(metric.score * 100)}/100`,
    ]),
  ]

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Métrique", "Score"]],
    body: performanceData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
  })

  // Mots-clés
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Mots-clés principaux", 14, doc.lastAutoTable.finalY + 15)

  const keywordsData = result.keywordDensity
    .slice(0, 5)
    .map((keyword) => [keyword.keyword, `${keyword.count} (${keyword.density}%)`])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Mot-clé", "Occurrences (densité)"]],
    body: keywordsData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
  })

  // Recommandations
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Recommandations", 14, doc.lastAutoTable.finalY + 15)

  const recommendationsData = result.recommendations.map((rec) => [
    rec.severity === "high" ? "⚠️ Critique" : rec.severity === "medium" ? "⚠ Moyenne" : "ℹ️ Faible",
    rec.text,
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Priorité", "Recommandation"]],
    body: recommendationsData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: "auto" },
    },
  })

  // Pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(156, 163, 175)
    doc.text(`Rapport généré par Analyseur SEO • Page ${i} sur ${pageCount}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  // Téléchargement du PDF
  doc.save(`analyse-seo-${result.url.replace(/https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]/gi, "-")}.pdf`)
}

// Fonction pour générer un PDF de comparaison
export function generateComparisonPDF(results: SEOAnalysisResult[]) {
  // Création d'un nouveau document PDF
  const doc = new jsPDF()

  // Formatage de la date
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

  // Titre du document
  doc.setFontSize(24)
  doc.setTextColor(16, 185, 129) // couleur emerald
  doc.text("Rapport de comparaison SEO", 105, 20, { align: "center" })

  // Sous-titre
  doc.setFontSize(12)
  doc.setTextColor(75, 85, 99) // gris
  doc.text(`Comparaison de ${results.length} sites`, 105, 30, { align: "center" })

  // Date de génération
  doc.setFontSize(10)
  doc.setTextColor(156, 163, 175) // gris clair
  doc.text(`Généré le ${formatDate()}`, 105, 38, { align: "center" })

  // Vue d'ensemble
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Vue d'ensemble", 14, 50)

  // Préparation des données pour le tableau de comparaison
  const overviewHeaders = ["Site", "Lighthouse", "Mots", "Lisibilité", "Images Alt", "H1"]

  const overviewData = results.map((result) => {
    const altPercentage = result.images.total > 0 ? Math.round((result.images.withAlt / result.images.total) * 100) : 0

    return [
      result.url,
      result.lighthouseScore.toString(),
      result.wordCount.toString(),
      result.readabilityScore.toString(),
      `${altPercentage}%`,
      result.h1Count.toString(),
    ]
  })

  autoTable(doc, {
    startY: 55,
    head: [overviewHeaders],
    body: overviewData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
  })

  // Mots-clés communs
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Mots-clés communs", 14, doc.lastAutoTable.finalY + 15)

  const commonKeywords = findCommonKeywords(results)

  if (commonKeywords.length > 0) {
    // Afficher les mots-clés communs en colonnes
    const keywordsPerRow = 3
    const keywordsRows = []

    for (let i = 0; i < commonKeywords.length; i += keywordsPerRow) {
      keywordsRows.push(commonKeywords.slice(i, i + keywordsPerRow))
    }

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: keywordsRows,
      theme: "plain",
    })
  } else {
    doc.setFontSize(12)
    doc.setTextColor(107, 114, 128)
    doc.text("Aucun mot-clé commun trouvé", 14, doc.lastAutoTable.finalY + 25)
  }

  // Problèmes communs
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Problèmes communs", 14, doc.lastAutoTable.finalY + 15)

  const commonIssues = findCommonIssues(results)

  if (commonIssues.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Problèmes présents sur plusieurs sites"]],
      body: commonIssues.map((issue) => [issue]),
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
    })
  } else {
    doc.setFontSize(12)
    doc.setTextColor(107, 114, 128)
    doc.text("Aucun problème commun détecté", 14, doc.lastAutoTable.finalY + 25)
  }

  // Recommandations par site
  doc.setFontSize(18)
  doc.setTextColor(16, 185, 129)
  doc.text("Recommandations principales par site", 14, doc.lastAutoTable.finalY + 15)

  let startY = doc.lastAutoTable.finalY + 20

  // Pour chaque site, afficher les recommandations critiques
  results.forEach((result, index) => {
    // Titre du site
    doc.setFontSize(14)
    doc.setTextColor(31, 41, 55)
    doc.text(result.url, 14, startY)

    const criticalRecommendations = result.recommendations
      .filter((rec) => rec.severity === "high")
      .slice(0, 3)
      .map((rec) => [rec.text])

    if (criticalRecommendations.length > 0) {
      autoTable(doc, {
        startY: startY + 5,
        body: criticalRecommendations,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 0: { cellPadding: 2 } },
      })
      startY = doc.lastAutoTable.finalY + 10
    } else {
      doc.setFontSize(10)
      doc.setTextColor(34, 197, 94) // vert
      doc.text("Aucun problème critique détecté", 14, startY + 10)
      startY += 20
    }

    // Ajouter une nouvelle page si nécessaire
    if (index < results.length - 1 && startY > doc.internal.pageSize.height - 40) {
      doc.addPage()
      startY = 20
    }
  })

  // Pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(156, 163, 175)
    doc.text(`Rapport généré par Analyseur SEO • Page ${i} sur ${pageCount}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  // Téléchargement du PDF
  doc.save(`comparaison-seo-${results.length}-sites.pdf`)
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
