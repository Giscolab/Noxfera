# 🌼Noxfera

**Un éditeur de code moderne avec aperçu en direct, formatage intelligent, analyse de complexité et bien plus encore.**  
Propulsé par React, Zustand, Monaco Editor, FastAPI et Tailwind.

---

## 🔗 Informations sur le projet

- 🧠  : https://lovable.dev/projects/1d0ed299-78a6-40e9-aa0f-b45bafa13703

---

## 🧰 Stack Technique

| Type         | Technologies principales                                                                  |
|--------------|-------------------------------------------------------------------------------------------|
| **Frontend** | React + Vite + Zustand + Tailwind + Shadcn/UI + Monaco Editor |
| **Backend**  | FastAPI (via `fetch` + `healthcheck`) — actuellement local, futur support Docker/Supabase |
| **Langages** | TypeScript, HTML, CSS, JavaScript   |
| **Infrastructure** | Full local — build rapide, preview instantané  |

---

## ✨ Fonctionnalités principales

- 🎨 Éditeur multi-langages avec thème personnalisable
- 🖼️ Aperçu en temps réel pour HTML/CSS/JS
- 🧽 Beautify & Minification automatique
- 🕵️ Analyse de complexité, duplication, indentation, commentaires
- 🔐 Obfuscation JS avancée (mode développeur)
- 🪄 Détection automatique de langage
- (https://lovable.dev/projects/1d0ed299-78a6-40e9-aa0f-b45bafa13703)
- 🗃️ Gestionnaire de fichiers intégrés (multi-fichiers, import/export)
- 💾 Sauvegarde projet locale (`localStorage`)

---

## 🛠️ Installation locale

### 📦 Prérequis

- [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/)  
👉 Recommandé : installation via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

---

### ⚙️ Étapes d'installation

```bash
# Étape 1 : Cloner le dépôt
git clone <YOUR_GIT_URL>

# Étape 2 : Aller dans le dossier du projet
cd <YOUR_PROJECT_NAME>

# Étape 3 : Installer les dépendances
npm install

# Étape 4 : Lancer le serveur de développement
npm run dev
```
```bash
src/
│
├── components/             # Composants UI (groupés par domaine)
├── pages/                  # Pages principales (Index, NotFound)
├── stores/                 # Zustand stores (state global)
├── hooks/                  # Hooks custom
├── lib/                    # Fonctions utilitaires
├── index.css               # CSS globale (importe Tailwind)
└── main.tsx                # Point d’entrée React
📦 Scripts disponibles
Commande	Description
npm run dev	Lance le projet en mode développement
npm run build	Build l’application pour production
npm run preview	Prévisualise le build localement
npm run lint	(optionnel) Lint le code avec ESLint
```
📄 Licence
Ce projet est sous licence MIT. Vous êtes libre de le modifier, le distribuer et l’utiliser dans vos propres projets.

💬 Contact
Développé avec ❤️ par Franck.

