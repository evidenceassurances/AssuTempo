/**
 * Styles 100 % encapsules de l'assistant Assutempo.
 *
 * Toutes les regles sont prefixees `.atp-` et descendent de `.atp-root` :
 * aucun reset global, aucune regle sur *, body, html ou des balises generiques.
 * Le bloc est injecte une seule fois dans le <head> par le composant.
 *
 * Identite visuelle "Le Concierge Tempo" : verre espresso sombre, accent or,
 * caractere d'affichage serif (Georgia) contraste avec le texte Inter,
 * element signature = un sigil horloger avec une particule en orbite perpetuelle.
 *
 * Garde-fous animation : transform / opacity uniquement, respect de
 * prefers-reduced-motion (variante calme en bas de fichier).
 */
export const ASSISTANT_CSS = `
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
  right: max(20px, env(safe-area-inset-right));
  bottom: max(20px, env(safe-area-inset-bottom));
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
.atp-launcher {
  position: relative;
  width: 64px; height: 64px;
  border-radius: 50%;
  border: 1px solid var(--atp-line-strong);
  background:
    radial-gradient(120% 120% at 30% 25%, #1c150d 0%, #0c0907 70%);
  cursor: pointer;
  padding: 0;
  display: grid; place-items: center;
  box-shadow: var(--atp-shadow);
  transition: transform 0.18s var(--atp-ease), box-shadow 0.45s var(--atp-ease);
  will-change: transform;
}
.atp-launcher:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.22); }
/* retour visuel net au tap (pression rapide) */
.atp-launcher:active { transform: scale(0.88); transition-duration: 0.07s; }
.atp-launcher:focus-visible { outline: 2px solid var(--atp-gold-light); outline-offset: 3px; }
.atp-launcher--hidden { opacity: 0; transform: scale(0.6); pointer-events: none; }

/* halo qui respire derriere le lanceur */
.atp-launcher::before {
  content: '';
  position: absolute; inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 65%);
  opacity: 0.7;
  z-index: -1;
  animation: atp-breathe 4.2s var(--atp-ease) infinite;
}
.atp-launcher-badge {
  position: absolute; top: -3px; right: -3px;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--atp-gold-light);
  border: 2px solid var(--atp-panel);
  animation: atp-pop 0.5s var(--atp-ease) both;
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
   montee (gere en JS). Ici on coupe les animations decoratives lourdes (avatar
   planete statique), mais on GARDE le halo d'attente discret du bouton (::before,
   un seul element, transform/opacity, perf-safe) pour montrer qu'il est interactif. */
.atp-root--lite .atp-launcher { will-change: auto; }
.atp-root--lite .atp-sigil-orbit { animation: none; }
.atp-root--lite .atp-sigil-core { animation: none; }
.atp-root--lite .atp-sigil-particle { display: none; }

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

@media (max-width: 520px) {
  .atp-root {
    right: max(12px, env(safe-area-inset-right));
    left: max(12px, env(safe-area-inset-left));
    bottom: max(12px, env(safe-area-inset-bottom));
  }
  .atp-panel {
    width: auto; left: 0; right: 0;
    height: min(80vh, calc(100vh - 24px));
    height: min(80dvh, calc(100dvh - 24px));
  }
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
  z-index: 2147482100;
  border-radius: 16px;
  box-shadow:
    0 0 0 2px var(--atp-gold-light),
    0 0 24px 5px rgba(201,168,76,0.5),
    0 0 72px 16px rgba(201,168,76,0.22);
  pointer-events: none;
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
@keyframes atp-breathe { 0%,100% { opacity: 0.45; transform: scale(0.94); } 50% { opacity: 0.85; transform: scale(1.06); } }
@keyframes atp-orbit { to { transform: rotate(360deg); } }
@keyframes atp-spin { to { transform: rotate(360deg); } }
@keyframes atp-pop { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes atp-panel-in { from { opacity: 0; transform: translateY(14px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes atp-panel-out { to { opacity: 0; transform: translateY(14px) scale(0.92); } }
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
  .atp-root .atp-tour-pointer { animation: none; }
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
`;
