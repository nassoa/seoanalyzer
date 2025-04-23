"use client";

import type { HeadingStructure } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";

interface HeadingsAnalysisProps {
  headings: HeadingStructure;
}

export default function HeadingsAnalysis({ headings }: HeadingsAnalysisProps) {
  const getHeadingIcon = (level: number) => {
    switch (level) {
      case 1:
        return <Heading1 className="h-5 w-5 text-emerald-600" />;
      case 2:
        return <Heading2 className="h-5 w-5 text-emerald-600" />;
      case 3:
        return <Heading3 className="h-5 w-5 text-emerald-600" />;
      case 4:
        return <Heading4 className="h-5 w-5 text-emerald-600" />;
      case 5:
        return <Heading5 className="h-5 w-5 text-emerald-600" />;
      case 6:
        return <Heading6 className="h-5 w-5 text-emerald-600" />;
      default:
        return <Heading1 className="h-5 w-5 text-emerald-600" />;
    }
  };

  const renderHeadingList = (
    level: keyof HeadingStructure,
    headings: string[]
  ) => {
    if (headings.length === 0) {
      return (
        <p className="text-sm text-gray-500">Aucune balise {level} trouvée</p>
      );
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {headings.map((heading, index) => (
          <li key={index} className="text-sm">
            {heading}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Structure des titres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {getHeadingIcon(1)}
              <h3 className="font-semibold ml-2">H1 ({headings.h1.length})</h3>
            </div>
            {renderHeadingList("h1", headings.h1)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {getHeadingIcon(2)}
              <h3 className="font-semibold ml-2">H2 ({headings.h2.length})</h3>
            </div>
            {renderHeadingList("h2", headings.h2)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {getHeadingIcon(3)}
              <h3 className="font-semibold ml-2">H3 ({headings.h3.length})</h3>
            </div>
            {renderHeadingList("h3", headings.h3)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {getHeadingIcon(4)}
              <h3 className="font-semibold ml-2">
                H4-H6 (
                {headings.h4.length + headings.h5.length + headings.h6.length})
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {headings.h4.length + headings.h5.length + headings.h6.length ===
              0
                ? "Aucune balise H4, H5 ou H6 trouvée"
                : `${
                    headings.h4.length + headings.h5.length + headings.h6.length
                  } balises H4, H5 ou H6 trouvées`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
