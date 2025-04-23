"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SEOAnalysisResult } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Radar } from "react-chartjs-2";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartJsComparisonPerformanceChartsProps {
  results: SEOAnalysisResult[];
}

export default function ChartJsComparisonPerformanceCharts({
  results,
}: ChartJsComparisonPerformanceChartsProps) {
  const [mounted, setMounted] = useState(false);

  // Fonction pour obtenir la couleur en fonction du score
  function getScoreColor(score: number): string {
    if (score >= 90) return "#22c55e"; // vert
    if (score >= 50) return "#f59e0b"; // ambre
    return "#ef4444"; // rouge
  }

  // Fonction pour extraire le domaine d'une URL
  function getDomainFromUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch (e) {
      return url;
    }
  }

  // Générer des couleurs pour chaque site
  const siteColors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f97316", // orange
  ];

  // Préparer les données pour le graphique en barres des scores Lighthouse
  const barChartData = {
    labels: results.map((result) => getDomainFromUrl(result.url)),
    datasets: [
      {
        label: "Score Lighthouse",
        data: results.map((result) => result.lighthouseScore),
        backgroundColor: results.map((result) =>
          getScoreColor(result.lighthouseScore)
        ),
        borderColor: results.map((result) =>
          getScoreColor(result.lighthouseScore)
        ),
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Score: ${context.raw}/100`,
        },
      },
    },
  };

  // Préparer les données pour le graphique radar
  const radarChartData = {
    labels: results[0].lighthouseMetrics.map((metric) => metric.name),
    datasets: results.map((result, index) => ({
      label: getDomainFromUrl(result.url),
      data: result.lighthouseMetrics.map((metric) =>
        Math.round(metric.score * 100)
      ),
      backgroundColor: `${siteColors[index % siteColors.length]}33`, // Ajouter transparence
      borderColor: siteColors[index % siteColors.length],
      borderWidth: 2,
      pointBackgroundColor: siteColors[index % siteColors.length],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: siteColors[index % siteColors.length],
    })),
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  // Préparer les données pour le graphique en ligne des métriques
  const lineChartData = {
    labels: results[0].lighthouseMetrics.map((metric) => metric.name),
    datasets: results.map((result, index) => ({
      label: getDomainFromUrl(result.url),
      data: result.lighthouseMetrics.map((metric) =>
        Math.round(metric.score * 100)
      ),
      backgroundColor: siteColors[index % siteColors.length],
      borderColor: siteColors[index % siteColors.length],
      borderWidth: 2,
      tension: 0.1,
    })),
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  };

  // Utiliser useEffect pour s'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Comparaison des scores Lighthouse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Comparaison des scores de performance Lighthouse pour chaque site.
              Un score de 90 ou plus est considéré comme bon.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Comparaison des métriques Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Radar data={radarChartData} options={radarChartOptions} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              Ce graphique radar compare les performances de chaque site sur les
              différentes métriques Core Web Vitals. Plus la surface est grande,
              meilleure est la performance.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Comparaison détaillée des métriques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              Ce graphique en ligne montre les scores de chaque métrique pour
              tous les sites analysés, permettant une comparaison directe point
              par point.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Explication des métriques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">First Contentful Paint (FCP)</h3>
              <p className="text-sm text-gray-500">
                Mesure le temps nécessaire pour afficher le premier contenu
                visuel (texte, image, etc.).
              </p>
            </div>
            <div>
              <h3 className="font-medium">Largest Contentful Paint (LCP)</h3>
              <p className="text-sm text-gray-500">
                Mesure le temps nécessaire pour afficher le plus grand élément
                visible dans la fenêtre.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Total Blocking Time (TBT)</h3>
              <p className="text-sm text-gray-500">
                Mesure le temps total pendant lequel le thread principal est
                bloqué et ne peut pas répondre aux interactions utilisateur.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Cumulative Layout Shift (CLS)</h3>
              <p className="text-sm text-gray-500">
                Mesure la stabilité visuelle de la page et quantifie les
                changements inattendus de mise en page.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Speed Index</h3>
              <p className="text-sm text-gray-500">
                Mesure la rapidité avec laquelle le contenu est visuellement
                affiché pendant le chargement de la page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
