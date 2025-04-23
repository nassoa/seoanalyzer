// Algorithme simplifié de lisibilité basé sur la formule de Flesch-Kincaid
export function calculateReadability(text: string): number {
  // Nettoyage du texte
  const cleanText = text.replace(/\s+/g, " ").trim()

  // Comptage des phrases (approximatif)
  const sentences = cleanText.split(/[.!?]+/).filter(Boolean)
  const sentenceCount = sentences.length

  // Comptage des mots
  const words = cleanText.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Comptage des syllabes (approximatif pour le français)
  const syllableCount = countSyllables(cleanText)

  if (sentenceCount === 0 || wordCount === 0) {
    return 0
  }

  // Calcul du score de lisibilité (adapté pour le français)
  // Plus le score est élevé, plus le texte est facile à lire (0-100)
  const averageWordsPerSentence = wordCount / sentenceCount
  const averageSyllablesPerWord = syllableCount / wordCount

  // Formule adaptée de Flesch Reading Ease
  let score = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord

  // Normalisation du score entre 0 et 100
  score = Math.max(0, Math.min(100, score))

  return Math.round(score)
}

// Fonction simplifiée pour compter les syllabes en français
function countSyllables(text: string): number {
  // Convertir en minuscules
  const lowerText = text.toLowerCase()

  // Compter les voyelles
  const vowels = lowerText.match(/[aeiouyàâäéèêëîïôöùûüÿæœ]/gi)
  let syllableCount = vowels ? vowels.length : 0

  // Ajustement pour les diphtongues et autres particularités du français
  const diphthongs = lowerText.match(/[aeiouyàâäéèêëîïôöùûüÿ]{2,}/gi)
  syllableCount -= diphthongs ? diphthongs.length : 0

  // Ajustement pour les e muets en fin de mot
  const silentE = lowerText.match(/e\b/gi)
  syllableCount -= silentE ? silentE.length : 0

  return syllableCount
}
