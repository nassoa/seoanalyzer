# SEO Analyzer

**Analysez rapidement les éléments SEO de votre site web et obtenez des recommandations pour améliorer votre référencement.**

## Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Tech Stack](#tech-stack)
- [Licence](#licence)

## Description

SEO Analyzer est une application web développée avec Next.js qui vous permet d'analyser rapidement les éléments SEO (balises meta, structure de titres, liens internes/externes, etc.) de n'importe quel site web. Vous obtenez des recommandations concrètes pour optimiser votre référencement et améliorer la visibilité de votre site sur les moteurs de recherche.

## Fonctionnalités

- Analyse automatique des balises `<title>`, `<meta description>` et `<meta keywords>`
- Vérification de la structure des titres (H1 à H6)
- Analyse des attributs `alt` sur les images
- Audit des liens internes et externes
- Vérification de la vitesse de chargement et suggestions d’optimisation
- Rapport complet avec recommandations actionnables
- Interface claire et responsive

## Comparaison SEO

- Comparez les éléments SEO de plusieurs sites web en entrant plusieurs URLs.
- Identifiez et comparez les forces et faiblesses de chaque site côte à côte.

## Tech Stack

- **Framework** : [Next.js](https://nextjs.org/)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Formulaire** : React Hook Form et Zod
- **Analyse HTML** : Cheerio
- **Visualisation** : Recharts
- **API externe** : Google PageSpeed Insights (via PAGESPEED_API_KEY) pour l'analyse des performances, de l'accessibilité et du SEO

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.
