"use client"

import type { ImageAnalysis } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ImagesAnalysisProps {
  images: ImageAnalysis
}

export default function ImagesAnalysis({ images }: ImagesAnalysisProps) {
  const altTextPercentage = images.total > 0 ? Math.round((images.withAlt / images.total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse des images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <ImageIcon className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold">{images.total}</p>
            <p className="text-xs text-gray-500">Images totales</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <Check className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{images.withAlt}</p>
            <p className="text-xs text-gray-500">Avec attribut alt</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <X className="h-5 w-5 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{images.withoutAlt}</p>
            <p className="text-xs text-gray-500">Sans attribut alt</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Images avec attribut alt</span>
            <span
              className={
                altTextPercentage >= 90 ? "text-green-500" : altTextPercentage >= 50 ? "text-amber-500" : "text-red-500"
              }
            >
              {altTextPercentage}%
            </span>
          </div>
          <Progress
            value={altTextPercentage}
            className={
              altTextPercentage >= 90 ? "bg-green-500" : altTextPercentage >= 50 ? "bg-amber-500" : "bg-red-500"
            }
          />
        </div>

        {images.images.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Détails des images</h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Source</th>
                    <th className="text-left py-2">Alt</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {images.images.slice(0, 10).map((image, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 truncate max-w-[150px]">{image.src}</td>
                      <td className="py-2 truncate max-w-[150px]">{image.alt || "—"}</td>
                      <td className="py-2 text-center">
                        {image.hasAlt ? (
                          <Check className="h-4 w-4 text-green-500 inline" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {images.images.length > 10 && (
                <p className="text-xs text-center mt-2 text-gray-500">
                  Affichage de 10 images sur {images.images.length}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
