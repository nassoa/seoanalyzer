"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import type { SEOAnalysisResult } from "@/lib/types"
import { generateComparisonPDF } from "@/lib/pdf-generator"

export default function ComparisonPDFButton({ results }: { results: SEOAnalysisResult[] }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true)

      // Dynamically import jsPDF only when needed (client-side)
      const jsPDFModule = await import("jspdf")
      const autoTableModule = await import("jspdf-autotable")

      // Generate and download the PDF
      generateComparisonPDF(results)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleGeneratePDF} disabled={isGenerating} className="flex items-center gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Génération du PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Télécharger le rapport PDF
        </>
      )}
    </Button>
  )
}
