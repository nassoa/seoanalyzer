"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-emerald-600">
                SEO Analyzer
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-emerald-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <Home className="h-4 w-4 mr-1" />
                Analyse
              </Link>
              <Link
                href="/comparison"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/comparison"
                    ? "border-emerald-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                Comparaison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
