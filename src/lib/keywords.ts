import type { KeywordDensity } from "./types"

export function extractKeywords(text: string): KeywordDensity[] {
  // Nettoyage du texte
  const cleanText = text
    .toLowerCase()
    .replace(/[^\wàâäéèêëîïôöùûüÿæœç\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  // Liste de mots vides (stop words) en français
  const stopWords = [
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "et",
    "ou",
    "de",
    "du",
    "au",
    "aux",
    "ce",
    "cette",
    "ces",
    "mon",
    "ma",
    "mes",
    "ton",
    "ta",
    "tes",
    "son",
    "sa",
    "ses",
    "notre",
    "nos",
    "votre",
    "vos",
    "leur",
    "leurs",
    "je",
    "tu",
    "il",
    "elle",
    "nous",
    "vous",
    "ils",
    "elles",
    "on",
    "qui",
    "que",
    "quoi",
    "dont",
    "où",
    "pour",
    "par",
    "dans",
    "sur",
    "sous",
    "avec",
    "sans",
    "ni",
    "ne",
    "pas",
    "plus",
    "moins",
    "très",
    "trop",
    "peu",
    "beaucoup",
    "tout",
    "tous",
    "toute",
    "toutes",
    "aucun",
    "aucune",
    "même",
    "autres",
    "autre",
    "est",
    "sont",
    "sera",
    "seront",
    "été",
    "avoir",
    "a",
    "ont",
    "comme",
    "si",
    "mais",
    "car",
    "donc",
    "quand",
    "comment",
    "pourquoi",
  ]

  // Diviser le texte en mots
  const words = cleanText.split(/\s+/)

  // Filtrer les mots vides et les mots trop courts
  const filteredWords = words.filter((word) => word.length > 3 && !stopWords.includes(word))

  // Compter les occurrences de chaque mot
  const wordCounts: Record<string, number> = {}
  filteredWords.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  // Calculer la densité de chaque mot
  const totalWords = words.length
  const keywordDensity: KeywordDensity[] = Object.entries(wordCounts)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number.parseFloat(((count / totalWords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Garder les 10 mots-clés les plus fréquents

  return keywordDensity
}
