import ComparisonForm from "@/components/ComparisonForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comparaison SEO | Analyseur SEO",
  description: "Comparez les éléments SEO de plusieurs sites web et identifiez les forces et faiblesses de chacun.",
  openGraph: {
    title: "Comparaison SEO | Analyseur SEO",
    description: "Comparez les éléments SEO de plusieurs sites web et identifiez les forces et faiblesses de chacun.",
    type: "website",
  },
}

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
              Comparaison <span className="text-emerald-600 dark:text-emerald-500">SEO</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comparez les éléments SEO de plusieurs sites web et identifiez les forces et faiblesses de chacun.
            </p>
          </div>

          <ComparisonForm />
        </div>
      </div>
    </main>
  )
}
