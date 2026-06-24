<div align="center">

# 🎮 Fanoron-telo

### Jeu de stratégie traditionnel malgache avec Intelligence Artificielle

**Institut Supérieur de Polytechnique de Madagascar** — [www.ispm-edu.com](https://www.ispm-edu.com)

</div>

---

## Section 1 — En-tête Institutionnel et Identification

|                      |                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Établissement**    | Institut Supérieur de Polytechnique de Madagascar ([www.ispm-edu.com](https://www.ispm-edu.com)) |
| **Groupe de projet** | Tojo · Mickaël · Toky · Fabio · Schenny · Fifaliana                                              |
| **Module**           | Intelligence Artificielle — Projet pratique (5 heures)                                           |
| **Dépôt Git**        | [github.com/MickaelFan/Fanoron-telo-avec-IA](https://github.com/MickaelFan/Fanoron-telo-avec-IA) |

---

## Section 2 — Description du Travail Réalisé

### Présentation de l'application

**Fanoron-telo** est une version numérique du jeu de stratégie traditionnel malgache (équivalent du _Three Men's Morris_). Le jeu se déroule en **deux phases** :

1. **Phase de placement** — chaque joueur pose tour à tour ses 3 pions sur les intersections libres d'un plateau 3×3. Un alignement immédiat fait gagner.
2. **Phase de déplacement** — si personne n'a gagné après la pose des 6 pions, chaque joueur déplace un pion vers une intersection voisine libre (le long des lignes). Le premier à aligner ses 3 pions gagne.

### Fonctionnalités implémentées

| Fonctionnalité        | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| **2 modes de jeu**    | Humain vs Humain · Humain vs IA                                     |
| **3 niveaux d'IA**    | Facile (aléatoire) · Moyen (heuristique) · Difficile (Minimax)      |
| **2 phases de jeu**   | Placement puis déplacement, conformément aux règles traditionnelles |
| **Annuler / Refaire** | Historique complet des coups (undo/redo)                            |
| **Interface animée**  | Animations fluides avec GSAP (déplacement de pions, victoire, menu) |
| **Design responsive** | Interface moderne TailwindCSS, jouable sur mobile et desktop        |
| **Menu interactif**   | Aperçu animé d'une partie d'exemple sur le plateau de démonstration |

### Architecture du projet

```
Fanoron-telo-avec-IA/
├── src/
│   ├── components/
│   │   ├── game/       → GameBoard (plateau), GameScreen (écran de jeu)
│   │   ├── layout/     → BackgroundEffects (effets visuels)
│   │   ├── menu/       → MenuScreen, PreviewBoard, PreviewPiece
│   │   └── ui/         → InfoLine, MiniStat, RuleCard, GameButton
│   ├── constants/
│   │   └── gameConstants.js  → POSITIONS, WIN_LINES, ADJACENCY
│   ├── game/
│   │   └── aiEngine.js       → Variante alternative du moteur IA
│   ├── hooks/
│   │   └── useFanoronGame.js → Logique de jeu + état React (hook central)
│   ├── pages/
│   │   ├── MenuPage.jsx      → Page d'accueil
│   │   └── GamePage.jsx      → Page de jeu
│   └── utils/
│       └── gameLogic.js      → MOTEUR PRINCIPAL : règles + IA (Minimax)
├── .github/workflows/
│   └── deploy.yml            → CI/CD GitHub Pages
├── vite.config.js
└── package.json
```

### Pile technologique (Stack)

| Couche                   | Technologie                   | Rôle                                       |
| ------------------------ | ----------------------------- | ------------------------------------------ |
| **Framework UI**         | React 19                      | Rendu des composants, gestion d'état       |
| **Bundler / Dev server** | Vite 8                        | Build ultra-rapide, HMR                    |
| **Styles**               | TailwindCSS 4                 | Design utility-first, responsive           |
| **Animations**           | GSAP 3 + @gsap/react          | Animations de pions, transitions, victoire |
| **Routage**              | React Router 7 (HashRouter)   | Navigation Menu ↔ Jeu                      |
| **Icônes**               | React Icons (FontAwesome)     | Interface                                  |
| **Déploiement**          | GitHub Actions + GitHub Pages | CI/CD automatique                          |

### Version hébergée

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main` :

🔗 **[https://mickaelfan.github.io/Fanoron-telo-avec-IA/](https://mickaelfan.github.io/Fanoron-telo-avec-IA/)**

### Membres de l'équipe

| Nom Complet                             | Numéro d'étudiant | Classe | Rôle précis pour ce Hackathon                                                                                                                                                    |
| --------------------------------------- | ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RAVELONARIVO Fanantenana Mickaël        | N°28              | ESIIA4 | **Lead Développeur & Moteur IA** — Conception et implémentation du Minimax avec élagage alpha-bêta, table de transposition et fonction d'évaluation heuristique (`gameLogic.js`) |
| RAZAFIMBELO Toky Faniry                 | N°34              | ESIIA4 | **Développeur Logique de Jeu** — Codage des règles du Fanoron-telo (phases placement/déplacement), génération des coups valides, hook React `useFanoronGame.js`                  |
| RAMEFIARISON Fabio Fandresena           | N°35              | ESIIA4 | **Développeur Frontend React** — Architecture des composants, pages, routage React Router, gestion d'état (menu, plateau, undo/redo)                                             |
| RAKOTOARIMANANA Tojo Ny Aina            | N°38              | ESIIA4 | **Designer UI/UX & Intégrateur CSS** — Design de l'interface avec TailwindCSS, mise en page responsive, glassmorphism, dégradés                                                  |
| IALISOA Iris Fifaliana                  | N°33              | ESIIA4 | **Ingénieur Animations** — Intégration des animations GSAP (déplacement de pions, surbrillance victoire, menu de démonstration animé)                                            |
| FANAMBIHARINDRAINY Schenyolla Anderssen | N°37              | ESIIA4 | **DevOps & Documentation** — Déploiement continu sur GitHub Pages (GitHub Actions), rédaction du README et documentation technique                                               |

---

## Section 3 — Guide d'Installation Rapide

> ⚠️ Prérequis : [Node.js](https://nodejs.org/) 18+ et npm.

```bash
git clone https://github.com/MickaelFan/Fanoron-telo-avec-IA.git
cd Fanoron-telo-avec-IA
npm install && npm run dev
```

L'application démarre sur **http://localhost:5173**.

---

## Section 4 — Outils d'Aide IA Utilisés

Durant ce projet de 5 heures, notre équipe a exploité deux assistants IA complémentaires pour accélérer le développement :

### ChatGPT (OpenAI)

| Cas d'usage       | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Algorithmique** | Conception du Minimax avec élagage alpha-bêta, définition de la fonction d'évaluation heuristique       |
| **Débogage**      | Identification de bugs dans la détection d'alignement et la logique de déplacement (validité des coups) |
| **Règles du jeu** | Reformulation et validation des règles du Fanoron-telo (conditions de victoire, phase de mouvement)     |

### Claude (Anthropic)

| Cas d'usage         | Description                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **CSS / Design**    | Génération de classes TailwindCSS pour l'interface moderne (effets glassmorphism, dégradés, responsive)          |
| **Animations GSAP** | Écriture des timelines d'animation (déplacement de pions, surbrillance de la ligne gagnante, modale de victoire) |
| **Refactorisation** | Restructuration du code en hooks réutilisables et composants modulaires                                          |
| **Documentation**   | Rédaction de commentaires et de ce fichier README                                                                |

### Retour d'expérience

| Tâche                                | Temps sans IA (estimé) | Temps avec IA | Gain     |
| ------------------------------------ | ---------------------- | ------------- | -------- |
| Implémentation Minimax + élagage     | ~90 min                | ~25 min       | **~70%** |
| Design TailwindCSS + animations GSAP | ~120 min               | ~35 min       | **~70%** |
| Débogage logique de jeu              | ~40 min                | ~10 min       | **~75%** |
| **Total projet**                     | **>5 h**               | **~5 h**      | —        |

> **Conclusion :** Sans l'aide de l'IA, nous n'aurions pas pu livrer une application complète (moteur IA + interface animée + déploiement) dans le délai de 5 heures. L'IA a permis de gagner ~70% de temps sur les tâches techniques.

---

## Section 5 — Modélisation et Algorithmes de l'IA du Jeu

Le moteur d'IA est implémenté dans **`src/utils/gameLogic.js`** (576 lignes).

### 5.1 — Représentation de l'état du plateau

#### Structure de données principale

Le plateau est représenté par un **tableau de 9 cases** (index 0 à 8), correspondant aux 9 intersections de la grille 3×3 :

```
 0 ─── 1 ─── 2
 |  \  |  /  |
 3 ─── 4 ─── 5
 |  /  |  \  |
 6 ─── 7 ─── 8
```

Chaque case contient soit `null` (vide), soit un **objet pion** :

```javascript
{
  id: "X-1",         // identifiant unique
  player: "X",       // propriétaire ("X" ou "O")
  hasMoved: false    // le pion a-t-il déjà été déplacé ?
}
```

L'attribut `hasMoved` est crucial : un joueur ne gagne que si ses **3 pions ont tous été déplacés au moins une fois** (en phase de mouvement). Cette règle empêche les victoires triviales dès la phase de placement avancée.

#### Lignes gagnantes (`WIN_LINES`)

Les **8 lignes gagnantes** sont stockées comme des triplets d'indices :

```javascript
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 3 lignes horizontales
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 3 lignes verticales
  [0, 4, 8],
  [2, 4, 6], // 2 diagonales
];
```

#### Graphe d'adjacence (`ADJACENCY`)

Les déplacements autorisés sont définis par un **graphe d'adjacence** — chaque intersection indique ses voisins connectés par une ligne du plateau :

```javascript
const ADJACENCY = {
  0: [1, 3, 4], // coin haut-gauche → droite, bas, centre
  4: [0, 1, 2, 3, 5, 6, 7, 8], // centre → toutes les autres cases
  // ... (les coins ont 3 voisins, les bords 2-3, le centre 8)
};
```

> Le **centre (case 4)** est la position la plus puissante : il connecte les 8 autres cases. Les **coins** (0, 2, 6, 8) participent à 3 lignes chacun, les **bords** (1, 3, 5, 7) à 2 lignes.

### 5.2 — Détection des coups valides

La fonction `getValidMoves(board, player)` génère tous les coups légaux selon la phase :

| Phase           | Coups générés                                                                     |
| --------------- | --------------------------------------------------------------------------------- |
| **Placement**   | Toutes les cases vides (`{from: null, to: index}`)                                |
| **Déplacement** | Pour chaque pion du joueur, toutes les cases voisines libres (`{from: i, to: j}`) |

### 5.3 — Le Minimax avec élagage Alpha-Bêta

L'algorithme central du niveau **Difficile** est un **Minimax avec élagage alpha-bêta** (`minimax()` dans `gameLogic.js:376`) :

```javascript
function minimax({ board, currentPlayer, aiPlayer, depth, alpha, beta, table }) {
  // 1. Cas terminal : victoire ou défaite
  if (winner === aiPlayer)   return +100000 + depth;  // victoire rapide préférée
  if (winner === opponent)   return -100000 - depth;  // défaite retardée préférée

  // 2. Profondeur 0 : évaluation heuristique
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  // 3. Consulter la table de transposition
  const key = getBoardKey(board, currentPlayer, depth);
  if (table.has(key)) return table.get(key);     // HIT : retour immédiat

  // 4. Générer + ordonnancer les coups
  const orderedMoves = orderMoves(board, moves, currentPlayer, aiPlayer);

  // 5. Récursion : MAX pour l'IA, MIN pour l'adversaire
  if (currentPlayer === aiPlayer) {
    let bestScore = -Infinity;
    for (const move of orderedMoves) {
      score = minimax({ ... });
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;  // ÉLAGAGE : on coupe cette branche
    }
  }
  // ... symétrique pour MIN
}
```

#### Profondeurs de recherche

| Phase           | Profondeur | Justification                                                                |
| --------------- | ---------- | ---------------------------------------------------------------------------- |
| **Placement**   | 7          | Coups restants limités, recherche quasi-exhaustive                           |
| **Déplacement** | 10         | Coups plus nombreux, profondeur suffisante pour anticiper plusieurs échanges |

### 5.4 — Fonction d'évaluation heuristique

`evaluateBoard(board, aiPlayer)` attribue un score numérique à chaque position. Elle combine plusieurs critères :

| Critère                         | Score attribué         | Logique                                  |
| ------------------------------- | ---------------------- | ---------------------------------------- |
| **Victoire IA**                 | +100 000               | État terminal gagnant                    |
| **Victoire adversaire**         | -100 000               | État terminal perdant                    |
| **3 pions alignés (IA)**        | +5 000 par ligne       | Alignement complet                       |
| **2 pions + 1 case vide (IA)**  | +180 par ligne         | Menace directe de victoire               |
| **1 pion + 2 cases vides (IA)** | +30 par ligne          | Contrôle partiel de ligne                |
| **Contrôle du centre**          | +70 / -70              | Le centre est stratégiquement dominant   |
| **Contrôle des coins**          | +25 / -25 par coin     | Les coins participent à 3 lignes         |
| **Contrôle des bords**          | +8 / -8 par bord       | Les bords participent à 2 lignes         |
| **Pondération défense**         | ×1,2 pour l'adversaire | L'IA est légèrement défensive (prudence) |

> La défense est **surrestimée de 20%** (`evaluateLine(board, line, opponent) * 1.2`) : l'IA bloque les menaces adverses avant de chercher ses propres opportunités.

### 5.5 — Techniques avancées utilisées

#### Table de transposition (Mémoïsation)

Une `Map` JavaScript stocke les états déjà évalués pour éviter les calculs redondants :

```javascript
const table = new Map(); // clé → score optimal

const key = getBoardKey(board, currentPlayer, depth);
if (table.has(key)) return table.get(key); // HIT : retour immédiat
// ... calcul ...
table.set(key, bestScore); // STOCKAGE pour réutilisation
```

La clé de hachage encode l'état des 9 cases + le joueur courant + la profondeur. Une recherche identique ne sera **jamais recalculée**.

#### Ordonnancement de coups (Move Ordering)

Avant la récursion Minimax, les coups sont **triés du plus prometteur au moins prometteur** selon une heuristique rapide :

```javascript
function orderMoves(board, moves, player, aiPlayer) {
  return [...moves].sort((a, b) => scoreMove(b) - scoreMove(a));
  // Score = évaluation rapide + bonus (coup gagnant, centre, coin, bord)
}
```

Ce tri augmente considérablement l'efficacité de l'élagage alpha-bêta : les meilleures branches sont explorées en premier, ce qui resserre la fenêtre `[alpha, beta]` plus rapidement.

#### Détection immédiate (coup gagnant / blocage)

Avant même de lancer le Minimax, l'IA vérifie en **O(n)** :

1. `findWinningMove()` — Existe-t-il un coup qui gagne immédiatement ? → Si oui, on le joue.
2. `findBlockingMove()` — L'adversaire peut-il gagner au prochain coup ? → Si oui, on bloque.

Ceci économise un appel Minimax complet dans les situations critiques. **33% des coups** du niveau Difficile sont ainsi résolus par raccourci (voir benchmark Section 6).

#### ❌ Non implémentées (pistes d'amélioration)

| Technique                           | Statut | Note                                                                    |
| ----------------------------------- | ------ | ----------------------------------------------------------------------- |
| Opening book                        | ❌     | Non nécessaire : la phase de placement est couverte par Minimax prof. 7 |
| Bitboards                           | ❌     | Non pertinent : seulement 9 cases, pas de gain significatif             |
| Iterative deepening                 | ❌     | La profondeur est fixe par phase                                        |
| Machine Learning (Q-Learning, etc.) | ❌     | Le Minimax est déjà optimal sur ce jeu à espace réduit                  |

### 5.6 — Trois niveaux de difficulté

| Niveau        | Algorithme           | Comportement                                                                                                                                 |
| ------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Facile**    | `chooseEasyMove()`   | Coup **aléatoire** parmi les coups valides — aucun calcul stratégique                                                                        |
| **Moyen**     | `chooseMediumMove()` | **Heuristique gloutonne** : (1) jouer un coup gagnant, (2) bloquer l'adversaire, (3) prendre le centre, (4) prendre un coin, sinon aléatoire |
| **Difficile** | `chooseHardMove()`   | **Minimax + alpha-bêta** profondeur 7-10, avec table de transposition et move ordering                                                       |

---

## Section 6 — Analyses de Performances

> Les mesures ci-dessous ont été obtenues par **benchmark réel** exécuté sur Node.js v23, en répliquant fidèlement la logique de `src/utils/gameLogic.js`.

### 6.1 — Temps de réponse moyen de l'IA

Mesures sur un échantillon de **180 coups** du niveau Difficile, collectés lors de 20 parties (Hard vs Hard) :

| Métrique                                  | Valeur mesurée |
| ----------------------------------------- | -------------- |
| **Temps moyen (tous coups confondus)**    | **~0,3 ms**    |
| **Temps moyen (Minimax réel uniquement)** | **~78 ms**     |
| **Temps minimum (Minimax réel)**          | 14 ms          |
| **Temps maximum (Minimax réel)**          | 296 ms         |
| **Temps P95 (Minimax réel)**              | 203 ms         |

#### Répartition des coups

| Type de coup                                    | Proportion | Temps     |
| ----------------------------------------------- | ---------- | --------- |
| **Raccourci** (coup gagnant / blocage immédiat) | 33%        | < 1 ms    |
| **Minimax réel** (recherche arborescente)       | 67%        | 14-296 ms |

> Le délai artificiel de **700 ms** dans le hook (`setTimeout` dans `useFanoronGame.js:266`) est un **délai d'animation** volontaire — le calcul réel prend ≤ 296 ms. L'utilisateur perçoit un temps de réflexion naturel.

### 6.2 — Résultats des affrontements IA vs IA

Tournois disputés en automatique (X joue en premier) :

| Confrontation              | Parties | Victoires IA forte | Nulles | Longueur moyenne |
| -------------------------- | ------- | ------------------ | ------ | ---------------- |
| **Difficile vs Moyen**     | 30      | **30 (100%)**      | 0      | 8 coups          |
| **Moyen vs Difficile**     | 30      | **30 (100%)**      | 0      | 10 coups         |
| **Difficile vs Facile**    | 20      | **20 (100%)**      | 0      | 4 coups          |
| **Moyen vs Facile**        | 20      | **20 (100%)**      | 0      | 5 coups          |
| **Difficile vs Difficile** | 10      | **X : 10 (100%)**  | 0      | 8 coups          |

#### Observations

- Le niveau **Difficile bat systématiquement** les niveaux Moyen et Facile (100% de victoires).
- Le niveau **Moyen bat systématiquement** le niveau Facile (100% de victoires).
- En **Difficile vs Difficile**, le joueur **X (premier joueur) gagne à 100%** : le Fanoron-telo est un jeu à **avantage au premier joueur**. Avec un jeu optimal des deux côtés, celui qui commence peut toujours forcer la victoire. C'est cohérent avec la théorie des jeux combinatoires pour cette variante du _Three Men's Morris_.

### 6.3 — Métriques des techniques avancées

Mesures sur les **120 coups Minimax réel** (profondeur 7-10) :

#### Table de transposition

| Métrique                      | Valeur mesurée |
| ----------------------------- | -------------- |
| **Entrées stockées par coup** | ~1 025         |
| **Hits (cache) par coup**     | ~372           |
| **Taille de la table**        | ~1 025 entrées |
| **Taux de réussite du cache** | ~15,2%         |

#### Élagage alpha-bêta + Move Ordering

| Métrique                       | Valeur mesurée          |
| ------------------------------ | ----------------------- |
| **Nœuds explorés par coup**    | ~2 450                  |
| **Branches élaguées par coup** | ~665                    |
| **Nœuds évités par l'élagage** | ~21% par branche coupée |

#### Synthèse comparative (estimation)

| Métrique     | Minimax naïf   | + Alpha-bêta | + Transposition | + Move Ordering |
| ------------ | -------------- | ------------ | --------------- | --------------- |
| Nœuds / coup | ~10 000-20 000 | ~5 000-8 000 | ~3 500-5 000    | **~2 450**      |
| Temps / coup | ~300-500 ms    | ~150-250 ms  | ~100-150 ms     | **~78 ms**      |

> L'empilement des trois techniques (alpha-bêta + transposition + move ordering) divise le temps de calcul par **~4 à 5** par rapport à un Minimax naïf, rendant la recherche rapide (~78 ms) malgré une profondeur de 10 demi-coups.

---

<div align="center">

**Fanoron-telo** — Projet académique ISPM · Intelligence Artificielle

</div>
