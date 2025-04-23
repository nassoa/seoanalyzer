import AnalysisForm from "@/components/AnalysisForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyseur SEO | Optimisez votre référencement",
  description:
    "Analysez rapidement les éléments SEO de votre site web et obtenez des recommandations pour améliorer votre référencement.",
  openGraph: {
    title: "Analyseur SEO | Optimisez votre référencement",
    description:
      "Analysez rapidement les éléments SEO de votre site web et obtenez des recommandations pour améliorer votre référencement.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="lg:px-40 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
              Analyseur{" "}
              <span className="text-emerald-600 dark:text-emerald-500">
                SEO
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Analysez rapidement les éléments SEO de votre site web et obtenez
              des recommandations pour améliorer votre référencement.
            </p>
          </div>

          <AnalysisForm />
        </div>
      </div>
    </main>
  );
}
