"use client";

import { useState, useEffect } from "react";
import type { SEOAnalysisResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import dynamic from "next/dynamic";

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
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b5563",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 10,
    color: "#111827",
  },
  urlCell: {
    width: "30%",
    fontSize: 10,
    color: "#111827",
  },
  metricCell: {
    width: "14%",
    fontSize: 10,
    color: "#111827",
    textAlign: "center",
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
};

// Composant pour le PDF de comparaison - sera chargé dynamiquement
const PDFDocument = ({ results }: { results: SEOAnalysisResult[] }) => {
  // Importation dynamique des composants react-pdf
  const {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
  } = require("@react-pdf/renderer");

  // Création des styles avec StyleSheet
  const pdfStyles = StyleSheet.create(styles);

  const getScoreColor = (score: number) => {
    if (score >= 90) return pdfStyles.scoreGood;
    if (score >= 50) return pdfStyles.scoreMedium;
    return pdfStyles.scoreBad;
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Trouver le meilleur score pour chaque métrique
  const getBestScore = (
    metric: keyof SEOAnalysisResult | "altPercentage" | "h1Count"
  ) => {
    if (metric === "lighthouseScore") {
      return Math.max(...results.map((r) => r.lighthouseScore));
    } else if (metric === "wordCount") {
      return Math.max(...results.map((r) => r.wordCount));
    } else if (metric === "readabilityScore") {
      return Math.max(...results.map((r) => r.readabilityScore));
    } else if (metric === "altPercentage") {
      return Math.max(
        ...results.map((r) =>
          r.images.total > 0
            ? Math.round((r.images.withAlt / r.images.total) * 100)
            : 0
        )
      );
    } else if (metric === "h1Count") {
      return results.findIndex((r) => r.h1Count === 1) !== -1
        ? 1
        : Math.min(...results.map((r) => r.h1Count));
    }
    return 0;
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* En-tête */}
        <Text style={pdfStyles.header}>Rapport de comparaison SEO</Text>
        <Text style={{ fontSize: 10, marginBottom: 20, color: "#9ca3af" }}>
          Comparaison de {results.length} sites • Généré le {formatDate()}
        </Text>

        {/* Vue d'ensemble */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Vue d'ensemble</Text>

          {/* En-tête du tableau */}
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderCell, { width: "30%" }]}>
              Site
            </Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: "14%" }]}>
              Lighthouse
            </Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: "14%" }]}>
              Mots
            </Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: "14%" }]}>
              Lisibilité
            </Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: "14%" }]}>
              Images Alt
            </Text>
            <Text style={[pdfStyles.tableHeaderCell, { width: "14%" }]}>
              H1
            </Text>
          </View>

          {/* Lignes du tableau */}
          {results.map((result, index) => {
            const altPercentage =
              result.images.total > 0
                ? Math.round(
                    (result.images.withAlt / result.images.total) * 100
                  )
                : 0;

            return (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.urlCell]}>{result.url}</Text>
                <Text
                  style={[
                    pdfStyles.metricCell,
                    getScoreColor(result.lighthouseScore),
                    result.lighthouseScore === getBestScore("lighthouseScore")
                      ? { fontWeight: "bold" }
                      : {},
                  ]}
                >
                  {result.lighthouseScore}
                </Text>
                <Text
                  style={[
                    pdfStyles.metricCell,
                    result.wordCount === getBestScore("wordCount")
                      ? { fontWeight: "bold" }
                      : {},
                  ]}
                >
                  {result.wordCount}
                </Text>
                <Text
                  style={[
                    pdfStyles.metricCell,
                    getScoreColor(result.readabilityScore),
                    result.readabilityScore === getBestScore("readabilityScore")
                      ? { fontWeight: "bold" }
                      : {},
                  ]}
                >
                  {result.readabilityScore}
                </Text>
                <Text
                  style={[
                    pdfStyles.metricCell,
                    getScoreColor(altPercentage),
                    altPercentage === getBestScore("altPercentage")
                      ? { fontWeight: "bold" }
                      : {},
                  ]}
                >
                  {altPercentage}%
                </Text>
                <Text
                  style={[
                    pdfStyles.metricCell,
                    result.h1Count === 1
                      ? pdfStyles.scoreGood
                      : result.h1Count === 0
                      ? pdfStyles.scoreBad
                      : pdfStyles.scoreMedium,
                    result.h1Count === getBestScore("h1Count")
                      ? { fontWeight: "bold" }
                      : {},
                  ]}
                >
                  {result.h1Count}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Mots-clés communs */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Mots-clés communs</Text>
          {findCommonKeywords(results).length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {findCommonKeywords(results).map((keyword, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#10b981",
                    borderRadius: 4,
                    padding: 4,
                    margin: 2,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 8 }}>{keyword}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 10, color: "#6b7280" }}>
              Aucun mot-clé commun trouvé
            </Text>
          )}
        </View>

        {/* Problèmes communs */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>Problèmes communs</Text>
          {findCommonIssues(results).length > 0 ? (
            <View>
              {findCommonIssues(results).map((issue, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginBottom: 5 }}
                >
                  <Text
                    style={{ fontSize: 10, color: "#f59e0b", marginRight: 5 }}
                  >
                    •
                  </Text>
                  <Text style={{ fontSize: 10, flex: 1 }}>{issue}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 10, color: "#6b7280" }}>
              Aucun problème commun détecté
            </Text>
          )}
        </View>

        {/* Recommandations par site */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subheader}>
            Recommandations principales par site
          </Text>
          {results.map((result, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text
                style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}
              >
                {result.url}
              </Text>
              {result.recommendations
                .filter((rec) => rec.severity === "high")
                .slice(0, 3)
                .map((rec, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: "row", marginBottom: 3 }}
                  >
                    <Text
                      style={{ fontSize: 8, color: "#ef4444", marginRight: 5 }}
                    >
                      •
                    </Text>
                    <Text style={{ fontSize: 8, flex: 1 }}>{rec.text}</Text>
                  </View>
                ))}
              {result.recommendations.filter((rec) => rec.severity === "high")
                .length === 0 && (
                <Text style={{ fontSize: 8, color: "#22c55e" }}>
                  Aucun problème critique détecté
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Pied de page */}
        <Text style={pdfStyles.footer}>
          Rapport généré par Analyseur SEO • {formatDate()}
        </Text>
      </Page>
    </Document>
  );
};

// Fonction pour trouver les mots-clés communs entre les sites
function findCommonKeywords(results: SEOAnalysisResult[]): string[] {
  if (results.length <= 1) return [];

  const keywordSets = results.map(
    (result) => new Set(result.keywordDensity.map((kw) => kw.keyword))
  );

  const commonKeywords = Array.from(keywordSets[0]).filter((keyword) =>
    keywordSets.slice(1).every((set) => set.has(keyword))
  );

  return commonKeywords;
}

// Fonction pour trouver les problèmes communs entre les sites
function findCommonIssues(results: SEOAnalysisResult[]): string[] {
  if (results.length <= 1) return [];

  const issueTexts = results.map((result) =>
    result.recommendations.map((rec) => rec.text)
  );

  const allIssues = issueTexts.flat();
  const issueCounts = allIssues.reduce((acc, issue) => {
    acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(issueCounts)
    .filter(([_, count]) => count > 1)
    .map(([issue]) => issue);
}

// Composant bouton pour télécharger le PDF
export default function ComparisonPDFExport({
  results,
}: {
  results: SEOAnalysisResult[];
}) {
  const [isClient, setIsClient] = useState(false);

  // Utilisation de useEffect pour s'assurer que le composant est rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chargement dynamique du composant PDFDownloadLink
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => (
        <Button variant="outline" disabled className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Préparation du PDF...
        </Button>
      ),
    }
  );

  // Chargement dynamique du composant PDFDocument
  const ComparisonPDFDocument = dynamic(() => Promise.resolve(PDFDocument), {
    ssr: false,
  });

  if (!isClient) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <FileDown className="h-4 w-4" />
        Chargement...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ComparisonPDFDocument results={results} />}
      fileName={`comparaison-seo-${results.length}-sites.pdf`}
    >
      {({ loading }) => (
        <Button
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          {loading ? "Génération du PDF..." : "Télécharger le rapport PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
