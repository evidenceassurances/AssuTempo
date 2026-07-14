const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CosmosCanvas-CMbUEmbF.js","assets/rolldown-runtime-Cyuzqnbw.js","assets/framer-Be3hPn0e.js"])))=>i.map(i=>d[i]);
import{a as e,n as t}from"./rolldown-runtime-Cyuzqnbw.js";import{A as n,j as r}from"./framer-Be3hPn0e.js";import{c as i,f as a,h as o,l as s,p as c,t as ee}from"./react-vendor-BDTje4YY.js";import{c as l,l as te}from"./index-v6ITZSMV.js";var ne,u=t((()=>{ne=`
.atp-root {
  --atp-gold: #C9A84C;
  --atp-gold-light: #E8C97A;
  --atp-gold-deep: #A8862F;
  --atp-cream: #F4F1EA;
  --atp-muted: #9b938a;
  --atp-panel: #0e0b08;
  --atp-panel-2: #16110b;
  --atp-line: rgba(201,168,76,0.18);
  --atp-line-strong: rgba(201,168,76,0.38);
  --atp-shadow: 0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,201,122,0.06);
  --atp-ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: fixed;
  z-index: 2147483000;
  /* Regle absolue : le widget est ancre en bas a DROITE sur tous les ecrans.
     Jamais de left sur ce conteneur (un left+right etirait le root en bande
     pleine largeur sur mobile et envoyait le launcher au bord gauche, coupe). */
  right: max(16px, env(safe-area-inset-right));
  bottom: calc(16px + env(safe-area-inset-bottom));
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--atp-cream);
  -webkit-font-smoothing: antialiased;
}
.atp-root *,
.atp-root *::before,
.atp-root *::after { box-sizing: border-box; }

.atp-serif {
  font-family: Georgia, 'Times New Roman', 'Iowan Old Style', serif;
  letter-spacing: 0.01em;
}

/* ====================== LANCEUR (FAB) ====================== */
/* Dock = etiquette + bouton dans un MEME conteneur flex, ancre a droite via
   .atp-root. L'etiquette s'etend vers la gauche : le bouton ne bouge jamais.
   C'est aussi le dock entier qui s'estompe (chevauchement CTA, drag du curseur). */
.atp-dock {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.3s var(--atp-ease);
}
/* chevauche un CTA de la page : escamote a 40 %, reste cliquable */
.atp-dock--dim { opacity: 0.4; }
/* curseur du cadran en cours de drag : disparait completement */
.atp-dock--away { opacity: 0; pointer-events: none; }

/* Bouton circulaire 56 px, famille du cadran : fond #141210, fin anneau dore,
   bulle doree centree. AUCUN enfant ni pseudo-element ne depasse du cercle. */
.atp-launcher {
  position: relative;
  width: 56px; height: 56px;
  flex: none;
  border-radius: 50%;
  border: 1px solid rgba(232,199,102,0.4);
  background: #141210;
  color: var(--atp-gold-light);
  cursor: pointer;
  padding: 0;
  display: grid; place-items: center;
  overflow: hidden; /* garantie : rien ne deborde du cercle */
  box-shadow: 0 10px 28px rgba(0,0,0,0.45);
  transition: transform 0.18s var(--atp-ease), box-shadow 0.45s var(--atp-ease);
  touch-action: manipulation; /* supprime le delai de click (double-tap-zoom) iOS */
  -webkit-tap-highlight-color: transparent;
}
.atp-launcher:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.55), 0 0 22px rgba(201,168,76,0.18); }
/* retour visuel net au tap (pression rapide) */
.atp-launcher:active { transform: scale(0.9); transition-duration: 0.07s; }
.atp-launcher:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 3px; }

/* Pulsation CONTENUE : le lisere dore respire en opacite (cycle ~3 s) a
   l'interieur des 56 px (inset 0, la bordure se dessine dans la boite).
   Remplace les anneaux concentriques qui s'etendaient hors du bouton. */
.atp-launcher::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(232,199,102,0.85);
  opacity: 0;
  pointer-events: none;
  animation: atp-ring-breathe 3s ease-in-out infinite;
}

/* ===== ETIQUETTE "Besoin d'aide ?" : pastille SOLIDAIRE du bouton =====
   Flex item a gauche du launcher (jamais orpheline). Pilotee par JS
   (data-show) : apparait 1,5 s apres le chargement, reste 5 s, se replie
   (transform/opacity uniquement, origine a droite -> effet de repli vers le
   bouton), puis ne revient qu'apres 30 s d'inactivite sur la meme page.
   Invisible = visibility:hidden + pointer-events:none (aucune zone fantome). */
.atp-hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 9999px;
  background: rgba(20, 18, 16, 0.94);
  border: 1px solid rgba(232, 199, 102, 0.35);
  color: var(--atp-gold-light);
  font-family: inherit;          /* police du site (Inter), jamais une serif */
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateX(10px) scaleX(0.8);
  transform-origin: right center;
  transition:
    opacity 0.35s var(--atp-ease),
    transform 0.35s var(--atp-ease),
    visibility 0s linear 0.35s;
  will-change: transform, opacity;
}
.atp-hint::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--atp-gold-light);
  flex: none;                    /* petit point dore avant le texte */
}
.atp-hint[data-show] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: none;
  transition-delay: 0s;
}

/* ============ SIGIL SIGNATURE : anneau + particule en orbite ============ */
.atp-sigil { position: relative; width: 34px; height: 34px; }
.atp-sigil-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1.5px solid var(--atp-gold);
  opacity: 0.85;
}
.atp-sigil-ring::after {
  content: ''; position: absolute; inset: 5px; border-radius: 50%;
  border: 1px solid rgba(232,201,122,0.35);
}
.atp-sigil-core {
  position: absolute; top: 50%; left: 50%;
  width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--atp-gold-light), var(--atp-gold-deep));
  box-shadow: 0 0 10px rgba(232,201,122,0.7);
  animation: atp-core-pulse 3.6s var(--atp-ease) infinite;
}
/* l'orbite : un conteneur qui tourne, avec la particule excentree */
.atp-sigil-orbit {
  position: absolute; inset: 0;
  animation: atp-orbit 5.5s linear infinite;
  transform-origin: 50% 50%;
}
.atp-sigil-particle {
  position: absolute; top: -2px; left: 50%;
  width: 5px; height: 5px; margin-left: -2.5px;
  border-radius: 50%;
  background: var(--atp-gold-light);
  box-shadow: 0 0 8px rgba(232,201,122,0.9);
}

/* ============ MOBILE LEGER (.atp-root--lite) ============ */
/* Sur mobile, l'ambiance cosmos (canvas + rAF, nebuleuse, aura) n'est meme pas
   montee (gere en JS). Ici on coupe les animations decoratives lourdes du sigil
   (avatar du header du panneau), mais on GARDE la pulsation du lisere du bouton
   (::before, opacite seule sur 56 px, perf-safe) : c'est elle qui montre qu'il
   est interactif. */
.atp-root--lite .atp-launcher { will-change: auto; }
.atp-root--lite .atp-sigil-orbit { animation: none; }
.atp-root--lite .atp-sigil-core { animation: none; }
.atp-root--lite .atp-sigil-particle { display: none; }
/* OUVERTURE INSTANTANEE (cause racine du delai mobile) : l'animation par defaut
   fait un scale(0.9->1) sur un panneau quasi plein ecran avec une grande ombre
   floue (blur 70px). Sur Safari mobile, scaler un element plein ecran force la
   re-rasterisation de toute l'ombre A CHAQUE FRAME -> plusieurs secondes de gel.
   Sur mobile on remplace par un simple glissement (translateY, GPU) et une ombre
   legere en bord : raster trivial, ouverture immediate. */
.atp-root--lite .atp-panel {
  box-shadow: none; /* pas d'ombre floue plein ecran a rasteriser sur mobile */
  border-color: var(--atp-line-strong);
  transform-origin: bottom center;
  animation: atp-panel-in-lite 0.24s var(--atp-ease) both;
}
.atp-root--lite .atp-panel--closing { animation: atp-panel-out-lite 0.18s var(--atp-ease) both; }

/* ====================== PANNEAU ====================== */
.atp-panel {
  position: absolute;
  right: 0; bottom: 0;
  width: 380px;
  height: min(620px, calc(100vh - 48px));
  height: min(620px, calc(100dvh - 48px)); /* dvh : pas de saut avec la barre Safari */
  display: flex; flex-direction: column;
  border-radius: 22px;
  overflow: hidden;
  isolation: isolate; /* stacking propre : etoiles en fond, contenu au-dessus */
  background: linear-gradient(180deg, var(--atp-panel-2) 0%, var(--atp-panel) 38%);
  border: 1px solid var(--atp-line);
  box-shadow: var(--atp-shadow);
  transform-origin: bottom right;
  animation: atp-panel-in 0.5s var(--atp-ease) both;
}
.atp-panel--closing { animation: atp-panel-out 0.28s var(--atp-ease) both; }

/* Mobile : la fenetre devient une FEUILLE ancree en bas, pleine largeur,
   ~92svh, coins superieurs arrondis, fermeture visible en haut (header du
   panneau). position:fixed -> decorrelee du root (qui reste le point d'ancrage
   bas-droite du launcher, sans left, jamais etire en bande pleine largeur). */
@media (max-width: 640px) {
  .atp-panel {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    width: auto;
    height: 92vh;  /* secours anciens navigateurs */
    height: 92svh; /* svh : stable avec la barre Safari */
    border-radius: 20px 20px 0 0;
    border-left: none; border-right: none; border-bottom: none;
  }
  /* dernier element de la feuille : ecarte de l'indicateur home iOS */
  .atp-legal { padding-bottom: max(12px, calc(6px + env(safe-area-inset-bottom))); }
}

/* ambiance animee en fond, jamais derriere le texte (cantonnee a l'en-tete) */
.atp-aura {
  position: absolute; top: -60px; left: -40px;
  width: 280px; height: 220px;
  background: conic-gradient(from 0deg, rgba(201,168,76,0.16), transparent 40%, rgba(232,201,122,0.12), transparent 75%);
  filter: blur(26px);
  opacity: 0.7;
  pointer-events: none;
  animation: atp-spin 22s linear infinite;
}

/* ---- Champ d'etoiles dorees (cosmos leger, en fond) ---- */
.atp-stars {
  position: absolute; inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}
.atp-star {
  position: absolute;
  width: 2px; height: 2px;
  border-radius: 50%;
  background: var(--atp-gold-light);
  opacity: 0.4;
  animation: atp-twinkle linear infinite;
  will-change: opacity, transform;
}

/* contenu du panneau au-dessus de l'ambiance cosmos */
.atp-header,
.atp-messages,
.atp-actions,
.atp-input-bar,
.atp-legal { position: relative; z-index: 1; }

/* ---- Ambiance cosmos (canvas etoiles/filantes + nebuleuse) ---- */
.atp-cosmos {
  position: absolute; inset: 0; z-index: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  border-radius: inherit;
}
.atp-nebula {
  position: absolute; inset: 0; z-index: 0;
  pointer-events: none; overflow: hidden;
  border-radius: inherit;
}
.atp-nebula-blob {
  position: absolute; border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}
.atp-nebula-blob--gold {
  width: 340px; height: 280px; top: -60px; left: -70px;
  background: radial-gradient(circle at 50% 50%, rgba(201,168,76,0.13), transparent 66%);
  animation: atp-neb-a 26s ease-in-out infinite;
}
.atp-nebula-blob--violet {
  width: 320px; height: 320px; bottom: -80px; right: -60px;
  background: radial-gradient(circle at 50% 50%, rgba(120,110,196,0.10), transparent 68%);
  animation: atp-neb-b 33s ease-in-out infinite;
}
.atp-nebula-blob--deep {
  width: 260px; height: 220px; top: 38%; left: 30%;
  background: radial-gradient(circle at 50% 50%, rgba(70,96,150,0.07), transparent 70%);
  animation: atp-neb-a 40s ease-in-out infinite reverse;
}

/* ---- En-tete ---- */
.atp-header {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid var(--atp-line);
}
.atp-header-avatar {
  position: relative; flex-shrink: 0;
  width: 44px; height: 44px; border-radius: 50%;
  display: grid; place-items: center;
  background: radial-gradient(120% 120% at 30% 25%, #221a0f 0%, #0c0907 75%);
  border: 1px solid var(--atp-line-strong);
}
.atp-header-id { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.atp-header-name { font-size: 16px; font-weight: 600; color: var(--atp-cream); line-height: 1.1; }
.atp-header-status { font-size: 11.5px; color: var(--atp-muted); display: flex; align-items: center; gap: 6px; letter-spacing: 0.02em; }
.atp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #6fcf97; box-shadow: 0 0 8px rgba(111,207,151,0.8); }
.atp-header-actions { margin-left: auto; display: flex; gap: 6px; }
.atp-icon-btn {
  width: 32px; height: 32px; border-radius: 9px;
  border: 1px solid var(--atp-line);
  background: rgba(255,255,255,0.02);
  color: var(--atp-muted);
  cursor: pointer; display: grid; place-items: center;
  transition: color 0.2s, border-color 0.2s, transform 0.2s var(--atp-ease);
}
.atp-icon-btn:hover { color: var(--atp-cream); border-color: var(--atp-line-strong); transform: translateY(-1px); }
.atp-icon-btn:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }

/* ---- Fil des messages ---- */
.atp-messages {
  flex: 1; min-height: 0;
  overflow-y: auto; overscroll-behavior: contain;
  padding: 18px 16px 8px;
  display: flex; flex-direction: column; gap: 14px;
  scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.3) transparent;
}
.atp-messages::-webkit-scrollbar { width: 7px; }
.atp-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.28); border-radius: 4px; }

.atp-row { display: flex; max-width: 100%; animation: atp-bubble-in 0.42s var(--atp-ease) both; }
.atp-row--user { justify-content: flex-end; }
.atp-row--bot { justify-content: flex-start; }

.atp-bubble {
  max-width: 84%;
  padding: 11px 14px;
  font-size: 14px; line-height: 1.55;
  border-radius: 16px;
  white-space: pre-wrap; word-wrap: break-word;
}
.atp-bubble--bot {
  background: rgba(20,15,10,0.88); /* quasi opaque : texte parfaitement net sur le cosmos */
  border: 1px solid var(--atp-line);
  border-bottom-left-radius: 5px;
  color: var(--atp-cream);
}
.atp-bubble--user {
  background: linear-gradient(135deg, var(--atp-gold) 0%, var(--atp-gold-deep) 100%);
  color: #1a1206;
  border-bottom-right-radius: 5px;
  font-weight: 500;
}

/* indicateur de saisie */
.atp-typing { display: inline-flex; gap: 5px; align-items: center; padding: 13px 16px; }
.atp-typing span {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--atp-gold);
  animation: atp-typing 1.3s var(--atp-ease) infinite;
}
.atp-typing span:nth-child(2) { animation-delay: 0.18s; }
.atp-typing span:nth-child(3) { animation-delay: 0.36s; }

/* ---- Zone d'actions (puces + flux) ---- */
.atp-actions { padding: 4px 16px 6px; display: flex; flex-wrap: wrap; gap: 8px; }
.atp-chip {
  position: relative;
  overflow: hidden;
  font-family: inherit;
  font-size: 12.5px; font-weight: 500;
  padding: 8px 13px;
  border-radius: 999px;
  border: 1px solid var(--atp-line-strong);
  background: rgba(201,168,76,0.06);
  color: var(--atp-gold-light);
  cursor: pointer;
  transition: transform 0.22s var(--atp-ease), background 0.22s, border-color 0.22s;
  animation: atp-chip-in 0.5s var(--atp-ease) both;
}
/* eclat qui balaie la puce au survol (transform uniquement) */
.atp-chip::after {
  content: '';
  position: absolute; top: 0; left: 0; width: 55%; height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255,245,220,0.18), transparent);
  transform: translateX(-180%) skewX(-18deg);
  pointer-events: none;
}
.atp-chip:hover::after { animation: atp-sheen 0.8s var(--atp-ease); }
.atp-chip:hover { transform: translateY(-2px); background: rgba(201,168,76,0.14); border-color: var(--atp-gold); }
.atp-chip:active { transform: translateY(0) scale(0.97); }
.atp-chip:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }
.atp-chip--primary { background: linear-gradient(135deg, var(--atp-gold), var(--atp-gold-deep)); color: #1a1206; border-color: transparent; font-weight: 600; }
.atp-chip--primary:hover { background: linear-gradient(135deg, var(--atp-gold-light), var(--atp-gold)); }

/* CTA pleine largeur (accompagnement mobile : mene directement a la cible) */
.atp-cta {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: inherit; font-size: 14px; font-weight: 600;
  padding: 13px 16px;
  border-radius: 13px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--atp-gold), var(--atp-gold-deep));
  color: #1a1206;
  cursor: pointer;
  transition: transform 0.22s var(--atp-ease), background 0.22s;
  animation: atp-chip-in 0.5s var(--atp-ease) both;
}
.atp-cta:hover { transform: translateY(-2px); background: linear-gradient(135deg, var(--atp-gold-light), var(--atp-gold)); }
.atp-cta:active { transform: translateY(0) scale(0.98); }
.atp-cta:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }

/* carte de flux (choix du parcours guide) */
.atp-flow {
  width: 100%;
  display: flex; align-items: center; gap: 12px;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid var(--atp-line);
  background: rgba(255,255,255,0.025);
  color: var(--atp-cream);
  cursor: pointer; text-align: left;
  font-family: inherit;
  transition: transform 0.24s var(--atp-ease), border-color 0.24s, background 0.24s;
  animation: atp-chip-in 0.5s var(--atp-ease) both;
}
.atp-flow:hover { transform: translateX(3px); border-color: var(--atp-line-strong); background: rgba(201,168,76,0.06); }
.atp-flow:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }
.atp-flow-icon { flex-shrink: 0; width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; background: rgba(201,168,76,0.1); color: var(--atp-gold-light); }
.atp-flow-text { display: flex; flex-direction: column; gap: 2px; }
.atp-flow-title { font-size: 14px; font-weight: 600; }
.atp-flow-sub { font-size: 12px; color: var(--atp-muted); }

/* ---- Saisie ---- */
.atp-input-bar {
  display: flex; align-items: flex-end; gap: 8px;
  padding: 12px 14px 14px;
  border-top: 1px solid var(--atp-line);
}
.atp-input {
  flex: 1;
  font-family: inherit; font-size: 14px;
  color: var(--atp-cream);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--atp-line);
  border-radius: 13px;
  padding: 11px 13px;
  resize: none; max-height: 96px;
  line-height: 1.4;
  transition: border-color 0.2s;
}
.atp-input::placeholder { color: var(--atp-muted); }
.atp-input:focus { outline: none; border-color: var(--atp-line-strong); }
.atp-input:disabled { opacity: 0.55; cursor: not-allowed; } /* conversation cloturee */
.atp-send {
  position: relative;
  flex-shrink: 0;
  width: 42px; height: 42px; border-radius: 12px;
  border: none; cursor: pointer;
  background: linear-gradient(135deg, var(--atp-gold), var(--atp-gold-deep));
  color: #1a1206;
  display: grid; place-items: center;
  transition: transform 0.22s var(--atp-ease), opacity 0.2s, box-shadow 0.22s;
}
/* eclat one-shot au moment de l'envoi */
.atp-send--spark::after {
  content: '';
  position: absolute; inset: -4px; border-radius: inherit;
  background: radial-gradient(circle, rgba(255,245,220,0.85), transparent 60%);
  pointer-events: none;
  animation: atp-spark 0.6s var(--atp-ease) both;
}
.atp-send:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201,168,76,0.3); }
.atp-send:active:not(:disabled) { transform: translateY(0) scale(0.95); }
.atp-send:disabled { opacity: 0.45; cursor: not-allowed; }
.atp-send:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }

.atp-legal { padding: 0 16px 12px; font-size: 10.5px; color: var(--atp-muted); text-align: center; line-height: 1.4; }
.atp-legal a { color: var(--atp-gold-light); text-decoration: none; }

/* ====================== TOUR GUIDE ====================== */
.atp-tour-veil {
  position: fixed; inset: 0;
  z-index: 2147482000;
  pointer-events: auto;
  animation: atp-fade-in 0.3s var(--atp-ease) both;
}
.atp-tour-spot {
  position: fixed;
  border-radius: 14px;
  box-shadow: 0 0 0 9999px rgba(8,7,6,0.74), 0 0 0 2px var(--atp-gold-light), 0 0 26px rgba(201,168,76,0.5);
  transition: top 0.45s var(--atp-ease), left 0.45s var(--atp-ease), width 0.45s var(--atp-ease), height 0.45s var(--atp-ease);
  pointer-events: none;
}
.atp-tour-veil--nospot { background: rgba(8,7,6,0.74); }
/* mode encadre (grand formulaire/iframe) : tres peu d'assombrissement, c'est
   l'encadre dore qui signale la zone. */
.atp-tour-veil--frame { background: rgba(8,7,6,0.28); }
/* encadre dore lumineux : bordure + halo, AUCUN trou sombre. Pas de transition
   de position -> il colle a la cible au scroll (recalcul par requestAnimationFrame),
   sans deriver. */
.atp-tour-frame {
  position: fixed;
  top: 0; left: 0; /* position reelle portee par transform: translate(...) */
  z-index: 2147482100;
  border-radius: 16px;
  box-shadow:
    0 0 0 2px var(--atp-gold-light),
    0 0 24px 5px rgba(201,168,76,0.5),
    0 0 72px 16px rgba(201,168,76,0.22);
  pointer-events: none;
  will-change: transform;
  animation: atp-fade-in 0.3s var(--atp-ease) both;
}
.atp-tour-pointer {
  position: fixed; z-index: 2147482600;
  color: var(--atp-gold-light);
  animation: atp-point 1.4s var(--atp-ease) infinite;
  pointer-events: none;
}
.atp-tooltip {
  position: fixed; z-index: 2147482700;
  width: min(330px, calc(100vw - 32px));
  max-width: calc(100vw - 24px);
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--atp-panel-2), var(--atp-panel));
  border: 1px solid var(--atp-line-strong);
  border-radius: 18px;
  padding: 18px;
  overflow: hidden; /* clippe les etoiles aux coins arrondis */
  isolation: isolate;
  box-shadow: var(--atp-shadow);
  animation: atp-bubble-in 0.4s var(--atp-ease) both;
}
/* sur mobile, la tooltip devient une carte ancree en bas, pleine largeur */
.atp-tooltip--sheet {
  left: 12px; right: 12px; width: auto;
  top: auto; bottom: 16px;
}
.atp-tooltip-step,
.atp-tooltip-title,
.atp-tooltip-text,
.atp-tooltip-foot { position: relative; z-index: 1; }
.atp-tooltip-step { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--atp-gold); margin-bottom: 8px; }
.atp-tooltip-title { font-size: 17px; font-weight: 600; color: var(--atp-cream); margin: 0 0 8px; }
.atp-tooltip-text { font-size: 13.5px; line-height: 1.6; color: #c8c0b4; margin: 0 0 16px; }
.atp-tooltip-foot { display: flex; align-items: center; gap: 10px; }
.atp-progress { display: flex; gap: 6px; margin-right: auto; }
.atp-progress-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(201,168,76,0.25); transition: transform 0.3s var(--atp-ease), background 0.3s; }
.atp-progress-dot--on { background: var(--atp-gold-light); transform: scale(1.25); }
.atp-tour-btn {
  font-family: inherit; font-size: 13px; font-weight: 600;
  padding: 9px 15px; border-radius: 10px; cursor: pointer;
  transition: transform 0.2s var(--atp-ease), background 0.2s, border-color 0.2s;
}
.atp-tour-btn--ghost { background: transparent; border: 1px solid var(--atp-line); color: var(--atp-muted); }
.atp-tour-btn--ghost:hover { color: var(--atp-cream); border-color: var(--atp-line-strong); }
.atp-tour-btn--solid { background: linear-gradient(135deg, var(--atp-gold), var(--atp-gold-deep)); border: none; color: #1a1206; }
.atp-tour-btn--solid:hover { transform: translateY(-2px); }
.atp-tour-btn:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 2px; }
.atp-tour-close {
  position: fixed; top: 18px; right: 18px; z-index: 2147482700;
  width: 38px; height: 38px; border-radius: 11px;
  background: rgba(14,11,8,0.9); border: 1px solid var(--atp-line-strong);
  color: var(--atp-cream); cursor: pointer; display: grid; place-items: center;
  transition: transform 0.2s var(--atp-ease);
}
.atp-tour-close:hover { transform: rotate(90deg); }

/* ====================== KEYFRAMES ====================== */
/* respiration du lisere dore du launcher : opacite seule, rien ne s'etend */
@keyframes atp-ring-breathe { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
@keyframes atp-orbit { to { transform: rotate(360deg); } }
@keyframes atp-spin { to { transform: rotate(360deg); } }
@keyframes atp-panel-in { from { opacity: 0; transform: translateY(14px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes atp-panel-out { to { opacity: 0; transform: translateY(14px) scale(0.92); } }
/* mobile : ouverture/fermeture sans scale (pas de re-raster de l'ombre plein ecran) */
@keyframes atp-panel-in-lite { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes atp-panel-out-lite { to { opacity: 0; transform: translateY(18px); } }
@keyframes atp-bubble-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes atp-chip-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes atp-typing { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } }
@keyframes atp-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes atp-point { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
@keyframes atp-twinkle { 0%,100% { opacity: 0.12; transform: scale(0.7); } 50% { opacity: 0.7; transform: scale(1.05); } }
@keyframes atp-neb-a { 0%,100% { transform: translate3d(0,0,0) scale(1); opacity: 0.45; } 50% { transform: translate3d(16px,12px,0) scale(1.09); opacity: 0.72; } }
@keyframes atp-neb-b { 0%,100% { transform: translate3d(0,0,0) scale(1); opacity: 0.34; } 50% { transform: translate3d(-14px,-10px,0) scale(1.12); opacity: 0.62; } }
@keyframes atp-sheen { from { transform: translateX(-180%) skewX(-18deg); } to { transform: translateX(320%) skewX(-18deg); } }
@keyframes atp-spark { from { opacity: 0.9; transform: scale(0.6); } to { opacity: 0; transform: scale(1.8); } }
@keyframes atp-core-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }

/* ====================== REDUCED MOTION (variante calme) ====================== */
@media (prefers-reduced-motion: reduce) {
  .atp-root .atp-launcher::before,
  .atp-root .atp-sigil-orbit,
  .atp-root .atp-sigil-core,
  .atp-root .atp-aura,
  .atp-root .atp-nebula-blob,
  .atp-root .atp-typing span,
  .atp-root .atp-star,
  .atp-root .atp-tour-pointer,
  .atp-root .atp-tour-frame { animation: none; }
  /* pulsation du lisere desactivee ; etiquette affichee/masquee sans animation */
  .atp-root .atp-launcher::before { animation: none; opacity: 0; }
  .atp-root .atp-hint { transition: none; }
  .atp-root .atp-dock { transition: none; }
  .atp-root .atp-star { opacity: 0.32; } /* version statique, sans scintillement */
  .atp-root .atp-chip:hover::after { animation: none; }
  .atp-root .atp-send--spark::after { animation: none; opacity: 0; }
  .atp-root .atp-launcher,
  .atp-root .atp-panel,
  .atp-root .atp-row,
  .atp-root .atp-chip,
  .atp-root .atp-flow,
  .atp-root .atp-tooltip { animation-duration: 0.001s; }
  .atp-root .atp-launcher:hover,
  .atp-root .atp-chip:hover,
  .atp-root .atp-flow:hover,
  .atp-root .atp-send:hover:not(:disabled),
  .atp-root .atp-tour-btn--solid:hover { transform: none; }
  .atp-root .atp-tour-spot { transition: none; }
}
`})),d,f=t((()=>{d={temporaire:{label:`Assurance temporaire`,sub:`Devis et souscription en ligne`,icon:`shield`,mobile:{message:`Renseignez votre véhicule, la durée (1 à 90 jours) et vos informations dans le formulaire ; l'attestation arrive en quelques minutes, sans relevé d'information. Je vous y emmène.`,ctaLabel:`Aller au formulaire`,path:`/tarification`,scrollTarget:`[data-assistant-target="tarif-iframe"]`},steps:[{target:`[data-assistant-target="devis"]`,title:`Tout commence ici`,text:`Pour lancer votre assurance temporaire, cliquez sur « Obtenir mon devis ». Ce bouton est disponible sur chaque page. Je vous emmène au formulaire.`,placement:`bottom`},{path:`/tarification`,target:`[data-assistant-target="tarif-iframe"]`,title:`Votre formulaire sécurisé`,text:`Voici votre formulaire. Renseignez-y le véhicule, la durée (de 1 à 90 jours) et vos informations. L'attestation arrive en quelques minutes, sans relevé d'information.`,placement:`top`,frame:!0}]},"carte-grise":{label:`Carte grise`,sub:`Immatriculation en ligne`,icon:`file`,mobile:{message:`Votre demande passe par notre partenaire Certimat. Renseignez votre véhicule dans le module sécurisé pour obtenir votre carte grise. Je vous y emmène.`,ctaLabel:`Accéder à la carte grise`,path:`/carte-grise`,scrollTarget:`[data-assistant-target="carte-grise-iframe"]`},steps:[{path:`/carte-grise`,target:`[data-assistant-target="carte-grise-iframe"]`,title:`Votre demande de carte grise`,text:`Voici le module sécurisé, propulsé par notre partenaire Certimat. Renseignez-y votre véhicule pour obtenir votre carte grise.`,placement:`top`,frame:!0}]}}}));function re(e){return String(e||``).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,` `).replace(/\s+/g,` `).trim()}function p(e){let t=String(e||``);return t=t.replace(/^\s{0,3}#{1,6}\s+/gm,``),t=t.replace(/^\s{0,3}[-*+]\s+/gm,``),t=t.replace(/\*\*([^*]+)\*\*/g,`$1`),t=t.replace(/__([^_]+)__/g,`$1`),t=t.replace(/\*([^*]+)\*/g,`$1`),t=t.replace(/_([^_]+)_/g,`$1`),t=t.replace(/`+/g,``),t=t.replace(/\*+/g,``),t=t.replace(/[ \t]{2,}/g,` `),t=t.replace(/\n{3,}/g,`

`),t.trim()}function ie(e){return/\[fin\]/i.test(String(e||``))}function ae(e){return p(String(e||``).replace(/\[fin\]/gi,``))}function m({name:e,size:t=18}){let n={width:t,height:t,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:1.8,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":!0};switch(e){case`close`:return(0,b.jsx)(`svg`,{...n,children:(0,b.jsx)(`path`,{d:`M18 6 6 18M6 6l12 12`})});case`send`:return(0,b.jsx)(`svg`,{...n,children:(0,b.jsx)(`path`,{d:`M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z`})});case`restart`:return(0,b.jsxs)(`svg`,{...n,children:[(0,b.jsx)(`path`,{d:`M3 12a9 9 0 1 0 3-6.7L3 8`}),(0,b.jsx)(`path`,{d:`M3 3v5h5`})]});case`shield`:return(0,b.jsx)(`svg`,{...n,children:(0,b.jsx)(`path`,{d:`M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z`})});case`file`:return(0,b.jsxs)(`svg`,{...n,children:[(0,b.jsx)(`path`,{d:`M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z`}),(0,b.jsx)(`path`,{d:`M14 2v6h6`})]});case`globe`:return(0,b.jsxs)(`svg`,{...n,children:[(0,b.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,b.jsx)(`path`,{d:`M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z`})]});case`chevron-down`:return(0,b.jsx)(`svg`,{...n,children:(0,b.jsx)(`path`,{d:`m6 9 6 6 6-6`})});case`bubble`:return(0,b.jsx)(`svg`,{...n,children:(0,b.jsx)(`path`,{d:`M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z`})});default:return null}}function h(e){return Array.from({length:e},()=>({top:(Math.random()*100).toFixed(2),left:(Math.random()*100).toFixed(2),size:(1.4+Math.random()*1.8).toFixed(2),delay:(Math.random()*4).toFixed(2),dur:(2.6+Math.random()*2.6).toFixed(2)}))}function oe({field:e}){return(0,b.jsx)(`div`,{className:`atp-stars`,"aria-hidden":!0,children:e.map((e,t)=>(0,b.jsx)(`span`,{className:`atp-star`,style:{top:e.top+`%`,left:e.left+`%`,width:e.size+`px`,height:e.size+`px`,animationDelay:e.delay+`s`,animationDuration:e.dur+`s`}},t))})}function se(){return(0,b.jsxs)(`span`,{className:`atp-sigil`,"aria-hidden":!0,children:[(0,b.jsx)(`span`,{className:`atp-sigil-ring`}),(0,b.jsx)(`span`,{className:`atp-sigil-orbit`,children:(0,b.jsx)(`span`,{className:`atp-sigil-particle`})}),(0,b.jsx)(`span`,{className:`atp-sigil-core`})]})}function ce(e,{large:t,reduced:n}){if(!e||typeof window>`u`)return;let r=e.getBoundingClientRect(),i=window.scrollY+r.top,a=window.innerHeight,o;o=t?C:Math.max(104,(a-r.height)/2);let s=Math.max(0,i-o);window.scrollTo({top:s,behavior:n?`auto`:`smooth`})}function le(){try{return typeof window<`u`&&!!localStorage.getItem(w)}catch{return!0}}function g(){if(typeof window>`u`)return!1;let e=window.innerWidth<=820,t=window.matchMedia&&window.matchMedia(`(pointer: coarse)`).matches;return e||t}function ue(e,t=3500){return new Promise(n=>{let r=Date.now();(function i(){let a=document.querySelector(e);if(a)return n(a);if(Date.now()-r>t)return n(null);setTimeout(i,80)})()})}function _(e){return e.map(e=>(e.role===`user`?`Visiteur`:`Tempo`)+` : `+e.content).join(`

`)}function de(e){if(typeof window>`u`)return;let t=new FormData;t.append(`access_key`,T),t.append(`subject`,`Conversation assistant Tempo (assutempo.fr)`),t.append(`from_name`,`Assistant Tempo`),t.append(`page`,window.location.pathname||`/`),t.append(`date`,new Date().toLocaleString(`fr-FR`)),t.append(`message`,_(e));try{navigator.sendBeacon?navigator.sendBeacon(E,t):fetch(E,{method:`POST`,body:t,keepalive:!0}).catch(()=>{})}catch{}}function v(){let[e,t]=(0,y.useState)(!1),[n,r]=(0,y.useState)(!1),[o,c]=(0,y.useState)(!1),[ee,l]=(0,y.useState)(!1),[u,f]=(0,y.useState)([{role:`assistant`,content:me}]),[p,h]=(0,y.useState)(``),[_,v]=(0,y.useState)(!1),[w,T]=(0,y.useState)(!1),[E,xe]=(0,y.useState)(!1),[Se,Ce]=(0,y.useState)(!1),[D,we]=(0,y.useState)(!1),[O,k]=(0,y.useState)(null),[Te,A]=(0,y.useState)(()=>!le()),[j,M]=(0,y.useState)(!1),[Ee,De]=(0,y.useState)(!1),[Oe,ke]=(0,y.useState)(!1),[N,P]=(0,y.useState)({active:!1,flowKey:null,step:0}),[F,I]=(0,y.useState)(null),L=s(),Ae=i(),R=(0,y.useRef)(!1),z=(0,y.useRef)(null),B=(0,y.useRef)(null),V=(0,y.useRef)(null),je=(0,y.useRef)(null),Me=(0,y.useRef)(null),Ne=(0,y.useRef)(!1),H=(0,y.useRef)(null);H.current===null&&(H.current=new Set);let Pe=(0,y.useRef)(!1),U=(0,y.useRef)(0),Fe=(0,y.useRef)(0),[W,Ie]=(0,y.useState)(null),Le=typeof window<`u`&&/[?&]perfdebug/.test(window.location.search),Re=(0,y.useRef)(u),ze=(0,y.useRef)(0);(0,y.useEffect)(()=>{Re.current=u},[u]);let G=(0,y.useCallback)(()=>{let e=Re.current||[],t=e.filter(e=>e.role===`user`).length;t===0||t<=ze.current||(de(e),ze.current=t)},[]);(0,y.useEffect)(()=>{let e=()=>G(),t=()=>{document.visibilityState===`hidden`&&G()};return window.addEventListener(`pagehide`,e),document.addEventListener(`visibilitychange`,t),()=>{window.removeEventListener(`pagehide`,e),document.removeEventListener(`visibilitychange`,t)}},[G]),(0,y.useEffect)(()=>{if(t(!0),typeof document<`u`&&!document.getElementById(x)){let e=document.createElement(`style`);e.id=x,e.textContent=ne,document.head.appendChild(e)}typeof window<`u`&&window.matchMedia&&(R.current=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)},[]),(0,y.useEffect)(()=>{if(g())return;let e,t=()=>{a(()=>import(`./CosmosCanvas-CMbUEmbF.js`),__vite__mapDeps([0,1,2]))};return typeof window<`u`&&window.requestIdleCallback?(e=window.requestIdleCallback(t),()=>window.cancelIdleCallback&&window.cancelIdleCallback(e)):(e=setTimeout(t,1200),()=>clearTimeout(e))},[]),(0,y.useLayoutEffect)(()=>{o&&U.current&&(Fe.current=performance.now())},[o]),(0,y.useEffect)(()=>{if(!o||!U.current)return;let e=U.current,t=Fe.current||e,n=0,r=requestAnimationFrame(()=>{n=requestAnimationFrame(()=>{let n=performance.now();Ie({render:Math.round(t-e),paint:Math.round(n-t),total:Math.round(n-e)}),U.current=0})});return()=>{cancelAnimationFrame(r),n&&cancelAnimationFrame(n)}},[o]),(0,y.useEffect)(()=>{let e=()=>{l(!1),c(!0)};return typeof window<`u`&&window.__assutempoOpenPending&&(delete window.__assutempoOpenPending,e()),window.addEventListener(`assutempo:open-assistant`,e),()=>window.removeEventListener(`assutempo:open-assistant`,e)},[]),(0,y.useEffect)(()=>{A(!le());let e=()=>A(!1),t=()=>A(!0);return window.addEventListener(`cookie-consent`,e),window.addEventListener(`open-cookie-settings`,t),()=>{window.removeEventListener(`cookie-consent`,e),window.removeEventListener(`open-cookie-settings`,t)}},[]);let K=!o&&!N.active&&!Te;(0,y.useEffect)(()=>{if(!K){M(!1);return}let e=!1,t=0,n=0,r=0,i=()=>{clearTimeout(r),r=setTimeout(o,3e4)},a=()=>{e=!1,M(!1),i()};function o(){e=!0,M(!0),clearTimeout(n),n=setTimeout(a,5e3)}let s=()=>{e||i()};Ne.current?(M(!1),i()):t=setTimeout(()=>{Ne.current=!0,o()},1500);let c=[`pointerdown`,`keydown`,`wheel`,`touchstart`];return c.forEach(e=>window.addEventListener(e,s,{passive:!0})),window.addEventListener(`scroll`,s,{passive:!0}),()=>{clearTimeout(t),clearTimeout(n),clearTimeout(r),c.forEach(e=>window.removeEventListener(e,s)),window.removeEventListener(`scroll`,s)}},[K,Ae.pathname]),(0,y.useEffect)(()=>{let e=e=>ke(!!(e.detail&&e.detail.dragging));return window.addEventListener(`assutempo:instrument-drag`,e),()=>window.removeEventListener(`assutempo:instrument-drag`,e)},[]),(0,y.useEffect)(()=>{if(!K){De(!1);return}let e=0,t=(e,t)=>e<0||t<0||e>window.innerWidth||t>window.innerHeight?!1:document.elementsFromPoint(e,t).some(e=>e.closest&&e.closest(`.btn-gold, .btn-glass`)),n=()=>{let e=je.current;if(!e)return;let n=e.getBoundingClientRect(),r=[[n.left+n.width/2,n.top+n.height/2],[n.left+6,n.top+6],[n.right-6,n.top+6],[n.left+6,n.bottom-6],[n.right-6,n.bottom-6]],i=Me.current;if(i&&j){let e=i.getBoundingClientRect();r.push([e.left+4,e.top+e.height/2],[e.left+e.width/2,e.top+e.height/2])}De(r.some(([e,n])=>t(e,n)))},r=0,i=0,a=()=>{e=0,r=performance.now(),n()},o=()=>{let t=200-(performance.now()-r);t<=0?e||=requestAnimationFrame(a):i||=setTimeout(()=>{i=0,o()},t)};return window.addEventListener(`scroll`,o,{passive:!0}),window.addEventListener(`resize`,o),o(),()=>{e&&cancelAnimationFrame(e),clearTimeout(i),window.removeEventListener(`scroll`,o),window.removeEventListener(`resize`,o)}},[K,j]),(0,y.useEffect)(()=>{let e=()=>r(g());e();let t=typeof window<`u`&&window.matchMedia?window.matchMedia(`(pointer: coarse)`):null;return window.addEventListener(`resize`,e,{passive:!0}),t&&t.addEventListener&&t.addEventListener(`change`,e),()=>{window.removeEventListener(`resize`,e),t&&t.removeEventListener&&t.removeEventListener(`change`,e)}},[]),(0,y.useEffect)(()=>{z.current&&(z.current.scrollTop=z.current.scrollHeight)},[u,_,w]),(0,y.useEffect)(()=>{if(o&&!N.active&&!n&&B.current){let e=setTimeout(()=>B.current&&B.current.focus(),250);return()=>clearTimeout(e)}},[o,N.active,n]),(0,y.useEffect)(()=>{if(!o&&!N.active)return;let e=e=>{e.key===`Escape`&&(N.active?Z(!1):X())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[o,N.active]);let q=(0,y.useCallback)(()=>{Pe.current||(Pe.current=!0,we(!0),f(e=>[...e,{role:`assistant`,content:ve}]))},[]),J=(0,y.useCallback)(async e=>{let t=(e||``).trim();if(!t||_||D)return;let n=u.filter(e=>e.role===`user`).length;if(n>=S){q();return}let r=re(t);if(r&&H.current.has(r)){f(e=>[...e,{role:`user`,content:t},{role:`assistant`,content:_e}]),h(``),T(!1),k(null);return}r&&H.current.add(r);let i=[...u,{role:`user`,content:t}];f(i),h(``),T(!1),k(null),v(!0),Ce(!0),setTimeout(()=>Ce(!1),600);try{let e=i.filter(e=>e.role===`user`||e.role===`assistant`).map(e=>({role:e.role,content:e.content})),t=await fetch(`/api/chat`,{method:`POST`,headers:{"content-type":`application/json`},body:JSON.stringify({messages:e})});if(!t.ok)throw Error(`http`);let r=await t.json(),a=r&&typeof r.text==`string`?r.text.trim():``;if(!a)throw Error(`empty`);let o=ie(a);f(e=>[...e,{role:`assistant`,content:ae(a)}]),(o||n+1>=S)&&q()}catch{f(e=>[...e,{role:`assistant`,content:he}])}finally{v(!1),xe(!0)}},[u,_,D,q]);function Y(){o||(U.current||=performance.now(),l(!1),c(!0))}function X(e=!0){e&&G(),l(!0),setTimeout(()=>{c(!1),l(!1)},R.current?0:280)}function Be(e){h(e.target.value);let t=e.target;t.style.height=`auto`,t.style.height=Math.min(t.scrollHeight,96)+`px`}function Ve(e){e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),J(p),B.current&&(B.current.style.height=`auto`))}let He=(0,y.useCallback)(e=>{if(!e)return;let t=e.getBoundingClientRect();I({top:t.top-8,left:t.left-8,width:t.width+16,height:t.height+16})},[]);function Ue(e){let t=d[e];!t||!t.mobile||(T(!1),f(e=>[...e,{role:`assistant`,content:t.mobile.message}]),k({ctaLabel:t.mobile.ctaLabel,path:t.mobile.path,scrollTarget:t.mobile.scrollTarget}))}function We(e){if(T(!1),g()){Ue(e);return}d[e]&&(X(!1),V.current=null,I(null),P({active:!0,flowKey:e,step:0}))}function Ge(e){k(null),X(!1);let t=R.current?`auto`:`smooth`,n=e=>{e&&ue(e,3500).then(e=>{e&&e.scrollIntoView({behavior:t,block:`start`})})};e.path&&window.location.pathname!==e.path?(L(e.path),setTimeout(()=>n(e.scrollTarget),R.current?60:360)):n(e.scrollTarget)}function Z(e){P({active:!1,flowKey:null,step:0}),I(null),V.current=null,Y(),e&&f(e=>[...e,{role:`assistant`,content:`Et voilà, vous êtes au bon endroit. Je reste disponible si vous avez la moindre question pendant votre démarche.`}])}function Ke(){let e=d[N.flowKey];if(!e)return Z(!1);if(N.step>=e.steps.length-1)return Z(!0);V.current=null,I(null),P(e=>({...e,step:e.step+1}))}function qe(){N.step<=0||(V.current=null,I(null),P(e=>({...e,step:e.step-1})))}if((0,y.useEffect)(()=>{if(!N.active||g())return;let e=d[N.flowKey],t=e&&e.steps[N.step];if(!t)return;let n=!1;return(async()=>{if(t.path&&window.location.pathname!==t.path&&(L(t.path),await be(R.current?60:360)),n)return;if(!t.target){V.current=null,I(null);return}let e=await ue(t.target,3500);if(n)return;if(!e){V.current=null,I(null);return}if(n)return;V.current=e,He(e);let r=()=>ce(e,{large:!!t.frame,reduced:R.current});r(),t.frame&&[120,360,760,1300].forEach(t=>setTimeout(()=>{if(n||V.current!==e)return;let t=e.getBoundingClientRect().top;Math.abs(t-C)>24&&r()},t))})(),()=>{n=!0}},[N.active,N.flowKey,N.step,L,He]),(0,y.useEffect)(()=>{if(!N.active||g())return;let e=0,t=null,n=()=>{let r=V.current;if(r){let e=r.getBoundingClientRect(),n={top:e.top-8,left:e.left-8,width:e.width+16,height:e.height+16};(!t||Math.abs(n.top-t.top)>.5||Math.abs(n.left-t.left)>.5||Math.abs(n.width-t.width)>.5||Math.abs(n.height-t.height)>.5)&&(t=n,I(n))}e=requestAnimationFrame(n)};return e=requestAnimationFrame(n),()=>cancelAnimationFrame(e)},[N.active,N.step]),!e)return null;let Q=N.active?d[N.flowKey]:null,$=Q?Q.steps[N.step]:null;function Je(){if(n||g()||!N.active||!$)return null;let e=window.innerWidth,t=window.innerHeight,r=!!$.frame,i;if(r&&F){let n=Math.min(Math.max(F.top,16),t-240);i=e-(F.left+F.width)>=F.left?{right:16,top:n}:{left:16,top:n}}else if(!F)i={top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`};else{let n=$.placement===`top`||$.placement!==`bottom`&&F.top>t*.55,r=Math.min(Math.max(F.left,16),e-Math.min(330,e-32)-16);i=n?{bottom:t-F.top+16,left:r}:{top:F.top+F.height+16,left:r}}return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(`div`,{className:`atp-tour-veil`+(r?` atp-tour-veil--frame`:F?``:` atp-tour-veil--nospot`)}),F&&!r&&(0,b.jsx)(`div`,{className:`atp-tour-spot`,style:{top:F.top,left:F.left,width:F.width,height:F.height}}),F&&r&&(0,b.jsx)(`div`,{className:`atp-tour-frame`,style:{transform:`translate(${F.left}px, ${F.top}px)`,width:F.width,height:F.height}}),F&&!r&&(0,b.jsx)(`div`,{className:`atp-tour-pointer`,style:{top:Math.max(F.top-30,6),left:F.left+F.width/2-11},children:(0,b.jsx)(m,{name:`chevron-down`,size:22})}),(0,b.jsx)(`button`,{type:`button`,className:`atp-tour-close`,"aria-label":`Quitter le guide`,onClick:()=>Z(!1),children:(0,b.jsx)(m,{name:`close`,size:18})}),(0,b.jsxs)(`div`,{className:`atp-tooltip`,style:i||void 0,role:`dialog`,"aria-label":`Étape du guide`,children:[(0,b.jsx)(oe,{field:ye}),(0,b.jsxs)(`div`,{className:`atp-tooltip-step`,children:[Q.label,` · Étape `,N.step+1,` / `,Q.steps.length]}),(0,b.jsx)(`h3`,{className:`atp-tooltip-title atp-serif`,children:$.title}),(0,b.jsx)(`p`,{className:`atp-tooltip-text`,children:$.text}),(0,b.jsxs)(`div`,{className:`atp-tooltip-foot`,children:[(0,b.jsx)(`div`,{className:`atp-progress`,"aria-hidden":!0,children:Q.steps.map((e,t)=>(0,b.jsx)(`span`,{className:`atp-progress-dot`+(t<=N.step?` atp-progress-dot--on`:``)},t))}),N.step>0&&(0,b.jsx)(`button`,{type:`button`,className:`atp-tour-btn atp-tour-btn--ghost`,onClick:qe,children:`Précédent`}),(0,b.jsx)(`button`,{type:`button`,className:`atp-tour-btn atp-tour-btn--solid`,onClick:Ke,children:N.step>=Q.steps.length-1?`Terminer`:`Suivant`})]})]})]})}function Ye(){te(`cta_devis_click`,{cta_label:`Obtenir mon devis`,page_path:window.location.pathname}),window.location.pathname!==`/tarification`&&L(`/tarification`),X()}function Xe(){if(D)return(0,b.jsx)(`div`,{className:`atp-actions`,style:{flexDirection:`column`},children:(0,b.jsx)(`button`,{type:`button`,className:`atp-cta`,onClick:Ye,children:`Obtenir mon devis`})});if(O)return(0,b.jsx)(`div`,{className:`atp-actions`,style:{flexDirection:`column`},children:(0,b.jsx)(`button`,{type:`button`,className:`atp-cta`,onClick:()=>Ge(O),children:O.ctaLabel})});if(w){let e=n?Ue:We;return(0,b.jsx)(`div`,{className:`atp-actions`,style:{flexDirection:`column`},children:Object.entries(d).map(([t,n])=>(0,b.jsxs)(`button`,{type:`button`,className:`atp-flow`,onClick:()=>e(t),children:[(0,b.jsx)(`span`,{className:`atp-flow-icon`,children:(0,b.jsx)(m,{name:n.icon,size:20})}),(0,b.jsxs)(`span`,{className:`atp-flow-text`,children:[(0,b.jsx)(`span`,{className:`atp-flow-title`,children:n.label}),(0,b.jsx)(`span`,{className:`atp-flow-sub`,children:n.sub})]})]},t))})}if(_)return null;let e=u.length<=2;return(0,b.jsxs)(`div`,{className:`atp-actions`,children:[(0,b.jsx)(`button`,{type:`button`,className:`atp-chip atp-chip--primary`,onClick:()=>T(!0),children:`M'aider à souscrire`}),E&&(0,b.jsx)(`button`,{type:`button`,className:`atp-chip`,onClick:()=>T(!0),children:`Oui, guidez-moi`}),e&&ge.map(e=>(0,b.jsx)(`button`,{type:`button`,className:`atp-chip`,onClick:()=>J(e),children:e},e))]})}return(0,fe.createPortal)((0,b.jsxs)(`div`,{className:`atp-root`+(n?` atp-root--lite`:``),children:[K&&(0,b.jsxs)(`div`,{className:`atp-dock`+(Oe?` atp-dock--away`:Ee?` atp-dock--dim`:``),children:[(0,b.jsx)(`button`,{type:`button`,ref:Me,className:`atp-hint`,"data-show":j?``:void 0,"aria-hidden":`true`,tabIndex:-1,onPointerDown:Y,onClick:Y,children:`Besoin d'aide ?`}),(0,b.jsx)(`button`,{type:`button`,ref:je,className:`atp-launcher`,"aria-label":`Ouvrir l'assistant Assutempo`,onPointerDown:Y,onClick:Y,children:(0,b.jsx)(m,{name:`bubble`,size:24})})]}),o&&(0,b.jsxs)(`section`,{className:`atp-panel`+(ee?` atp-panel--closing`:``),role:`dialog`,"aria-label":`Assistant Assutempo`,children:[Le&&W&&(0,b.jsxs)(`div`,{"aria-hidden":!0,style:{position:`absolute`,top:6,left:8,right:8,zIndex:50,fontSize:13,fontWeight:700,lineHeight:1.4,color:W.total>1e3?`#ff6b6b`:`#6fcf97`,background:`rgba(0,0,0,0.78)`,padding:`6px 8px`,borderRadius:8,pointerEvents:`none`},children:[`TOTAL `,W.total,` ms`,(0,b.jsx)(`br`,{}),`rendu JS `,W.render,` ms`,(0,b.jsx)(`br`,{}),`paint/compo `,W.paint,` ms`]}),!n&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(`div`,{className:`atp-nebula`,"aria-hidden":!0,children:[(0,b.jsx)(`span`,{className:`atp-nebula-blob atp-nebula-blob--gold`}),(0,b.jsx)(`span`,{className:`atp-nebula-blob atp-nebula-blob--violet`}),(0,b.jsx)(`span`,{className:`atp-nebula-blob atp-nebula-blob--deep`})]}),(0,b.jsx)(y.Suspense,{fallback:null,children:(0,b.jsx)(pe,{reduced:R.current,burst:u.length})}),(0,b.jsx)(`div`,{className:`atp-aura`,"aria-hidden":!0})]}),(0,b.jsxs)(`header`,{className:`atp-header`,children:[(0,b.jsx)(`span`,{className:`atp-header-avatar`,children:(0,b.jsx)(se,{})}),(0,b.jsxs)(`span`,{className:`atp-header-id`,children:[(0,b.jsx)(`span`,{className:`atp-header-name atp-serif`,children:`Tempo`}),(0,b.jsxs)(`span`,{className:`atp-header-status`,children:[(0,b.jsx)(`span`,{className:`atp-status-dot`}),` Concierge Assutempo`]})]}),(0,b.jsx)(`span`,{className:`atp-header-actions`,children:(0,b.jsx)(`button`,{type:`button`,className:`atp-icon-btn`,"aria-label":n?`Fermer l'assistant`:`Réduire l'assistant`,onClick:X,children:(0,b.jsx)(m,{name:n?`close`:`chevron-down`,size:18})})})]}),(0,b.jsxs)(`div`,{className:`atp-messages`,ref:z,"aria-live":`polite`,children:[u.map((e,t)=>(0,b.jsx)(`div`,{className:`atp-row `+(e.role===`user`?`atp-row--user`:`atp-row--bot`),children:(0,b.jsx)(`div`,{className:`atp-bubble `+(e.role===`user`?`atp-bubble--user`:`atp-bubble--bot`),children:e.content})},t)),_&&(0,b.jsx)(`div`,{className:`atp-row atp-row--bot`,children:(0,b.jsxs)(`div`,{className:`atp-bubble atp-bubble--bot atp-typing`,"aria-label":`Tempo écrit`,children:[(0,b.jsx)(`span`,{}),(0,b.jsx)(`span`,{}),(0,b.jsx)(`span`,{})]})})]}),Xe(),(0,b.jsxs)(`div`,{className:`atp-input-bar`,children:[(0,b.jsx)(`textarea`,{ref:B,className:`atp-input`,rows:1,placeholder:D?`Conversation terminée`:`Posez votre question...`,value:p,onChange:Be,onKeyDown:Ve,disabled:D,"aria-label":`Votre message`}),(0,b.jsx)(`button`,{type:`button`,className:`atp-send`+(Se?` atp-send--spark`:``),"aria-label":`Envoyer`,disabled:!p.trim()||_||D,onClick:()=>{J(p),B.current&&(B.current.style.height=`auto`)},children:(0,b.jsx)(m,{name:`send`,size:18})})]}),(0,b.jsx)(`p`,{className:`atp-legal`,children:`Assistant indicatif, ne constitue pas un conseil contractuel.`})]}),Je()]}),document.body)}var y,fe,b,pe,x,me,he,ge,S,_e,ve,ye,be,C,w,T,E;t((()=>{y=e(r()),fe=e(o()),ee(),u(),f(),l(),b=n(),c(),pe=(0,y.lazy)(()=>a(()=>import(`./CosmosCanvas-CMbUEmbF.js`),__vite__mapDeps([0,1,2]))),x=`atp-styles`,me=`Bonjour, je suis Tempo, votre concierge Assutempo. Je réponds à vos questions sur l'assurance auto temporaire et la carte grise, et je peux vous guider pas à pas jusqu'à la souscription. Comment puis-je vous aider ?`,he=`Je rencontre un souci technique à l'instant. Je peux toutefois vous accompagner pas à pas jusqu'au formulaire, ou vous pouvez joindre un conseiller au 09 74 19 78 20 (Lun-Ven 9h-21h, Sam 9h-20h).`,ge=[`Qu'est-ce que l'assurance temporaire ?`,`Quels documents pour rouler ?`,`Assurer un véhicule étranger ?`],S=12,_e=`Vous m'avez déjà posé cette question. Pour un cas précis ou personnalisé, le mieux est d'appeler l'équipe au 09 74 19 78 20 ou d'obtenir un devis en ligne.`,ve=`Pour aller plus loin sur votre situation, contactez l'équipe au 09 74 19 78 20 (Lun-Ven 9h à 21h, Sam 9h à 20h) ou obtenez votre devis en ligne.`,ye=h(10),be=e=>new Promise(t=>setTimeout(t,e)),C=124,w=`assutempo_consent_v1`,T=`7a4b9f4a-f77e-4f9b-8a16-7635bff791ed`,E=`https://api.web3forms.com/submit`}))();export{v as default};