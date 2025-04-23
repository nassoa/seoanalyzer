import type {
  SEORecommendation,
  HeadingStructure,
  ImageAnalysis,
  LinkAnalysis,
  StructuredData,
} from "./types";

interface AnalysisData {
  title: string;
  metaDescription: string;
  h1Count: number;
  imagesCount: number;
  wordCount: number;
  lighthouseScore: number;
  headings?: HeadingStructure;
  images?: ImageAnalysis;
  links?: LinkAnalysis;
  readabilityScore?: number;
  urlStructure?: {
    isClean: boolean;
    hasDynamicParameters: boolean;
    length: number;
  };
  structuredData?: StructuredData[];
  metaTags?: {
    robots: string | null;
    viewport: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
  };
}

export function generateRecommendations(
  data: AnalysisData
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];

  // Title recommendations
  if (!data.title) {
    recommendations.push({
      text: "Ajoutez une balise title à votre page",
      severity: "high",
    });
  } else if (data.title.length < 30) {
    recommendations.push({
      text: "Votre titre est trop court. Idéalement, il devrait contenir entre 50 et 60 caractères",
      severity: "medium",
    });
  } else if (data.title.length > 60) {
    recommendations.push({
      text: "Votre titre est trop long. Idéalement, il devrait contenir moins de 60 caractères",
      severity: "medium",
    });
  }

  // Meta description recommendations
  if (!data.metaDescription) {
    recommendations.push({
      text: "Ajoutez une meta description à votre page",
      severity: "high",
    });
  } else if (data.metaDescription.length < 120) {
    recommendations.push({
      text: "Votre meta description est trop courte. Idéalement, elle devrait contenir entre 120 et 155 caractères",
      severity: "medium",
    });
  } else if (data.metaDescription.length > 155) {
    recommendations.push({
      text: "Votre meta description est trop longue. Idéalement, elle devrait contenir moins de 155 caractères",
      severity: "medium",
    });
  }

  // H1 recommendations
  if (data.h1Count === 0) {
    recommendations.push({
      text: "Ajoutez une balise H1 à votre page",
      severity: "high",
    });
  } else if (data.h1Count > 1) {
    recommendations.push({
      text: "Votre page contient plusieurs balises H1. Idéalement, une page ne devrait avoir qu'une seule balise H1",
      severity: "medium",
    });
  }

  // Content recommendations
  if (data.wordCount < 300) {
    recommendations.push({
      text: "Votre contenu est trop court. Ajoutez plus de contenu pour améliorer le référencement",
      severity: "medium",
    });
  }

  // Heading structure recommendations
  if (data.headings) {
    if (data.headings.h2.length === 0) {
      recommendations.push({
        text: "Utilisez des balises H2 pour structurer votre contenu",
        severity: "medium",
      });
    }

    // Check if headings are in correct order (no skipping levels)
    if (data.headings.h3.length > 0 && data.headings.h2.length === 0) {
      recommendations.push({
        text: "Vous utilisez des balises H3 sans H2. Respectez la hiérarchie des titres",
        severity: "medium",
      });
    }
  }

  // Image recommendations
  if (data.images) {
    if (data.images.withoutAlt > 0) {
      recommendations.push({
        text: `${data.images.withoutAlt} image(s) n'ont pas d'attribut alt. Ajoutez des descriptions alt à toutes vos images`,
        severity: "high",
      });
    }
  }

  // Link recommendations
  if (data.links) {
    if (data.links.broken > 0) {
      recommendations.push({
        text: `Votre page contient ${data.links.broken} lien(s) cassé(s). Corrigez ou supprimez ces liens`,
        severity: "high",
      });
    }

    if (data.links.internal === 0) {
      recommendations.push({
        text: "Ajoutez des liens internes pour améliorer la navigation et le référencement",
        severity: "medium",
      });
    }
  }

  // Readability recommendations
  if (data.readabilityScore !== undefined) {
    if (data.readabilityScore < 30) {
      recommendations.push({
        text: "Votre contenu est difficile à lire. Simplifiez votre langage et utilisez des phrases plus courtes",
        severity: "medium",
      });
    } else if (data.readabilityScore < 50) {
      recommendations.push({
        text: "La lisibilité de votre contenu pourrait être améliorée. Essayez d'utiliser un langage plus simple",
        severity: "low",
      });
    }
  }

  // URL structure recommendations
  if (data.urlStructure) {
    if (!data.urlStructure.isClean) {
      recommendations.push({
        text: "Votre URL contient des paramètres dynamiques. Utilisez des URL propres et descriptives",
        severity: "medium",
      });
    }

    if (data.urlStructure.length > 100) {
      recommendations.push({
        text: "Votre URL est trop longue. Utilisez des URL plus courtes et descriptives",
        severity: "low",
      });
    }
  }

  // Structured data recommendations
  if (data.structuredData) {
    const hasStructuredData = data.structuredData.some((sd) => sd.found);
    if (!hasStructuredData) {
      recommendations.push({
        text: "Ajoutez des données structurées (Schema.org) pour améliorer l'affichage dans les résultats de recherche",
        severity: "medium",
      });
    }
  }

  // Meta tags recommendations
  if (data.metaTags) {
    if (!data.metaTags.viewport) {
      recommendations.push({
        text: "Ajoutez une balise viewport pour améliorer l'affichage sur mobile",
        severity: "high",
      });
    }

    if (
      !data.metaTags.ogTitle ||
      !data.metaTags.ogDescription ||
      !data.metaTags.ogImage
    ) {
      recommendations.push({
        text: "Ajoutez des balises Open Graph pour améliorer le partage sur les réseaux sociaux",
        severity: "medium",
      });
    }

    if (!data.metaTags.twitterCard) {
      recommendations.push({
        text: "Ajoutez des balises Twitter Card pour améliorer le partage sur Twitter",
        severity: "low",
      });
    }
  }

  // Performance recommendations
  if (data.lighthouseScore < 50) {
    recommendations.push({
      text: "Votre score de performance est faible. Optimisez les images, réduisez le JavaScript et le CSS bloquant le rendu",
      severity: "high",
    });
  } else if (data.lighthouseScore < 90) {
    recommendations.push({
      text: "Améliorez votre score de performance en optimisant les ressources et en réduisant le temps de chargement",
      severity: "medium",
    });
  }

  // Add some general recommendations
  recommendations.push({
    text: "Utilisez des URL conviviales pour les moteurs de recherche avec des mots-clés pertinents",
    severity: "low",
  });

  recommendations.push({
    text: "Assurez-vous que votre site est mobile-friendly et s'adapte à tous les appareils",
    severity: "medium",
  });

  return recommendations;
}
