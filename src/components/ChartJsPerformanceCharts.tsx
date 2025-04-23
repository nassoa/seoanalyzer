"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LighthouseMetric } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartJsPerformanceChartsProps {
  lighthouseScore: number;
  lighthouseMetrics: LighthouseMetric[];
}

export default function ChartJsPerformanceCharts({
  lighthouseScore,
  lighthouseMetrics,
}: ChartJsPerformanceChartsProps) {
  const [mounted, setMounted] = useState(false);

  // Fonction pour obtenir la couleur en fonction du score
  function getScoreColor(score: number): string {
    if (score >= 90) return "#22c55e"; // vert
    if (score >= 50) return "#f59e0b"; // ambre
    return "#ef4444"; // rouge
  }

  function getScoreColorClass(score: number): string {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  }

  // Préparer les données pour le graphique en barres
  const barChartData = {
    labels: lighthouseMetrics.map((metric) => metric.name),
    datasets: [
      {
        label: "Score",
        data: lighthouseMetrics.map((metric) => Math.round(metric.score * 100)),
        backgroundColor: lighthouseMetrics.map((metric) =>
          getScoreColor(metric.score * 100)
        ),
        borderColor: lighthouseMetrics.map((metric) =>
          getScoreColor(metric.score * 100)
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
    labels: lighthouseMetrics.map((metric) => metric.name),
    datasets: [
      {
        label: "Score",
        data: lighthouseMetrics.map((metric) => Math.round(metric.score * 100)),
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(16, 185, 129, 1)",
      },
    ],
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

  // Préparer les données pour le graphique en donut
  const doughnutChartData = {
    labels: ["Score", "Reste"],
    datasets: [
      {
        data: [lighthouseScore, 100 - lighthouseScore],
        backgroundColor: [getScoreColor(lighthouseScore), "#e5e7eb"],
        borderColor: ["transparent", "transparent"],
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            context.label === "Score" ? `Score: ${context.raw}/100` : "",
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
          <CardTitle className="text-lg">Métriques Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Les Core Web Vitals sont des métriques essentielles pour évaluer
              l'expérience utilisateur de votre site. Un score de 90 ou plus est
              considéré comme bon.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Vue d'ensemble des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Radar data={radarChartData} options={radarChartOptions} />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Ce graphique radar montre comment votre site performe sur chaque
                métrique. Plus la surface est grande, meilleure est la
                performance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Lighthouse global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <Doughnut
                  data={doughnutChartData}
                  options={doughnutChartOptions}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className={`text-4xl font-bold ${getScoreColorClass(
                        lighthouseScore
                      )}`}
                    >
                      {lighthouseScore}
                    </p>
                    <p className="text-xs text-gray-500">sur 100</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p
                  className={`font-medium ${getScoreColorClass(
                    lighthouseScore
                  )}`}
                >
                  {lighthouseScore >= 90
                    ? "Excellent"
                    : lighthouseScore >= 70
                    ? "Bon"
                    : lighthouseScore >= 50
                    ? "Moyen"
                    : "Faible"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {lighthouseScore >= 90
                    ? "Votre site a une excellente performance !"
                    : lighthouseScore >= 70
                    ? "Votre site a une bonne performance, mais peut être amélioré."
                    : lighthouseScore >= 50
                    ? "Votre site nécessite des optimisations de performance."
                    : "Votre site a des problèmes de performance importants."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
