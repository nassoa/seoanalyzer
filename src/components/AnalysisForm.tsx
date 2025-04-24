"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, BarChart2 } from "lucide-react";
import type { SEOAnalysisResult } from "@/lib/types";
import ResultsSection from "./ResultsSection";
import Link from "next/link";

export default function AnalysisForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setError("Veuillez entrer une URL valide");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Validate URL format
      let urlToAnalyze = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        urlToAnalyze = "https://" + url;
      }

      // Basic URL validation
      try {
        new URL(urlToAnalyze);
      } catch (e) {
        setError(
          "Format d'URL invalide. Veuillez entrer une URL valide (ex: example.com)"
        );
        setIsAnalyzing(false);
        return;
      }

      // Utiliser la route API au lieu de la fonction Server Action directement
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToAnalyze }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'analyse");
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'analyse. Veuillez vérifier l'URL et réessayer."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Entrez l'URL de votre site"
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button
              type="submit"
              disabled={isAnalyzing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                "Analyser"
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Link
              href="/comparison"
              className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm"
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Comparer plusieurs sites
            </Link>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </form>
      </Card>

      {isAnalyzing && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <h3 className="text-lg font-medium mb-2">Analyse en cours...</h3>
          <p className="text-gray-500 dark:text-gray-400">
            L'analyse complète peut prendre jusqu'à 60 secondes. Veuillez
            patienter.
          </p>
        </div>
      )}

      {results && <ResultsSection results={results} />}
    </div>
  );
}
