import{a as e,n as t}from"./rolldown-runtime-Cyuzqnbw.js";import{A as n,C as r,i,j as a,p as o,s,t as c}from"./framer-Be3hPn0e.js";import{d as l,r as u,t as d}from"./react-vendor-BDTje4YY.js";import{Jn as f,Kr as p,Qt as m,Xr as ee,Xt as te,br as h,g as ne,ir as g,it as re,t as _,wr as ie}from"./icons-DTR6_mEc.js";import{a as v,c as y,o as ae,s as b}from"./index-Cp8M5tXu.js";import{n as oe,t as se}from"./animations-gsEssKck.js";import{n as x,t as S}from"./Footer-DXlEILRq.js";import{n as C,t as w}from"./useScrollReveal-CMainDbO.js";function T(){return(0,E.jsxs)(`div`,{className:`gi-wrap`,"aria-hidden":`true`,children:[(0,E.jsxs)(`svg`,{className:`gi-svg`,viewBox:`0 0 320 320`,role:`presentation`,focusable:`false`,children:[(0,E.jsxs)(`defs`,{children:[(0,E.jsxs)(`linearGradient`,{id:`gi-gold`,x1:`0.1`,y1:`0`,x2:`0.9`,y2:`1`,children:[(0,E.jsx)(`stop`,{offset:`0`,stopColor:`#E8C97A`}),(0,E.jsx)(`stop`,{offset:`1`,stopColor:`#C9A84C`})]}),(0,E.jsxs)(`radialGradient`,{id:`gi-body`,cx:`0.42`,cy:`0.36`,r:`0.72`,children:[(0,E.jsx)(`stop`,{offset:`0`,stopColor:`rgba(232,201,122,0.10)`}),(0,E.jsx)(`stop`,{offset:`0.6`,stopColor:`rgba(201,168,76,0.03)`}),(0,E.jsx)(`stop`,{offset:`1`,stopColor:`rgba(201,168,76,0)`})]})]}),(0,E.jsx)(`circle`,{cx:`160`,cy:`160`,r:`120`,fill:`url(#gi-body)`}),(0,E.jsxs)(`g`,{fill:`none`,stroke:`url(#gi-gold)`,children:[(0,E.jsx)(`ellipse`,{cx:`160`,cy:`64`,rx:`56.3`,ry:`23.8`,strokeWidth:`1`,opacity:`0.5`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`93`,rx:`94.6`,ry:`40`,strokeWidth:`1`,opacity:`0.44`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`131.9`,rx:`115.9`,ry:`49`,strokeWidth:`0.9`,opacity:`0.38`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`160`,rx:`120`,ry:`50.7`,strokeWidth:`0.9`,opacity:`0.4`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`188.1`,rx:`115.9`,ry:`49`,strokeWidth:`0.9`,opacity:`0.38`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`227`,rx:`94.6`,ry:`40`,strokeWidth:`1`,opacity:`0.44`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`256`,rx:`56.3`,ry:`23.8`,strokeWidth:`1`,opacity:`0.5`})]}),(0,E.jsxs)(`g`,{className:`gi-meridians`,fill:`none`,stroke:`url(#gi-gold)`,children:[(0,E.jsx)(`line`,{x1:`160`,y1:`51.3`,x2:`160`,y2:`268.7`,strokeWidth:`0.9`,opacity:`0.34`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`160`,rx:`50.7`,ry:`108.75`,strokeWidth:`0.9`,opacity:`0.4`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`160`,rx:`91.9`,ry:`108.75`,strokeWidth:`0.9`,opacity:`0.46`}),(0,E.jsx)(`ellipse`,{cx:`160`,cy:`160`,rx:`115.9`,ry:`108.75`,strokeWidth:`1`,opacity:`0.52`})]}),(0,E.jsx)(`circle`,{cx:`160`,cy:`160`,r:`120`,fill:`none`,stroke:`#E8C97A`,strokeWidth:`1.1`,opacity:`0.9`}),(0,E.jsx)(`g`,{className:`gi-arcs`,fill:`none`,stroke:`#E8C97A`,strokeWidth:`1.1`,strokeLinecap:`round`,children:k.map(e=>(0,E.jsx)(`path`,{className:`gi-arc`,d:e},e))}),(0,E.jsx)(`circle`,{className:`gi-dep-ring`,cx:O.cx,cy:O.cy,r:`6`,fill:`none`,stroke:`#E8C97A`,strokeWidth:`1`,opacity:`0.7`}),(0,E.jsx)(`circle`,{cx:O.cx,cy:O.cy,r:`2.6`,fill:`#E8C97A`,opacity:`0.95`}),(0,E.jsx)(`g`,{className:`gi-points`,fill:`#E8C97A`,children:D.map(e=>(0,E.jsx)(`circle`,{className:`gi-point`,cx:e.cx,cy:e.cy,r:e.r,style:{animationDelay:e.delay}},`${e.cx}-${e.cy}`))})]}),(0,E.jsx)(`style`,{children:`
        /* Le globe part SOUS le header : son bord haut est ancre a une distance
           fixe du sommet du hero (jamais centre verticalement, sinon il remonte
           derriere la barre de navigation). translateX seul pour le centrage
           horizontal. Assez large pour englober le texte et la liste des pays.
           Le bas se fond dans la section (mask lineaire statique) : pas de coupe
           nette, pas de filtre anime. */
        .gi-wrap {
          position: absolute;
          top: 84px;
          left: 50%;
          width: clamp(360px, 88vw, 900px);
          transform: translateX(-50%);
          opacity: 0.17;
          pointer-events: none;
          z-index: 1;
          -webkit-mask-image: linear-gradient(180deg, #000 66%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(180deg, #000 66%, rgba(0,0,0,0) 100%);
        }
        @media (max-width: 640px) {
          .gi-wrap { top: 72px; width: clamp(340px, 124vw, 560px); }
        }
        .gi-svg { display: block; width: 100%; height: auto; }

        /* Le voyage : les tirets avancent le long des arcs. */
        .gi-arc {
          stroke-dasharray: 3 7;
          animation: gi-travel 15s linear infinite;
        }
        @keyframes gi-travel {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }

        /* Pulsation des destinations. */
        .gi-point {
          animation: gi-pulse 4.5s ease-in-out infinite;
        }
        @keyframes gi-pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gi-arc { stroke-dasharray: none; animation: none; }
          .gi-point { animation: none; opacity: 0.85; }
        }
      `})]})}var E,D,O,k,ce=t((()=>{E=n(),D=[{cx:118,cy:210,r:3,delay:`0s`},{cx:150,cy:222,r:2.8,delay:`1.4s`},{cx:140,cy:175,r:2.7,delay:`2.6s`},{cx:162,cy:165,r:2.7,delay:`0.7s`},{cx:182,cy:146,r:2.7,delay:`3.3s`},{cx:214,cy:188,r:3,delay:`1.9s`},{cx:236,cy:170,r:2.9,delay:`2.2s`}],O={cx:150,cy:72},k=[`M150,72 Q100,148 118,210`,`M150,72 Q214,118 214,188`,`M150,72 Q126,150 150,222`]}));function A({label:e,hint:t,error:n,children:r}){let i=n&&(0,F.isValidElement)(r)?(0,F.cloneElement)(r,{"aria-invalid":!0}):r;return(0,I.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[e&&(0,I.jsx)(`label`,{style:{fontSize:13,color:`var(--text-muted)`,fontWeight:500},children:e}),i,t&&(0,I.jsx)(`span`,{style:{fontSize:12,color:`var(--text-subtle)`,lineHeight:1.5},children:t}),n&&(0,I.jsx)(`span`,{className:`field-error-msg`,role:`alert`,style:{fontSize:12,color:`#e0a05c`},children:n})]})}function le(){requestAnimationFrame(()=>{let e=document.querySelector(`.field-error-msg`);if(!e)return;let t=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;e.scrollIntoView({behavior:t?`auto`:`smooth`,block:`center`})})}function ue(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:`${q(t.getDate())}/${q(t.getMonth()+1)} à ${q(t.getHours())}h${q(t.getMinutes())}`}function j(){try{let e=new Intl.DateTimeFormat(`fr-FR`,{timeZone:`Europe/Paris`,hour:`numeric`,hourCycle:`h23`}).formatToParts(new Date),t=parseInt(e.find(e=>e.type===`hour`)?.value||`12`,10);return t>=8&&t<20?`jour`:`nuit`}catch{return`jour`}}function M({orbit:e=!1}){return(0,I.jsxs)(`svg`,{className:`ix-globe-svg`,viewBox:`0 0 240 240`,"aria-hidden":`true`,children:[(0,I.jsxs)(`defs`,{children:[(0,I.jsxs)(`linearGradient`,{id:`ix-globe-stroke`,x1:`0`,y1:`0`,x2:`1`,y2:`1`,children:[(0,I.jsx)(`stop`,{offset:`0`,stopColor:`#E8C97A`}),(0,I.jsx)(`stop`,{offset:`1`,stopColor:`#C9A84C`})]}),(0,I.jsxs)(`radialGradient`,{id:`ix-globe-sphere`,cx:`0.4`,cy:`0.34`,r:`0.8`,children:[(0,I.jsx)(`stop`,{offset:`0`,stopColor:`rgba(232,201,122,0.16)`}),(0,I.jsx)(`stop`,{offset:`0.55`,stopColor:`rgba(201,168,76,0.05)`}),(0,I.jsx)(`stop`,{offset:`1`,stopColor:`rgba(201,168,76,0)`})]}),(0,I.jsxs)(`radialGradient`,{id:`ix-globe-halo`,cx:`0.5`,cy:`0.5`,r:`0.5`,children:[(0,I.jsx)(`stop`,{offset:`0.42`,stopColor:`rgba(201,168,76,0.12)`}),(0,I.jsx)(`stop`,{offset:`1`,stopColor:`rgba(201,168,76,0)`})]})]}),(0,I.jsx)(`circle`,{cx:`120`,cy:`120`,r:`118`,fill:`url(#ix-globe-halo)`}),(0,I.jsx)(`circle`,{cx:`120`,cy:`120`,r:`92`,fill:`url(#ix-globe-sphere)`}),(0,I.jsxs)(`g`,{stroke:`url(#ix-globe-stroke)`,fill:`none`,children:[(0,I.jsx)(`circle`,{cx:`120`,cy:`120`,r:`92`,strokeWidth:`1.4`,opacity:`0.75`}),(0,I.jsx)(`line`,{x1:`28`,y1:`120`,x2:`212`,y2:`120`,strokeWidth:`1`,opacity:`0.55`}),(0,I.jsx)(`line`,{x1:`33`,y1:`90`,x2:`207`,y2:`90`,strokeWidth:`0.9`,opacity:`0.4`}),(0,I.jsx)(`line`,{x1:`33`,y1:`150`,x2:`207`,y2:`150`,strokeWidth:`0.9`,opacity:`0.4`}),(0,I.jsx)(`line`,{x1:`48.6`,y1:`62`,x2:`191.4`,y2:`62`,strokeWidth:`0.8`,opacity:`0.3`}),(0,I.jsx)(`line`,{x1:`48.6`,y1:`178`,x2:`191.4`,y2:`178`,strokeWidth:`0.8`,opacity:`0.3`})]}),(0,I.jsxs)(`g`,{stroke:`url(#ix-globe-stroke)`,fill:`none`,opacity:`0.5`,children:[(0,I.jsx)(`line`,{x1:`120`,y1:`28`,x2:`120`,y2:`212`,strokeWidth:`1`}),(0,I.jsx)(`ellipse`,{cx:`120`,cy:`120`,rx:`32`,ry:`92`,strokeWidth:`0.9`}),(0,I.jsx)(`ellipse`,{cx:`120`,cy:`120`,rx:`63`,ry:`92`,strokeWidth:`0.8`})]}),e?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`circle`,{cx:`120`,cy:`120`,r:`110`,fill:`none`,stroke:`url(#ix-globe-stroke)`,strokeWidth:`0.8`,opacity:`0.28`}),(0,I.jsx)(`g`,{className:`ix-globe-orbit`,children:(0,I.jsx)(`circle`,{cx:`120`,cy:`10`,r:`4.5`,fill:`#E8C97A`})})]}):null]})}function de({pays:e}){let t=s(),n=(0,F.useRef)(null),[i,a]=(0,F.useState)(`jour`);(0,F.useEffect)(()=>{a(j());let e=setTimeout(()=>{n.current?.scrollIntoView({behavior:t?`auto`:`smooth`,block:`center`})},60);return()=>clearTimeout(e)},[t]);let o=i===`nuit`?`8 heures`:`4 heures`,c=t?{}:{initial:{opacity:0,scale:.82},animate:{opacity:1,scale:1},transition:{type:`spring`,stiffness:220,damping:20,delay:.15}},l=e=>t?{}:{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.55,ease:[.22,1,.36,1],delay:e}};return(0,I.jsxs)(`div`,{className:`ix-exp ix-reward`,ref:n,children:[(0,I.jsx)(`div`,{className:`ix-sky`,"aria-hidden":`true`,children:U.map((e,t)=>(0,I.jsx)(`span`,{className:`ix-dot`,style:{top:`${e.t}%`,left:`${e.l}%`,width:e.s,height:e.s,opacity:e.o}},t))}),(0,I.jsxs)(`div`,{className:`ix-reward-inner`,role:`status`,"aria-live":`polite`,children:[(0,I.jsxs)(`div`,{className:`ix-reward-globe`,children:[(0,I.jsx)(`span`,{className:t?`ix-pulse`:`ix-pulse ix-pulse-run`,"aria-hidden":`true`}),(0,I.jsx)(`span`,{className:t?`ix-pulse ix-pulse-2`:`ix-pulse ix-pulse-2 ix-pulse-run`,"aria-hidden":`true`}),(0,I.jsx)(M,{orbit:!0}),(0,I.jsx)(r.span,{className:`ix-reward-check`,...c,"aria-hidden":`true`,children:(0,I.jsx)(h,{size:30,strokeWidth:2.6})})]}),(0,I.jsxs)(r.p,{className:`ix-reward-eyebrow`,...l(.28),children:[(0,I.jsx)(f,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Demande envoyée`]}),(0,I.jsx)(r.h2,{className:`ix-reward-title`,...l(.34),children:`Merci, votre demande est bien partie.`}),(0,I.jsx)(r.p,{className:`ix-reward-text`,...l(.42),children:e&&e.length?`Un conseiller AssuTempo prépare votre devis sur mesure pour ${e.join(`, `)}.`:`Un conseiller AssuTempo prépare votre devis sur mesure.`}),(0,I.jsxs)(r.div,{className:`ix-delai`,...l(.5),children:[(0,I.jsx)(g,{size:20,strokeWidth:1.75,"aria-hidden":`true`}),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`p`,{className:`ix-delai-big`,children:[`Votre devis vous parvient sous `,(0,I.jsx)(`strong`,{children:o}),`.`]}),(0,I.jsx)(`p`,{className:`ix-delai-sub`,children:`Nos conseillers répondent en 4 heures maximum en journée, et 8 heures maximum en pleine nuit. Pensez à vérifier vos courriers indésirables.`})]})]}),(0,I.jsxs)(r.ul,{className:`ix-reward-band`,...l(.58),children:[(0,I.jsxs)(`li`,{children:[(0,I.jsx)(re,{size:17,color:`var(--gold-light)`,strokeWidth:1.75,"aria-hidden":`true`}),(0,I.jsx)(`span`,{children:`Evidence Assurances, courtier immatriculé à l'ORIAS sous le n° 20005719.`})]}),(0,I.jsxs)(`li`,{children:[(0,I.jsx)(m,{size:17,color:`var(--gold-light)`,strokeWidth:1.75,"aria-hidden":`true`}),(0,I.jsx)(`span`,{children:`Devis sans engagement, aucun paiement demandé à cette étape.`})]})]}),(0,I.jsxs)(r.div,{className:`ix-reward-links`,...l(.66),children:[(0,I.jsxs)(u,{to:`/tarification`,className:`ix-reward-link`,children:[`Assurance Europe immédiate`,(0,I.jsx)(p,{size:14,"aria-hidden":`true`})]}),(0,I.jsxs)(u,{to:`/carte`,className:`ix-reward-link`,children:[`Voir la carte des pays`,(0,I.jsx)(p,{size:14,"aria-hidden":`true`})]}),(0,I.jsxs)(u,{to:`/guichet-de-nuit`,className:`ix-reward-link`,children:[`Le Guichet de Nuit`,(0,I.jsx)(p,{size:14,"aria-hidden":`true`})]})]})]}),(0,I.jsx)(`style`,{children:J})]})}function N({initialPays:e}){let t=s(),[n,a]=(0,F.useState)(he),[c,l]=(0,F.useState)(()=>e?[e]:[]),[u,d]=(0,F.useState)({}),[h,g]=(0,F.useState)(`idle`),[_,v]=(0,F.useState)(0),[y,b]=(0,F.useState)(!1),[oe,se]=(0,F.useState)(!1),x=!y||oe||t?`simple`:`slider`,S=(0,F.useRef)(x),C=(0,F.useRef)(0);(0,F.useEffect)(()=>{S.current=x},[x]),(0,F.useEffect)(()=>{C.current=_},[_]),(0,F.useEffect)(()=>{b(!0)},[]);let w=(0,F.useRef)(null),T=(0,F.useRef)(null),E=(0,F.useRef)([]),D=(0,F.useRef)(0),O=o(0),k=o(`auto`);(0,F.useEffect)(()=>{let e=T.current;if(!e||typeof ResizeObserver>`u`)return;let t=new ResizeObserver(()=>{D.current=e.clientWidth,S.current===`slider`?O.set(-C.current*D.current):O.set(0)});return t.observe(e),()=>t.disconnect()},[O]),(0,F.useEffect)(()=>{D.current=T.current?.clientWidth||0,x===`slider`?O.set(-C.current*D.current):O.set(0)},[x,O]);let[ce,j]=(0,F.useState)(!1),M=(0,F.useRef)(null);pe(()=>{if(x!==`slider`){k.set(`auto`);return}let e=E.current[_];if(!e)return;let n=()=>{let n=e.offsetHeight;typeof k.get()!=`number`||t?k.set(n):i(k,n,{duration:.35,ease:[.22,1,.36,1]})};n();let r;return typeof ResizeObserver<`u`&&(r=new ResizeObserver(n),r.observe(e)),()=>{r&&r.disconnect()}},[x,_,t,k]),(0,F.useEffect)(()=>()=>{M.current&&clearTimeout(M.current)},[]);let[N,fe]=(0,F.useState)({minEffet:``,maxNaissance:``,maxPermis:``});(0,F.useEffect)(()=>{let e=new Date,t=`${e.getFullYear()}-${q(e.getMonth()+1)}-${q(e.getDate())}`,n=new Date(e.getFullYear()-18,e.getMonth(),e.getDate());fe({minEffet:`${t}T${q(e.getHours())}:${q(e.getMinutes())}`,maxNaissance:`${n.getFullYear()}-${q(n.getMonth()+1)}-${q(n.getDate())}`,maxPermis:t})},[]);let R=e=>t=>{let{value:n}=t.target;a(t=>({...t,[e]:n})),d(t=>t[e]?{...t,[e]:void 0}:t)},U=e=>{let t=e.target.value.replace(/\D/g,``).slice(0,10);a(e=>({...e,telephone:t})),d(e=>e.telephone?{...e,telephone:void 0}:e)},ge=e=>{let t=e.target.value.replace(/\D/g,``).slice(0,5);a(e=>({...e,codePostal:t})),d(e=>e.codePostal?{...e,codePostal:void 0}:e)},_e=e=>{let t=e.target.value.toUpperCase();a(e=>({...e,immat:t})),d(e=>e.immat?{...e,immat:void 0}:e)};function ve(e){l(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),d(e=>e.pays?{...e,pays:void 0}:e)}function ye(){let e={};if(c.length===0&&(e.pays=`Sélectionnez au moins un pays de destination.`),!n.dateEffet)e.dateEffet=`Champ requis.`;else{let t=new Date(n.dateEffet);(Number.isNaN(t.getTime())||t.getTime()<Date.now()-3600*1e3)&&(e.dateEffet=`La date d'effet doit être à venir.`)}if(!n.duree)e.duree=`Champ requis.`;else{let t=Number(n.duree);(!Number.isInteger(t)||t<1||t>90)&&(e.duree=`Indiquez une durée entière entre 1 et 90 jours.`)}if(n.genre||(e.genre=`Champ requis.`),n.marque.trim()||(e.marque=`Champ requis.`),n.modele.trim()||(e.modele=`Champ requis.`),n.immat.trim()||(e.immat=`Champ requis.`),!n.puissance)e.puissance=`Champ requis.`;else{let t=Number(n.puissance);(!Number.isInteger(t)||t<1||t>999)&&(e.puissance=`Indiquez un nombre entier de chevaux fiscaux.`)}if(n.paysImmat.trim()||(e.paysImmat=`Champ requis.`),n.usage||(e.usage=`Champ requis.`),n.nom.trim()||(e.nom=`Champ requis.`),n.prenom.trim()||(e.prenom=`Champ requis.`),!n.dateNaissance)e.dateNaissance=`Champ requis.`;else{let t=new Date(n.dateNaissance),r=new Date(t.getFullYear()+18,t.getMonth(),t.getDate());(Number.isNaN(t.getTime())||r.getTime()>Date.now())&&(e.dateNaissance=`Le conducteur doit être majeur.`)}if(!n.datePermis)e.datePermis=`Champ requis.`;else{let t=new Date(n.datePermis);Number.isNaN(t.getTime())||t.getTime()>Date.now()?e.datePermis=`Cette date ne peut pas être dans le futur.`:n.dateNaissance&&t.getTime()<=new Date(n.dateNaissance).getTime()&&(e.datePermis=`Date incohérente avec la date de naissance.`)}return n.numPermis.trim()||(e.numPermis=`Champ requis.`),n.paysResidence.trim()||(e.paysResidence=`Champ requis.`),n.adresse.trim()||(e.adresse=`Champ requis.`),n.codePostal.trim()?/^\d{5}$/.test(n.codePostal)||(e.codePostal=`Code postal invalide : 5 chiffres.`):e.codePostal=`Champ requis.`,n.ville.trim()||(e.ville=`Champ requis.`),n.condamnation||(e.condamnation=`Répondez à cette question.`),n.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email)||(e.email=`Adresse email invalide.`):e.email=`Champ requis.`,n.telephone?/^0[1-9]\d{8}$/.test(n.telephone)||(e.telephone=`Numéro invalide : 10 chiffres commençant par 0, ex. 0612345678.`):e.telephone=`Champ requis.`,n.consentement||(e.consentement=`Votre accord est requis.`),e}let Y=(0,F.useCallback)(e=>{let n=me(e,0,V);if(v(n),S.current===`slider`){let e=-n*D.current;t?O.set(e):(j(!0),M.current&&clearTimeout(M.current),M.current=setTimeout(()=>j(!1),480),i(O,e,{type:`spring`,stiffness:260,damping:34,restDelta:.5}));return}E.current[n]?.scrollIntoView({behavior:t?`instant`:`smooth`,block:`start`})},[t,O]),X=e=>{let t=ye(),n=H[e],r={};return n.forEach(e=>{t[e]&&(r[e]=t[e])}),d(e=>{let t={...e};return n.forEach(e=>{delete t[e]}),{...t,...r}}),Object.keys(r).length>0?(le(),!1):(Y(e+1),!0)},Z=(0,F.useRef)(null),be=e=>{S.current!==`slider`||h===`envoi`||e.target.closest(`input, select, textarea, button, a, label`)||(Z.current={id:e.pointerId,x0:e.clientX,y0:e.clientY,base:O.get(),actif:!1})},xe=e=>{let t=Z.current;if(!t||t.id!==e.pointerId)return;let n=e.clientX-t.x0,r=e.clientY-t.y0;if(!t.actif){if(Math.abs(n)<12)return;if(Math.abs(n)<=Math.abs(r)){Z.current=null;return}t.actif=!0,T.current?.setPointerCapture?.(e.pointerId)}let i=D.current||1,a=-V*i,o=t.base+n;o>0?o*=.25:o<a&&(o=a+(o-a)*.25),O.set(o)},Se=e=>{let t=Z.current;if(Z.current=null,!t||(T.current?.hasPointerCapture?.(e.pointerId)&&T.current.releasePointerCapture(e.pointerId),!t.actif))return;let n=e.clientX-t.x0,r=Math.min(90,(D.current||320)*.18),i=C.current;if(n<-r&&i<V){X(i)||Y(i);return}if(n>r&&i>0){d(e=>e),Y(i-1);return}Y(i)};async function Ce(e){if(e.preventDefault(),h===`envoi`)return;let t=ye();if(Object.keys(t).length>0){d(t);let e=H.findIndex(e=>e.some(e=>t[e]));e>=0&&Y(e),le();return}d({}),w.current&&(w.current.value=c.join(`, `)),g(`envoi`);try{let t=new FormData(e.target);for(let[e,n]of[...t.entries()])typeof n==`string`&&t.set(e,n.trim());(await(await fetch(`https://api.web3forms.com/submit`,{method:`POST`,body:t})).json()).success?(g(`succes`),ae(`generate_lead`,{form_type:`international`})):g(`erreur`)}catch{g(`erreur`)}}if(h===`succes`)return(0,I.jsx)(de,{pays:c});let we=c.length?c.join(`, `):`À compléter`,Te=n.dateEffet?`${ue(n.dateEffet)}${n.duree?` · ${n.duree} j`:``}`:`À compléter`,Ee=[n.marque.trim(),n.modele.trim()].filter(Boolean).join(` `)||n.genre||`À compléter`,De=x!==`simple`,Q=e=>De&&e!==_,$=e=>(0,I.jsxs)(`div`,{className:`ix-nav`,children:[e>0?(0,I.jsxs)(`button`,{type:`button`,className:`ix-back`,onClick:()=>{d(e=>e),Y(e-1)},children:[(0,I.jsx)(ee,{size:15,"aria-hidden":`true`}),`Retour`]}):(0,I.jsx)(`span`,{}),(0,I.jsxs)(`button`,{type:`button`,className:`btn-gold ix-next`,onClick:()=>X(e),children:[`Continuer`,(0,I.jsx)(p,{size:16,strokeWidth:2,"aria-hidden":`true`})]})]});return(0,I.jsxs)(`div`,{className:`ix-exp ix-mode-${x}`,style:{"--ix-n":B},children:[(0,I.jsxs)(`div`,{className:`ix-inner`,children:[(0,I.jsxs)(`header`,{className:`ix-head`,children:[(0,I.jsxs)(`p`,{className:`ix-eyebrow`,children:[(0,I.jsx)(f,{size:14,strokeWidth:2,"aria-hidden":`true`}),`DEVIS PERSONNALISÉ`]}),(0,I.jsx)(`h2`,{className:`ix-title`,children:`Demandez votre devis en 4 étapes`}),(0,I.jsx)(`p`,{className:`ix-sub`,children:`Un parcours court et guidé, une carte après l'autre. Notre équipe vous répond en 4h en journée, 8h la nuit.`}),(0,I.jsxs)(`p`,{className:`ix-orias`,children:[(0,I.jsx)(re,{size:15,strokeWidth:1.75,"aria-hidden":`true`}),`Evidence Assurances, courtier immatriculé à l'ORIAS sous le n° 20005719.`]})]}),(0,I.jsxs)(`div`,{className:`ix-thread`,children:[(0,I.jsx)(`div`,{className:`ix-constellation`,"aria-hidden":`true`,children:z.map((e,t)=>(0,I.jsx)(`span`,{className:`ix-cs`,style:{opacity:t===_?1:t<_?.55:.18,transform:t===_?`scale(1.7)`:`scale(1)`}},e.key))}),(0,I.jsxs)(`p`,{className:`ix-step-label`,"aria-hidden":`true`,children:[`Étape `,_+1,` sur `,B,` : `,z[_].title]}),(0,I.jsx)(`button`,{type:`button`,className:`ix-switch`,onClick:()=>se(e=>!e),children:x===`simple`&&!t&&y?`Revenir au parcours guidé`:`Passer à la version simple`})]}),(0,I.jsxs)(`p`,{className:`sr-only`,"aria-live":`polite`,children:[`Étape `,_+1,` sur `,B,` : `,z[_].title]}),(0,I.jsxs)(r.form,{ref:T,className:`ix-stage`,onSubmit:Ce,onPointerDown:be,onPointerMove:xe,onPointerUp:Se,onPointerCancel:Se,noValidate:!0,style:{height:k,overflowY:x===`slider`&&ce?`hidden`:void 0},children:[(0,I.jsx)(`input`,{type:`hidden`,name:`access_key`,value:`7a4b9f4a-f77e-4f9b-8a16-7635bff791ed`}),(0,I.jsx)(`input`,{type:`hidden`,name:`subject`,value:`Demande de devis international AssuTempo`}),(0,I.jsx)(`input`,{type:`hidden`,name:`from_name`,value:`Formulaire international AssuTempo`}),(0,I.jsx)(`input`,{type:`hidden`,name:`Pays de destination`,ref:w}),(0,I.jsx)(`input`,{type:`checkbox`,name:`botcheck`,style:{display:`none`},tabIndex:-1,autoComplete:`off`}),(0,I.jsxs)(r.div,{className:`ix-track`,style:{x:O},children:[(0,I.jsx)(`section`,{className:`ix-scene`,"data-step":`0`,ref:e=>{E.current[0]=e},inert:Q(0)||void 0,children:(0,I.jsxs)(`div`,{className:`ix-scene-inner`,children:[(0,I.jsx)(P,{num:`01`,Icon:te,title:`Votre trajet`}),(0,I.jsx)(A,{label:`Pays de destination *`,error:u.pays,children:(0,I.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,marginTop:4},children:L.map(({nom:e,flag:t})=>{let n=c.includes(e);return(0,I.jsxs)(`button`,{type:`button`,onClick:()=>ve(e),"aria-pressed":n,className:`ix-chip`,style:{borderColor:n?`var(--gold)`:`rgba(255,255,255,0.14)`,background:n?`var(--gold-glow)`:`rgba(255,255,255,0.03)`,color:n?`var(--text)`:`var(--text-muted)`,fontWeight:n?600:400},children:[t,` `,e]},e)})})}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Date et heure d'effet souhaitées *`,error:u.dateEffet,hint:`Votre couverture démarre à cette date, utile pour un passage de douane.`,children:(0,I.jsx)(`input`,{type:`datetime-local`,name:`Date et heure d'effet`,value:n.dateEffet,min:N.minEffet||void 0,onChange:R(`dateEffet`),onFocus:G,onBlur:K,required:!0,style:{...W,colorScheme:`dark`}})}),(0,I.jsx)(A,{label:`Durée souhaitée (jours) *`,error:u.duree,children:(0,I.jsx)(`input`,{type:`number`,name:`Durée (jours)`,min:`1`,max:`90`,step:`1`,inputMode:`numeric`,placeholder:`Ex. : 7`,value:n.duree,onChange:R(`duree`),onFocus:G,onBlur:K,required:!0,style:W})})]}),x===`slider`?$(0):null]})}),(0,I.jsx)(`section`,{className:`ix-scene`,"data-step":`1`,ref:e=>{E.current[1]=e},inert:Q(1)||void 0,children:(0,I.jsxs)(`div`,{className:`ix-scene-inner`,children:[(0,I.jsx)(P,{num:`02`,Icon:ie,title:`Votre véhicule`}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Genre du véhicule *`,error:u.genre,children:(0,I.jsxs)(`select`,{name:`Genre du véhicule`,value:n.genre,onChange:R(`genre`),onFocus:G,onBlur:K,style:{...W,appearance:`none`,cursor:`pointer`,color:n.genre?`var(--text)`:`var(--text-muted)`},children:[(0,I.jsx)(`option`,{value:``,disabled:!0,children:`Sélectionnez...`}),(0,I.jsx)(`option`,{value:`Véhicule particulier`,style:{background:`#0C0A08`},children:`Véhicule particulier`}),(0,I.jsx)(`option`,{value:`Poids lourd`,style:{background:`#0C0A08`},children:`Poids lourd`})]})}),(0,I.jsx)(A,{label:`Usage du véhicule *`,error:u.usage,children:(0,I.jsxs)(`select`,{name:`Usage du véhicule`,value:n.usage,onChange:R(`usage`),onFocus:G,onBlur:K,style:{...W,appearance:`none`,cursor:`pointer`,color:n.usage?`var(--text)`:`var(--text-muted)`},children:[(0,I.jsx)(`option`,{value:``,disabled:!0,children:`Sélectionnez...`}),(0,I.jsx)(`option`,{value:`Privé et professionnel occasionnel`,style:{background:`#0C0A08`},children:`Privé et professionnel occasionnel`}),(0,I.jsx)(`option`,{value:`Import-export`,style:{background:`#0C0A08`},children:`Import-export`})]})})]}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Marque *`,error:u.marque,children:(0,I.jsx)(`input`,{type:`text`,name:`Marque`,placeholder:`Ex. : Renault`,value:n.marque,onChange:R(`marque`),onFocus:G,onBlur:K,maxLength:60,required:!0,style:W})}),(0,I.jsx)(A,{label:`Modèle *`,error:u.modele,children:(0,I.jsx)(`input`,{type:`text`,name:`Modèle`,placeholder:`Ex. : Clio`,value:n.modele,onChange:R(`modele`),onFocus:G,onBlur:K,maxLength:60,required:!0,style:W})})]}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Immatriculation *`,error:u.immat,children:(0,I.jsx)(`input`,{type:`text`,name:`Immatriculation`,placeholder:`AB-123-CD`,value:n.immat,onChange:_e,onFocus:G,onBlur:K,maxLength:15,required:!0,style:{...W,textTransform:`uppercase`}})}),(0,I.jsx)(A,{label:`Puissance fiscale (CV) *`,error:u.puissance,children:(0,I.jsx)(`input`,{type:`number`,name:`Puissance fiscale (CV)`,placeholder:`Ex. : 6`,min:`1`,max:`999`,step:`1`,inputMode:`numeric`,value:n.puissance,onChange:R(`puissance`),onFocus:G,onBlur:K,required:!0,style:W})})]}),(0,I.jsx)(A,{label:`Pays d'immatriculation *`,error:u.paysImmat,children:(0,I.jsx)(`input`,{type:`text`,name:`Pays d'immatriculation`,value:n.paysImmat,onChange:R(`paysImmat`),onFocus:G,onBlur:K,maxLength:60,required:!0,style:W})}),x===`slider`?$(1):null]})}),(0,I.jsx)(`section`,{className:`ix-scene`,"data-step":`2`,ref:e=>{E.current[2]=e},inert:Q(2)||void 0,children:(0,I.jsxs)(`div`,{className:`ix-scene-inner`,children:[(0,I.jsx)(P,{num:`03`,Icon:ne,title:`Le conducteur`}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Nom *`,error:u.nom,children:(0,I.jsx)(`input`,{type:`text`,name:`Nom`,value:n.nom,onChange:R(`nom`),onFocus:G,onBlur:K,autoComplete:`family-name`,maxLength:80,required:!0,style:W})}),(0,I.jsx)(A,{label:`Prénom *`,error:u.prenom,children:(0,I.jsx)(`input`,{type:`text`,name:`Prénom`,value:n.prenom,onChange:R(`prenom`),onFocus:G,onBlur:K,autoComplete:`given-name`,maxLength:80,required:!0,style:W})})]}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Date de naissance *`,error:u.dateNaissance,children:(0,I.jsx)(`input`,{type:`date`,name:`Date de naissance`,value:n.dateNaissance,max:N.maxNaissance||void 0,onChange:R(`dateNaissance`),onFocus:G,onBlur:K,autoComplete:`bday`,required:!0,style:{...W,colorScheme:`dark`}})}),(0,I.jsx)(A,{label:`Date d'obtention du permis *`,error:u.datePermis,children:(0,I.jsx)(`input`,{type:`date`,name:`Date d'obtention du permis`,value:n.datePermis,max:N.maxPermis||void 0,onChange:R(`datePermis`),onFocus:G,onBlur:K,required:!0,style:{...W,colorScheme:`dark`}})})]}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Numéro du permis *`,error:u.numPermis,children:(0,I.jsx)(`input`,{type:`text`,name:`Numéro du permis`,value:n.numPermis,onChange:R(`numPermis`),onFocus:G,onBlur:K,maxLength:30,required:!0,style:W})}),(0,I.jsx)(A,{label:`Pays de résidence *`,error:u.paysResidence,children:(0,I.jsx)(`input`,{type:`text`,name:`Pays de résidence`,value:n.paysResidence,onChange:R(`paysResidence`),onFocus:G,onBlur:K,maxLength:60,required:!0,style:W})})]}),(0,I.jsx)(A,{label:`Adresse de résidence (rue et numéro) *`,error:u.adresse,hint:`Nécessaire à l'assureur pour établir le contrat, jamais utilisée à des fins commerciales.`,children:(0,I.jsx)(`input`,{type:`text`,name:`Adresse (rue et numéro)`,placeholder:`12 rue des Lilas`,value:n.adresse,onChange:R(`adresse`),onFocus:G,onBlur:K,autoComplete:`street-address`,maxLength:120,required:!0,style:W})}),(0,I.jsxs)(`div`,{className:`ix-row ix-row-13`,children:[(0,I.jsx)(A,{label:`Code postal *`,error:u.codePostal,children:(0,I.jsx)(`input`,{type:`text`,name:`Code postal`,placeholder:`75011`,value:n.codePostal,onChange:ge,onFocus:G,onBlur:K,autoComplete:`postal-code`,inputMode:`numeric`,maxLength:5,required:!0,style:W})}),(0,I.jsx)(A,{label:`Ville de résidence *`,error:u.ville,hint:`La souscription n'est pas possible si le conducteur réside en Corse, à Monaco ou en France d'Outre-mer.`,children:(0,I.jsx)(`input`,{type:`text`,name:`Ville de résidence`,value:n.ville,onChange:R(`ville`),onFocus:G,onBlur:K,autoComplete:`address-level2`,maxLength:80,required:!0,style:W})})]}),(0,I.jsx)(A,{label:`Avez-vous fait l'objet d'une condamnation pour délit de fuite, d'une suspension ou d'une annulation de permis au cours des 24 derniers mois ? *`,error:u.condamnation,hint:`Question exigée par l'assureur : une réponse Oui n'entraîne pas de refus automatique, un conseiller étudie chaque dossier.`,children:(0,I.jsx)(`div`,{style:{display:`flex`,gap:24,marginTop:4},children:[`Oui`,`Non`].map(e=>(0,I.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:8,cursor:`pointer`},children:[(0,I.jsx)(`input`,{type:`radio`,name:`Condamnation ou suspension de permis (24 mois)`,value:e,checked:n.condamnation===e,onChange:()=>{a(t=>({...t,condamnation:e})),d(e=>e.condamnation?{...e,condamnation:void 0}:e)},style:{accentColor:`var(--gold)`,width:16,height:16,cursor:`pointer`}}),(0,I.jsx)(`span`,{style:{fontSize:15,color:`var(--text-muted)`},children:e})]},e))})}),x===`slider`?$(2):null]})}),(0,I.jsx)(`section`,{className:`ix-scene`,"data-step":`3`,ref:e=>{E.current[3]=e},inert:Q(3)||void 0,children:(0,I.jsxs)(`div`,{className:`ix-scene-inner`,children:[(0,I.jsx)(P,{num:`04`,Icon:m,title:`Vos coordonnées`}),(0,I.jsxs)(`div`,{className:`ix-recap`,children:[(0,I.jsx)(`p`,{className:`ix-recap-title`,children:`Récapitulatif`}),[{label:`Destination`,value:we,step:0},{label:`Dates`,value:Te,step:0},{label:`Véhicule`,value:Ee,step:1}].map(e=>(0,I.jsxs)(`div`,{className:`ix-recap-row`,children:[(0,I.jsx)(`span`,{className:`ix-recap-label`,children:e.label}),(0,I.jsx)(`span`,{className:`ix-recap-value`,children:e.value}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>Y(e.step),className:`ix-recap-edit`,children:`Modifier`})]},e.label))]}),(0,I.jsxs)(`div`,{className:`ix-row`,children:[(0,I.jsx)(A,{label:`Email *`,error:u.email,children:(0,I.jsx)(`input`,{type:`email`,name:`Email`,placeholder:`vous@exemple.fr`,value:n.email,onChange:R(`email`),onFocus:G,onBlur:K,autoComplete:`email`,maxLength:120,required:!0,style:W})}),(0,I.jsx)(A,{label:`Téléphone *`,error:u.telephone,children:(0,I.jsx)(`input`,{type:`tel`,name:`Téléphone`,placeholder:`0612345678`,value:n.telephone,onChange:U,onFocus:G,onBlur:K,autoComplete:`tel-national`,inputMode:`numeric`,maxLength:10,required:!0,style:W})})]}),(0,I.jsx)(A,{label:`Message (facultatif)`,children:(0,I.jsx)(`textarea`,{name:`Message`,placeholder:`Une précision sur votre situation ? (facultatif)`,value:n.message,onChange:R(`message`),onFocus:G,onBlur:K,maxLength:2e3,rows:3,style:{...W,resize:`vertical`,minHeight:84}})}),(0,I.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,I.jsxs)(`label`,{style:{display:`flex`,gap:12,cursor:`pointer`,alignItems:`flex-start`},children:[(0,I.jsx)(`input`,{type:`checkbox`,name:`Consentement`,checked:n.consentement,onChange:e=>{let{checked:t}=e.target;a(e=>({...e,consentement:t})),d(e=>e.consentement?{...e,consentement:void 0}:e)},style:{accentColor:`var(--gold)`,width:16,height:16,marginTop:3,flexShrink:0,cursor:`pointer`}}),(0,I.jsx)(`span`,{style:{fontSize:13,color:`var(--text-muted)`,lineHeight:1.6},children:`J'accepte que mes informations soient utilisées pour établir mon devis et être recontacté par AssuTempo.`})]}),u.consentement&&(0,I.jsx)(`span`,{className:`field-error-msg`,role:`alert`,style:{fontSize:12,color:`#e0a05c`},children:u.consentement})]}),(0,I.jsx)(`div`,{"aria-live":`polite`,children:h===`erreur`&&(0,I.jsx)(`p`,{className:`ix-send-error`,children:`Une erreur est survenue. Réessayez ou appelez-nous au 09 74 19 78 20.`})}),(0,I.jsx)(`p`,{style:{fontSize:13,color:`var(--text-subtle)`,margin:0,lineHeight:1.5},children:`Réponse en 4h en journée, 8h la nuit, sans engagement, aucun paiement demandé à cette étape.`}),(0,I.jsxs)(`div`,{className:`ix-submit-row`,children:[x===`slider`?(0,I.jsxs)(`button`,{type:`button`,className:`ix-back`,onClick:()=>{d(e=>e),Y(2)},children:[(0,I.jsx)(ee,{size:15,"aria-hidden":`true`}),`Retour`]}):(0,I.jsx)(`span`,{}),(0,I.jsxs)(`button`,{type:`submit`,className:`btn-gold ix-submit`,disabled:h===`envoi`,style:{opacity:h===`envoi`?.7:1,cursor:h===`envoi`?`not-allowed`:`pointer`},children:[h===`envoi`?`Envoi en cours...`:`Recevoir mon devis`,h!==`envoi`&&(0,I.jsx)(p,{size:16,strokeWidth:2,"aria-hidden":`true`})]})]})]})})]})]})]}),(0,I.jsx)(`style`,{children:J})]})}function P({num:e,title:t,Icon:n}){return(0,I.jsxs)(`div`,{className:`ix-scene-head`,children:[(0,I.jsx)(`span`,{className:`ix-scene-icon`,children:(0,I.jsx)(n,{size:18,strokeWidth:1.75,"aria-hidden":`true`})}),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`span`,{className:`ix-scene-num`,children:[e,` / 04`]}),(0,I.jsx)(`h3`,{className:`ix-scene-title`,children:t})]})]})}function fe(){let[e,t]=C(),[n,i]=C(),[a]=l(),o=s(),c=(0,F.useRef)(null),u=a.get(`pays`),d=L.find(e=>e.slug===u)??null;return(0,F.useEffect)(()=>{if(!d)return;let e=setTimeout(()=>{c.current?.scrollIntoView({behavior:o?`auto`:`smooth`,block:`start`})},300);return()=>clearTimeout(e)},[]),(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(b,{children:[(0,I.jsx)(`title`,{children:`Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo`}),(0,I.jsx)(`meta`,{name:`description`,content:`Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé en 4h en journée, 8h la nuit. Voitures et poids lourds.`}),(0,I.jsx)(`link`,{rel:`canonical`,href:`https://assutempo.fr/assurance-internationale`}),(0,I.jsx)(`meta`,{property:`og:title`,content:`Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo`}),(0,I.jsx)(`meta`,{property:`og:description`,content:`Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé rapide, accompagnement dédié.`}),(0,I.jsx)(`meta`,{property:`og:url`,content:`https://assutempo.fr/assurance-internationale`}),(0,I.jsx)(`meta`,{property:`og:type`,content:`website`}),(0,I.jsx)(`meta`,{property:`og:site_name`,content:`AssuTempo`}),(0,I.jsx)(`meta`,{name:`twitter:card`,content:`summary`}),(0,I.jsx)(`meta`,{name:`twitter:title`,content:`Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo`}),(0,I.jsx)(`meta`,{name:`twitter:description`,content:`Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé rapide, accompagnement dédié.`})]}),(0,I.jsxs)(`section`,{style:{paddingTop:160,paddingBottom:104,textAlign:`center`,background:`var(--bg)`,position:`relative`,overflow:`hidden`},children:[(0,I.jsx)(T,{}),(0,I.jsx)(`div`,{style:{position:`absolute`,inset:0,pointerEvents:`none`,background:`radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)`}}),(0,I.jsxs)(r.div,{variants:se,initial:`hidden`,animate:`visible`,style:{position:`relative`,zIndex:2,padding:`0 24px`},children:[(0,I.jsx)(`p`,{style:{fontSize:12,letterSpacing:`0.2em`,textTransform:`uppercase`,color:`var(--gold)`,marginBottom:16},children:`COUVERTURE INTERNATIONALE`}),(0,I.jsx)(`h1`,{style:{fontSize:`clamp(32px, 5vw, 60px)`,fontWeight:800,color:`#fff`,marginBottom:20,letterSpacing:`-0.03em`},children:`Destinations sur demande`}),(0,I.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,maxWidth:580,margin:`0 auto`,lineHeight:1.75},children:`Au-delà de la zone carte verte européenne, notre équipe établit votre devis sur mesure et vous accompagne personnellement jusqu'à la souscription. Vous recevez votre proposition en 4h en journée, 8h la nuit, prête à souscrire. Offre réservée aux voitures et aux poids lourds.`}),(0,I.jsx)(`div`,{ref:e,style:{display:`flex`,flexWrap:`wrap`,gap:10,justifyContent:`center`,maxWidth:640,margin:`36px auto 0`},children:L.map((e,n)=>(0,I.jsxs)(r.span,{initial:{opacity:0,scale:.9},animate:t?{opacity:1,scale:1}:{},transition:{duration:.3,delay:n*.06,ease:[.22,1,.36,1]},style:{display:`inline-block`,padding:`8px 16px`,background:`var(--glass)`,border:`1px solid var(--gold-border)`,borderRadius:999,fontSize:14,color:`var(--text-muted)`,whiteSpace:`nowrap`},children:[e.flag,` `,e.nom]},e.nom))})]})]}),(0,I.jsxs)(`section`,{style:{background:`var(--bg-2)`,padding:`40px 0`},children:[(0,I.jsxs)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:`0 32px`},children:[(0,I.jsx)(r.div,{initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:`-60px`},transition:{duration:.6,ease:[.22,1,.36,1]},style:{textAlign:`center`,marginBottom:30},children:(0,I.jsxs)(`h2`,{style:{fontSize:`clamp(1.4rem, 2.8vw, 1.9rem)`,fontWeight:700,letterSpacing:`-0.025em`,color:`var(--text)`,margin:0},children:[`Comment ça marche ?`,` `,(0,I.jsx)(`span`,{style:{fontWeight:400,color:`var(--text-muted)`,fontSize:`0.7em`},children:`Simple, rapide, personnalisé.`})]})}),(0,I.jsx)(`div`,{ref:n,className:`intl-steps`,style:{display:`flex`,alignItems:`flex-start`},children:R.map((e,t)=>(0,I.jsxs)(r.div,{className:`intl-step`,initial:{opacity:0,y:12},animate:i?{opacity:1,y:0}:{},transition:{duration:.4,delay:t*.06,ease:[.22,1,.36,1]},style:{flex:1,display:`flex`,flexDirection:`column`,alignItems:`center`,textAlign:`center`,padding:`0 16px`},children:[(0,I.jsx)(`div`,{style:{fontSize:12,fontWeight:700,color:`var(--gold)`,letterSpacing:`0.15em`,marginBottom:8},children:e.num}),(0,I.jsx)(`p`,{style:{fontSize:15.5,fontWeight:600,color:`var(--text)`,margin:`0 0 5px`,lineHeight:1.35,maxWidth:260},children:e.title}),(0,I.jsx)(`p`,{style:{fontSize:13.5,color:`var(--text-muted)`,margin:0,lineHeight:1.55,maxWidth:240},children:e.body})]},e.num))})]}),(0,I.jsx)(`style`,{children:`
          @media (max-width: 768px) {
            .intl-steps { flex-direction: column !important; align-items: center !important; }
            .intl-step { width: 100% !important; max-width: 340px !important; margin-bottom: 22px !important; padding: 0 8px !important; }
            .intl-step:last-child { margin-bottom: 0 !important; }
          }
        `})]}),(0,I.jsx)(`section`,{ref:c,style:{background:`var(--bg)`},children:(0,I.jsx)(N,{initialPays:d?.nom})}),(0,I.jsx)(S,{})]})}var F,I,pe,L,R,z,B,V,me,H,U,W,G,K,q,he,J;t((()=>{F=e(a()),d(),c(),y(),_(),x(),ce(),oe(),w(),v(),I=n(),pe=typeof window<`u`?F.useLayoutEffect:F.useEffect,L=[{slug:`albanie`,nom:`Albanie`,flag:`🇦🇱`},{slug:`azerbaidjan`,nom:`Azerbaïdjan`,flag:`🇦🇿`},{slug:`macedoine-du-nord`,nom:`Macédoine du Nord`,flag:`🇲🇰`},{slug:`maroc`,nom:`Maroc`,flag:`🇲🇦`},{slug:`moldavie`,nom:`Moldavie`,flag:`🇲🇩`},{slug:`tunisie`,nom:`Tunisie`,flag:`🇹🇳`},{slug:`turquie`,nom:`Turquie`,flag:`🇹🇷`}],R=[{num:`01`,title:`Vous remplissez le formulaire`,body:`Votre véhicule, votre trajet, vos dates.`},{num:`02`,title:`Notre équipe établit votre devis`,body:`Un tarif sur mesure, calculé selon votre profil.`},{num:`03`,title:`Vous recevez votre proposition`,body:`En 4h en journée, 8h la nuit, prête à souscrire, directement par email.`}],z=[{num:`01`,key:`trajet`,title:`Votre trajet`,Icon:te},{num:`02`,key:`vehicule`,title:`Votre véhicule`,Icon:ie},{num:`03`,key:`conducteur`,title:`Le conducteur`,Icon:ne},{num:`04`,key:`coordonnees`,title:`Vos coordonnées`,Icon:m}],B=z.length,V=B-1,me=(e,t,n)=>Math.min(n,Math.max(t,e)),H=[[`pays`,`dateEffet`,`duree`],[`genre`,`usage`,`marque`,`modele`,`immat`,`puissance`,`paysImmat`],[`nom`,`prenom`,`dateNaissance`,`datePermis`,`numPermis`,`paysResidence`,`adresse`,`codePostal`,`ville`,`condamnation`],[`email`,`telephone`,`consentement`]],U=[{t:14,l:8,s:2,o:.35},{t:28,l:17,s:1.5,o:.28},{t:62,l:11,s:1.5,o:.3},{t:78,l:22,s:2,o:.24},{t:20,l:84,s:2,o:.32},{t:44,l:92,s:1.5,o:.26},{t:70,l:88,s:2,o:.3},{t:86,l:74,s:1.5,o:.22},{t:10,l:54,s:1.5,o:.2},{t:90,l:46,s:1.5,o:.24}],W={width:`100%`,background:`rgba(255,255,255,0.04)`,border:`1px solid rgba(255,255,255,0.12)`,borderRadius:11,padding:`12px 16px`,fontSize:16,color:`var(--text)`,fontFamily:`inherit`,outline:`none`,transition:`border-color 0.2s, box-shadow 0.2s`,boxSizing:`border-box`},G=e=>{e.target.style.borderColor=`var(--gold-strong)`,e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.14)`},K=e=>{e.target.style.borderColor=`rgba(255,255,255,0.12)`,e.target.style.boxShadow=`none`},q=e=>String(e).padStart(2,`0`),he={dateEffet:``,duree:``,genre:``,marque:``,modele:``,immat:``,puissance:``,paysImmat:`France`,usage:``,nom:``,prenom:``,dateNaissance:``,datePermis:``,numPermis:``,paysResidence:`France`,adresse:``,codePostal:``,ville:``,condamnation:``,email:``,telephone:``,message:``,consentement:!1},J=`
  .ix-exp {
    position: relative;
    overflow: hidden;
    background: #0A0A0A;
    border-top: 1px solid var(--gold-border);
    border-bottom: 1px solid var(--gold-border);
    padding: 84px 0 96px;
  }

  /* ── Fond de l'ecran de remerciement (points d'ambiance uniquement) ── */
  .ix-sky { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .ix-globe-svg { width: 100%; height: auto; display: block; }
  .ix-globe-orbit {
    transform-box: fill-box;
    transform-origin: 120px 120px;
    animation: ix-orbit 34s linear infinite;
  }
  @keyframes ix-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .ix-dot { position: absolute; border-radius: 50%; background: #E8C97A; }

  .ix-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; padding: 0 24px; }

  /* ── En tete ───────────────────────────────────────────────────────── */
  .ix-head { margin-bottom: 26px; }
  .ix-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); margin: 0 0 14px;
  }
  .ix-title {
    font-size: clamp(1.75rem, 3.6vw, 2.4rem);
    font-weight: 700; letter-spacing: -0.025em; color: var(--text);
    margin: 0 0 14px; line-height: 1.12;
  }
  .ix-sub { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin: 0 0 16px; max-width: 600px; }
  .ix-orias {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--text-subtle); line-height: 1.5; margin: 0;
  }
  .ix-orias svg { color: var(--gold); flex-shrink: 0; }

  /* ── Fil de progression ────────────────────────────────────────────── */
  .ix-thread { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
  .ix-constellation { display: flex; align-items: center; gap: 12px; height: 14px; }
  .ix-cs {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold-light); box-shadow: 0 0 7px rgba(232,201,122,0.6);
    transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
  }
  .ix-step-label {
    font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em;
    color: var(--gold-light); margin: 0; font-variant-numeric: tabular-nums;
  }
  .ix-switch {
    margin-left: auto; background: none; border: none; font-family: inherit;
    font-size: 12px; color: var(--text-subtle); text-decoration: underline;
    text-underline-offset: 3px; cursor: pointer; padding: 4px 2px;
  }
  .ix-switch:hover { color: var(--gold-light); }

  /* ── La piste ──────────────────────────────────────────────────────── */
  .ix-stage { position: relative; }
  .ix-track { position: relative; }
  .ix-scene { position: relative; scroll-margin-top: 96px; }
  .ix-scene-inner { display: flex; flex-direction: column; gap: 18px; width: 100%; }

  /* En tete de scene */
  .ix-scene-head { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; }
  .ix-scene-icon {
    flex-shrink: 0; width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: var(--gold-light);
    background: linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04));
    border: 1px solid var(--gold-border);
  }
  .ix-scene-num {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
    color: var(--gold); font-variant-numeric: tabular-nums; margin-bottom: 3px;
  }
  .ix-scene-title { font-size: clamp(1.2rem, 2.4vw, 1.45rem); font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin: 0; line-height: 1.15; }

  .ix-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ix-row-13 { grid-template-columns: 1fr 2fr; }

  .ix-chip {
    padding: 8px 14px; border-radius: 999px; border: 1px solid;
    cursor: pointer; font-size: 13px; font-family: inherit;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  /* Recapitulatif */
  .ix-recap {
    display: flex; flex-direction: column; gap: 10px;
    padding: 16px 18px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border); border-radius: 13px;
  }
  .ix-recap-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin: 0; }
  .ix-recap-row { display: flex; align-items: baseline; gap: 10px; justify-content: space-between; }
  .ix-recap-label { font-size: 13px; color: var(--text-subtle); flex-shrink: 0; min-width: 92px; }
  .ix-recap-value { font-size: 13.5px; color: var(--text); text-align: right; flex: 1; line-height: 1.5; }
  .ix-recap-edit { background: none; border: none; padding: 0; cursor: pointer; color: var(--gold); font-size: 12.5px; font-family: inherit; flex-shrink: 0; }

  .ix-send-error {
    font-size: 14px; color: #e0a05c; background: rgba(224,160,92,0.08);
    border: 1px solid rgba(224,160,92,0.25); border-radius: 8px; padding: 12px 16px; margin: 0;
  }

  /* Navigation de scene */
  .ix-nav, .ix-submit-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 6px; }
  .ix-next { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; font-size: 15px; }
  .ix-submit { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; font-size: 15px; }
  .ix-back {
    display: inline-flex; align-items: center; gap: 6px; background: none; border: none;
    font-family: inherit; font-size: 14px; color: var(--text-muted); cursor: pointer; padding: 8px 4px;
  }
  .ix-back:hover { color: var(--gold-light); }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* ── Mode simple : vertical empile (SSR, sans JS, reduced-motion) ───── */
  .ix-mode-simple .ix-track { transform: none !important; display: flex; flex-direction: column; gap: 20px; }
  .ix-mode-simple .ix-scene {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--glass-border);
    border-radius: 18px; padding: 26px 24px;
  }
  .ix-mode-simple .ix-thread .ix-constellation { display: none; }

  /* ── Mode slider : cartes horizontales ─────────────────────────────── */
  .ix-mode-slider .ix-stage {
    overflow-x: clip; overflow-y: visible; touch-action: pan-y;
    border: 1px solid var(--glass-border); border-radius: 20px;
    background: rgba(255,255,255,0.02);
  }
  .ix-mode-slider .ix-track { display: flex; align-items: flex-start; width: calc(var(--ix-n) * 100%); }
  /* Chaque scene epouse la hauteur de SON contenu (align-self: flex-start =
     jamais etiree sur la scene la plus haute), contenu aligne en haut, pas de
     hauteur fixe. La hauteur de la carte est ensuite animee vers celle de la
     scene active (JS). Le padding (32/20) absorbe les focus rings, donc jamais
     de scroll interne ni de ring coupe. */
  .ix-mode-slider .ix-scene {
    flex: 0 0 calc(100% / var(--ix-n));
    align-self: flex-start;
    padding: 32px;
  }
  .ix-mode-slider .ix-scene-inner { width: 100%; }

  @media (max-width: 640px) {
    .ix-row, .ix-row-13 { grid-template-columns: 1fr !important; }
    .ix-mode-slider .ix-scene { padding: 20px; }
    .ix-mode-simple .ix-scene { padding: 22px 18px; }
    .ix-next, .ix-submit { flex: 1; justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ix-globe-orbit { animation: none; }
    .ix-cs { transition: none; }
  }

  /* ── Ecran de remerciement ─────────────────────────────────────────── */
  .ix-reward { padding: 120px 0 120px; }
  .ix-reward-inner { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; padding: 0 24px; text-align: center; }
  .ix-reward-globe { position: relative; width: clamp(200px, 44vw, 280px); margin: 0 auto 30px; }
  .ix-reward-globe .ix-globe-svg { opacity: 0.95; }
  .ix-reward-check {
    position: absolute; top: 50%; left: 50%;
    width: 62px; height: 62px; margin: -31px 0 0 -31px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; color: #0A0A0A;
    background: linear-gradient(180deg, #E8C97A, #C9A84C);
    box-shadow: 0 8px 30px rgba(201,168,76,0.5);
  }
  .ix-pulse {
    position: absolute; top: 50%; left: 50%; width: 62px; height: 62px;
    margin: -31px 0 0 -31px; border-radius: 50%;
    border: 1px solid var(--gold-light); opacity: 0;
  }
  .ix-pulse-run { animation: ix-pulse 2.6s var(--ease-out) 0.3s 2; }
  .ix-pulse-2.ix-pulse-run { animation-delay: 0.9s; }
  @keyframes ix-pulse {
    0% { opacity: 0.6; transform: scale(0.6); }
    70% { opacity: 0; transform: scale(3.6); }
    100% { opacity: 0; transform: scale(3.6); }
  }
  .ix-reward-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold); margin: 0 0 12px;
  }
  .ix-reward-title { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700; letter-spacing: -0.03em; color: var(--text); margin: 0 0 14px; }
  .ix-reward-text { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin: 0 auto 26px; max-width: 500px; }
  .ix-delai {
    display: flex; align-items: flex-start; gap: 14px; text-align: left;
    max-width: 520px; margin: 0 auto 26px; padding: 20px 22px;
    background: linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%);
    border: 1px solid var(--gold-strong); border-radius: 16px;
  }
  .ix-delai svg { color: var(--gold-light); flex-shrink: 0; margin-top: 2px; }
  .ix-delai-big { font-size: 16.5px; color: var(--text); line-height: 1.5; margin: 0 0 6px; }
  .ix-delai-big strong { color: var(--gold-light); font-weight: 700; }
  .ix-delai-sub { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin: 0; }
  .ix-reward-band { list-style: none; margin: 0 auto 28px; padding: 0; max-width: 520px; text-align: left; }
  .ix-reward-band li { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 12px; font-size: 14px; color: var(--text-muted); line-height: 1.55; }
  .ix-reward-band li svg { flex-shrink: 0; margin-top: 2px; }
  .ix-reward-links { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
  .ix-reward-link {
    display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px;
    background: var(--gold-glow); border: 1px solid var(--gold-border); border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: var(--gold-light); text-decoration: none;
    transition: border-color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
  }
  .ix-reward-link:hover { border-color: var(--gold-strong); transform: translateY(-1px); }

  @media (prefers-reduced-motion: reduce) {
    .ix-pulse-run { animation: none; }
  }
`}))();export{fe as default};