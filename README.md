# By: Hanim MOUSSA YARI & Linerol Tchecounnou

# TimeTravel Agency — Webapp interactive

Webapp d'une agence de voyage temporel de luxe (fictive), permettant de découvrir
trois destinations à travers les époques, d'être conseillé par un agent
conversationnel IA, et de trouver sa destination idéale via un quiz personnalisé.

🔗 **Démo en ligne :** [Notre App](https://webappinteractive.vercel.app/)

## ✦ Destinations

- **Paris 1889** — la Belle Époque, l'Exposition Universelle et la Tour Eiffel.
- **Crétacé -65M** — les derniers jours d'un monde dominé par les dinosaures.
- **Florence 1504** — la Renaissance, Michel-Ange et Léonard de Vinci.

## 🛠️ Stack technique

- **React** (composants fonctionnels + Hooks)
- **Vite** (build et serveur de développement)
- **CSS-in-JS** (styles en ligne + animations CSS, sans dépendance externe)
- **Fonction serverless Vercel** (`/api/chat`) pour le chatbot
- **Mistral AI API** (`mistral-small-latest`) côté serveur
- **Hébergement :** Vercel (déploiement continu depuis GitHub)

## ✨ Fonctionnalités

- Landing page immersive (hero animé, ambiance temporelle)
- Galerie des 3 destinations : cards interactives + fiches détaillées (modales)
- Chatbot IA conversationnel (personnalité « conseiller temporel », tarifs et FAQ)
- Quiz de recommandation personnalisée (4 questions → destination idéale)
- Animations au scroll, micro-interactions, design responsive mobile-first
- Mode sombre, esthétique « luxe » (noir + accents dorés)

## 🤖 Outils d'IA utilisés (transparence)

- **Génération du code :** [VOTRE OUTIL — ex. Claude Code dans VS Code]
- **Chatbot :** Mistral Small (`mistral-small-latest`) via l'API Mistral,
  appelée par une fonction serverless pour ne jamais exposer la clé côté client
- **Visuels des destinations :** illustrations SVG originales (vectorielles),
  réalisées aux couleurs du site
  > _Remplacez cette ligne si vous avez généré vos images avec un outil IA
  > (ex. Bing Image Creator, Leonardo.ai), en précisant lequel._

## 🚀 Installation & lancement local

```bash
# 1. Cloner le dépôt
git clone https://github.com/LFlem/webappinteractive.git
cd webappinteractive

# 2. Installer les dépendances
npm install

# 3. Lancer le projet
# - npm run dev        -> front uniquement (le chatbot /api ne répond pas)
# - vercel dev         -> front + fonction serverless (chatbot fonctionnel)
```

### Variable d'environnement requise

Le chatbot nécessite une clé API Mistral, à définir **côté serveur uniquement** :

| Nom | Description |
|-----|-------------|
| `MISTRAL_API_KEY` | Clé obtenue sur [console.mistral.ai](https://console.mistral.ai) |

En local : créez un fichier `.env` à la racine avec `MISTRAL_API_KEY=...`
En production : ajoutez-la dans Vercel → *Settings → Environment Variables*.

> ⚠️ Ne jamais committer la clé API ni le fichier `.env` (ajoutez `.env` au `.gitignore`).

## 📦 Structure du projet

```
.
├── api/
│   └── chat.js                 # Fonction serverless : appelle Mistral
├── public/
│   ├── paris-1889.jpg          # Visuels des destinations
│   ├── cretace.jpg
│   └── florence-1504.jpg
├── src/
│   ├── TimeTravelAgency.jsx    # Composant principal (UI + chatbot + quiz)
│   └── main.jsx
└── README.md
```

## 👥 Équipe

Projet réalisé par Hanim MOUSSA YARI, Linerol TCHECOUNNOU.

## 📄 Licence

Projet pédagogique — M1/M2 Digital & IA. Agence et contenus fictifs.
Aucun paradoxe temporel n'a été créé durant la conception de ce site.
