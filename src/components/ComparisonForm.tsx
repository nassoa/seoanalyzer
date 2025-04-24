"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Home, Plus, X } from "lucide-react";
import type { SEOAnalysisResult } from "@/lib/types";
import ComparisonView from "./ComparisonView";

export default function ComparisonForm() {
  const [urls, setUrls] = useState<string[]>(["", ""]); // Au moins 2 URLs pour la comparaison
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUrlIndex, setCurrentUrlIndex] = useState<number | null>(null);

  const handleAddUrl = () => {
    setUrls([...urls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length <= 2) {
      setError("Au moins deux URLs sont nécessaires pour la comparaison");
      return;
    }
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const validateUrl = (url: string): string => {
    let urlToAnalyze = url.trim();
    if (
      !urlToAnalyze.startsWith("http://") &&
      !urlToAnalyze.startsWith("https://")
    ) {
      urlToAnalyze = "https://" + urlToAnalyze;
    }

    try {
      new URL(urlToAnalyze);
      return urlToAnalyze;
    } catch (e) {
      throw new Error(`Format d'URL invalide: ${url}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filtrer les URLs vides
    const urlsToAnalyze = urls.filter((url) => url.trim() !== "");

    if (urlsToAnalyze.length < 2) {
      setError(
        "Veuillez entrer au moins deux URLs valides pour la comparaison"
      );
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setResults([]);

      const validatedUrls: string[] = [];

      // Valider toutes les URLs
      for (const url of urlsToAnalyze) {
        try {
          validatedUrls.push(validateUrl(url));
        } catch (error) {
          throw error;
        }
      }

      // Analyser toutes les URLs
      const analysisResults: SEOAnalysisResult[] = [];

      for (let i = 0; i < validatedUrls.length; i++) {
        const url = validatedUrls[i];
        setCurrentUrlIndex(i);
        try {
          // Utiliser la route API au lieu de la fonction Server Action directement
          const response = await fetch("/api/compare", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || `Erreur lors de l'analyse de ${url}`
            );
          }

          const result = await response.json();
          analysisResults.push(result);
        } catch (error) {
          console.error(`Erreur lors de l'analyse de ${url}:`, error);
          throw new Error(
            `Erreur lors de l'analyse de ${url}: ${
              error instanceof Error ? error.message : "Erreur inconnue"
            }`
          );
        }
      }

      setResults(analysisResults);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'analyse. Veuillez vérifier les URLs et réessayer."
      );
    } finally {
      setIsAnalyzing(false);
      setCurrentUrlIndex(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder={`Entrez l'URL du site ${index + 1}`}
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                {urls.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveUrl(index)}
                    disabled={isAnalyzing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {index === urls.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddUrl}
                    disabled={isAnalyzing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm"
            >
              <Home className="h-4 w-4 mr-1" />
              Retour à l'analyse individuelle
            </Link>
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
                "Comparer"
              )}
            </Button>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </Card>

      {isAnalyzing && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <h3 className="text-lg font-medium mb-2">
            Analyse en cours...{" "}
            {currentUrlIndex !== null &&
              `(Site ${currentUrlIndex + 1}/${
                urls.filter((u) => u.trim() !== "").length
              })`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            L'analyse complète peut prendre jusqu'à 60 secondes par site.
            Veuillez patienter.
          </p>
        </div>
      )}

      {results.length >= 2 && <ComparisonView results={results} />}
    </div>
  );
}
