"use client";

import type { LinkAnalysis } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, ExternalLink, AlertTriangle } from "lucide-react";

interface LinksAnalysisProps {
  links: LinkAnalysis;
}

export default function LinksAnalysis({ links }: LinksAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse des liens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <Link className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold">{links.total}</p>
            <p className="text-xs text-gray-500">Liens totaux</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <Link className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{links.internal}</p>
            <p className="text-xs text-gray-500">Liens internes</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <ExternalLink className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{links.external}</p>
            <p className="text-xs text-gray-500">Liens externes</p>
          </div>
        </div>

        {links.broken > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-semibold">Liens cassés ({links.broken})</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {links.brokenLinks.map((link, index) => (
                <li key={index} className="text-sm text-red-500">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Liens internes populaires</h3>
            {links.internalLinks.length > 0 ? (
              <div className="space-y-10">
                <ul className="max-h-40 overflow-y-auto list-disc pl-5 space-y-1">
                  {links.internalLinks.map((link, index) => (
                    <li key={index} className="text-sm truncate">
                      {link}
                    </li>
                  ))}
                </ul>
                {/* {links.internalLinks.length > 5 && (
                  <p className="text-xs text-center mt-2 text-gray-500">
                    Affichage de 5 liens sur {links.internalLinks.length}
                  </p>
                )} */}
                {links.internalLinks.length > 5 && (
                  <p className="text-sm text-center mt-2 text-gray-500">
                    <span className="text-blue-500 font-semibold">
                      {links.internalLinks.length}
                    </span>{" "}
                    liens internes trouvés.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun lien interne trouvé</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Liens externes populaires</h3>
            {links.externalLinks.length > 0 ? (
              <div className="space-y-10">
                <ul className="list-disc max-h-40 overflow-y-auto pl-5 space-y-1">
                  {links.externalLinks.map((link, index) => (
                    <li key={index} className="text-sm truncate">
                      {link}
                    </li>
                  ))}
                </ul>
                {links.externalLinks.length > 5 && (
                  <p className="text-sm text-center mt-2 text-gray-500">
                    <span className="text-purple-500 font-semibold">
                      {links.externalLinks.length}
                    </span>{" "}
                    liens externes trouvés.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun lien externe trouvé</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
