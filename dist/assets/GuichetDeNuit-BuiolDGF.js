import{a as e,n as t}from"./rolldown-runtime-Cyuzqnbw.js";import{A as n,C as r,_ as i,h as a,i as o,j as s,p as ee,s as te,t as c}from"./framer-Be3hPn0e.js";import{r as ne,t as l}from"./react-vendor-BDTje4YY.js";import{A as u,Er as d,Hn as re,Kn as ie,Kr as f,Mr as p,Rt as m,Xr as h,cn as g,en as _,fn as v,g as ae,it as y,mr as oe,or as se,ot as ce,t as le,wr as ue}from"./icons-DTR6_mEc.js";import{a as b,c as x,i as S,o as C,r as de,s as fe}from"./index-DvJq1EuG.js";import{n as w,t as pe}from"./Footer-DXlEILRq.js";import{n as T,t as me}from"./AnswerCapsule-ChLjiGry.js";function he(){try{return window.localStorage.getItem(I)||``}catch{return``}}function E(e){try{e?window.localStorage.setItem(I,e):window.localStorage.removeItem(I)}catch{}}async function ge(e){try{let t=await fetch(j,{method:`POST`,headers:{"content-type":`application/json`},body:JSON.stringify({reference:e})});if(!t.ok)return null;let n=await t.json();return n&&n.sessionId?n:null}catch{return null}}async function _e({sessionId:e,reference:t}){let n=e?`sessionId=${encodeURIComponent(e)}`:`reference=${encodeURIComponent(t||``)}`;try{let e=await(await fetch(`${M}?${n}`,{headers:{Accept:`application/json`}})).json().catch(()=>null);return!e||typeof e.found!=`boolean`?null:e.found?e:`introuvable`}catch{return null}}function ve(){try{let e=new Intl.DateTimeFormat(`fr-FR`,{timeZone:`Europe/Paris`,weekday:`short`,hour:`numeric`,hourCycle:`h23`}).formatToParts(new Date),t=e.find(e=>e.type===`weekday`)?.value||``,n=parseInt(e.find(e=>e.type===`hour`)?.value||`12`,10);if(t.startsWith(`dim`))return`c`;let r=t.startsWith(`sam`)?20:21;return n>=9&&n<r?`a`:`b`}catch{return`a`}}function ye(){let e;try{let t=new Intl.DateTimeFormat(`fr-FR`,{timeZone:`Europe/Paris`,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).formatToParts(new Date),n=e=>t.find(t=>t.type===e)?.value||``;e=`${n(`year`)}${n(`month`)}${n(`day`)}-${n(`hour`)}${n(`minute`)}`}catch{let t=new Date,n=e=>String(e).padStart(2,`0`);e=`${t.getFullYear()}${n(t.getMonth()+1)}${n(t.getDate())}-${n(t.getHours())}${n(t.getMinutes())}`}let t=``;for(let e=0;e<4;e+=1)t+=R[Math.floor(Math.random()*32)];return`GN-${e}-${t}`}function be(){try{return window.localStorage.getItem(L)||``}catch{return``}}function xe(e){try{e?window.localStorage.setItem(L,e):window.localStorage.removeItem(L)}catch{}}function Se(e){let t=Math.max(0,Math.ceil(e/1e3));return`${String(Math.floor(t/60)).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`}function D(e){return e?K.includes(e.status)?`pret`:e.finalized||e.remaining<=0?`finalisation`:`veille`:`veille`}function Ce({reference:e,session:t}){let[n,r]=(0,k.useState)(()=>D(t)),[i,a]=(0,k.useState)(()=>t?Math.max(0,t.remaining):P),[o,s]=(0,k.useState)(()=>t&&t.signatureUrl||``),[ee,te]=(0,k.useState)(()=>!!(t&&t.tarifPreferentiel)),c=(0,k.useRef)(n),l=(0,k.useRef)(null),u=(0,k.useRef)(null),d=(0,k.useRef)(t&&t.sessionId||``),re=(0,k.useCallback)(()=>(u.current===null&&(u.current=t?{startTime:t.startTime,duree:t.durationMs,offset:t.serverNow-Date.now()}:{startTime:Date.now(),duree:P,offset:0}),u.current),[t]),p=(0,k.useCallback)(()=>{if(c.current!==`veille`)return!1;let{startTime:e,duree:t,offset:n}=re(),i=t-(Date.now()+n-e);return i>0?(a(i),!1):(a(0),c.current=`finalisation`,r(`finalisation`),!0)},[re]),h=(0,k.useCallback)(e=>{u.current={startTime:e.startTime,duree:e.durationMs,offset:e.serverNow-Date.now()},e.sessionId&&(d.current=e.sessionId),s(typeof e.signatureUrl==`string`?e.signatureUrl:``),te(!!e.tarifPreferentiel);let t=D(e);t!==c.current&&(c.current=t,r(t),t===`pret`&&C(`guichet_signature_ready`,{statut:e.status,tarif_offert:!!e.tarifPreferentiel})),t===`veille`?p():a(Math.max(0,e.remaining))},[p]),g=(0,k.useCallback)(async()=>{if(c.current===`pret`)return;let t=d.current;if(!t&&!e)return;let n=await _e({sessionId:t,reference:e});if(n!==null){if(n===`introuvable`){E(``),c.current!==`pret`&&(c.current=`finalisation`,r(`finalisation`),a(0));return}h(n)}},[h,e]);(0,k.useEffect)(()=>{C(`guichet_countdown_start`,{source:d.current?`serveur`:`local`});let e=Date.now(),t=Date.now(),n=document.visibilityState===`visible`,r=(r=!1)=>{let i=Date.now(),a=i-e;if(e=i,document.visibilityState!==`visible`){n=!1;return}let o=r||!n||a>Oe;n=!0;let s=p(),ee=i-t>=De,te=i-t<ke;(s||o&&!te||ee)&&(t=i,g())},i=setInterval(()=>r(),N),a=()=>r(!0),o=e=>{e.persisted&&a()};return document.addEventListener(`visibilitychange`,a),window.addEventListener(`focus`,a),window.addEventListener(`pageshow`,o),r(),()=>{clearInterval(i),document.removeEventListener(`visibilitychange`,a),window.removeEventListener(`focus`,a),window.removeEventListener(`pageshow`,o)}},[p,g]),(0,k.useEffect)(()=>{typeof window>`u`||(window.scrollTo({top:0,left:0,behavior:`instant`}),l.current?.focus?.())},[]);let _=n===`veille`,v=_?Math.ceil(i/6e4):0;return(0,A.jsx)(`section`,{ref:l,tabIndex:-1,className:`gdn-final`,"aria-label":`Suivi de votre demande au guichet`,children:(0,A.jsxs)(`div`,{className:`gdn-final-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(m,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Demande déposée`]}),(0,A.jsxs)(`div`,{className:`gdn-ring`,role:`timer`,"aria-live":`off`,children:[(0,A.jsx)(`div`,{className:`gdn-ring-face`,"aria-hidden":`true`}),G.map(e=>(0,A.jsx)(`span`,{"aria-hidden":`true`,className:`gdn-ring-star`,style:{transform:e.transform,opacity:e.i<v?.85:.12}},e.i)),(0,A.jsx)(`div`,{className:_?`gdn-orbit`:`gdn-orbit gdn-orbit-off`,"aria-hidden":`true`,children:(0,A.jsx)(`span`,{className:`gdn-orbit-dot`})}),(0,A.jsxs)(`div`,{className:`gdn-ring-center`,children:[(0,A.jsx)(`span`,{className:`gdn-ring-time`,children:n===`pret`?`Prêt`:Se(i)}),(0,A.jsx)(`span`,{className:`gdn-ring-label`,children:n===`pret`?`contrat disponible`:`veille du guichet`})]})]}),(0,A.jsxs)(`div`,{style:{display:_?`block`:`none`},children:[(0,A.jsx)(`h2`,{className:`gdn-final-title`,children:`Votre demande est au guichet.`}),(0,A.jsx)(`p`,{className:`gdn-final-text`,children:`Notre équipe de nuit prépare votre contrat. Dès qu'il est prêt, vous recevez le lien de signature par mail et par SMS.`})]}),(0,A.jsxs)(`div`,{style:{display:n===`finalisation`?`block`:`none`},children:[(0,A.jsx)(`h2`,{className:`gdn-final-title`,children:`Votre conseiller met la dernière main à votre contrat.`}),(0,A.jsx)(`p`,{className:`gdn-final-text`,children:`Le lien arrive d'un instant à l'autre. Gardez un oeil sur vos mails, pensez aux indésirables.`})]}),(0,A.jsxs)(`div`,{style:{display:n===`pret`?`block`:`none`},children:[(0,A.jsx)(`h2`,{className:`gdn-final-title`,children:`Votre contrat est prêt.`}),(0,A.jsx)(`p`,{className:`gdn-final-text`,children:`Le lien de signature vient de partir par mail et par SMS.`}),o?(0,A.jsxs)(`a`,{href:o,target:`_blank`,rel:`noopener noreferrer`,className:`btn-gold`,style:{marginTop:22,fontSize:16,padding:`15px 30px`},children:[`Signer maintenant`,(0,A.jsx)(ie,{size:16,style:{marginLeft:8},"aria-hidden":`true`})]}):null]}),ee&&!_?(0,A.jsx)(`p`,{className:`gdn-final-text`,style:{color:`var(--gold-light)`},children:`Le guichet a mis plus de 30 minutes : la majoration de nuit vous est offerte, déjà déduite de votre devis.`}):null,e?(0,A.jsxs)(`p`,{className:`gdn-final-ref`,children:[`Référence de dossier `,(0,A.jsx)(`strong`,{children:e})]}):null,(0,A.jsxs)(`div`,{className:`gdn-final-band`,children:[(0,A.jsx)(`p`,{className:`gdn-band-title`,children:`Pendant que le guichet travaille`}),(0,A.jsx)(`ul`,{className:`gdn-band-list`,children:ze.map(({Icon:e,label:t})=>(0,A.jsxs)(`li`,{children:[(0,A.jsx)(e,{size:17,color:`var(--gold-light)`,strokeWidth:1.75,"aria-hidden":`true`}),(0,A.jsx)(`span`,{children:t})]},t))}),(0,A.jsx)(`div`,{className:`gdn-band-links`,children:Be.map(({title:e,to:t})=>(0,A.jsxs)(ne,{to:t,className:`gdn-band-link`,children:[e,(0,A.jsx)(f,{size:14,"aria-hidden":`true`})]},t))})]})]})})}function O(){let e=te(),[t,n]=(0,k.useState)(!1),[s,c]=(0,k.useState)(`step`),[l,ie]=(0,k.useState)(!1),m=!t||l||e?`simple`:s,g=(0,k.useRef)(m),_=(0,k.useRef)(0);(0,k.useEffect)(()=>{g.current=m},[m]),(0,k.useEffect)(()=>{if(e)return;let t=window.matchMedia(`(min-width: 1024px) and (pointer: fine)`),r=()=>c(t.matches?`rail`:`step`);return r(),n(!0),t.addEventListener(`change`,r),()=>t.removeEventListener(`change`,r)},[e]);let[v,y]=(0,k.useState)(0);(0,k.useEffect)(()=>{_.current=v},[v]);let[se,le]=(0,k.useState)(()=>new Set),[b,x]=(0,k.useState)(null),de=(0,k.useRef)(new Set),w=(0,k.useRef)(null),T=(0,k.useRef)(null),Se=(0,k.useRef)(null),D=(0,k.useRef)([]),O=(0,k.useRef)(0),j=(0,k.useRef)(0),M=ee(0);(0,k.useEffect)(()=>{let e=T.current;if(!e||typeof ResizeObserver>`u`)return;let t=new ResizeObserver(()=>{O.current=e.clientWidth;let t=g.current;t===`rail`?M.set(-j.current*H*O.current):t===`step`?M.set(-_.current*O.current):M.set(0)});return t.observe(e),()=>t.disconnect()},[M]);let{scrollYProgress:De}=a({target:w,offset:[`start start`,`end end`]});i(De,`change`,e=>{if(j.current=e,g.current!==`rail`)return;M.set(-e*H*O.current);let t=Fe(Math.round(e*H),0,H);t!==_.current&&y(t)}),(0,k.useEffect)(()=>{O.current=T.current?.clientWidth||0,m===`simple`?M.set(0):m===`step`?M.set(-_.current*O.current):M.set(-j.current*H*O.current)},[m,M]),(0,k.useEffect)(()=>{C(`guichet_page_view`)},[]),(0,k.useEffect)(()=>{de.current.has(v)||(de.current.add(v),C(`guichet_scene_view`,{scene_index:v,scene:B[v].key}))},[v]);let[N,Oe]=(0,k.useState)(`a`);(0,k.useEffect)(()=>{let e=()=>Oe(ve());e();let t=setInterval(e,6e4);return()=>clearInterval(t)},[]);let[ke,P]=(0,k.useState)(``),F=(0,k.useRef)(``);(0,k.useEffect)(()=>{let e=be(),t=e||ye();e||xe(t),F.current=t,P(t)},[]);let[I,L]=(0,k.useState)(`idle`),R=(0,k.useRef)(!1),[z,G]=(0,k.useState)(null);(0,k.useEffect)(()=>{let e=he();if(!e)return;let t=!0;return(async()=>{let n=await _e({sessionId:e});if(!(!t||n===null)){if(n===`introuvable`){E(``);return}if(n.finalized&&n.finalizedAt&&n.serverNow-n.finalizedAt>Ae){E(``);return}G(n),L(`success`),C(`guichet_session_reprise`)}})(),()=>{t=!1}},[]),(0,k.useEffect)(()=>{let e=e=>{e.preventDefault(),C(`guichet_js_error`,{type:`rejet`,message:String(e.reason||``).slice(0,120)})},t=e=>{C(`guichet_js_error`,{type:`erreur`,message:String(e.message||``).slice(0,120)})};return window.addEventListener(`unhandledrejection`,e),window.addEventListener(`error`,t),()=>{window.removeEventListener(`unhandledrejection`,e),window.removeEventListener(`error`,t)}},[]);let[K,Xe]=(0,k.useState)({permis_recto:``,permis_verso:``,carte_grise:``}),[Ze,Qe]=(0,k.useState)(!1),$e=(0,k.useRef)(!1),et=()=>{R.current||(R.current=!0,C(`guichet_form_start`))};function tt(e,t){let n=t.target.files&&t.target.files[0],r={...K,[e]:n?n.name:``};Xe(r),Qe(!1),!$e.current&&r.permis_recto&&r.permis_verso&&($e.current=!0,C(`guichet_form_files_added`))}let q=(0,k.useCallback)(t=>{let n=Fe(t,0,H),r=g.current;if(r===`rail`){let t=w.current;if(!t)return;let r=t.getBoundingClientRect().top+window.scrollY,i=t.offsetHeight-window.innerHeight;window.scrollTo({top:r+i*n/H,behavior:e?`instant`:`smooth`});return}if(r===`step`){y(n);let t=-n*O.current;e?M.set(t):o(M,t,{type:`spring`,stiffness:260,damping:34,restDelta:.5});return}y(n),D.current[n]?.scrollIntoView({behavior:e?`instant`:`smooth`,block:`start`})},[e,M]),nt=(0,k.useCallback)(e=>{let t=D.current[e];if(!t)return null;let n=t.querySelectorAll(`input, select, textarea`);for(let e of n)if(e.name!==`botcheck`&&!e.checkValidity())return e;return null},[]),J=(0,k.useCallback)((e,t,n)=>{if(x({scene:e,message:n||t?.validationMessage||`Complétez ce champ pour continuer.`}),!t)return;let r=0,i=()=>{if(r+=1,_.current!==e&&r<90){window.requestAnimationFrame(i);return}D.current[e]?.removeAttribute(`inert`),t.focus({preventScroll:!0}),t.reportValidity?.()};window.requestAnimationFrame(i)},[]),rt=(0,k.useCallback)(e=>{let t=nt(e);return t?(J(e,t),!1):e===5&&Ze?(J(e,null,`Vos photos dépassent 10 Mo au total.`),!1):(x(null),le(t=>{if(t.has(e))return t;let n=new Set(t);return n.add(e),n}),!0)},[Ze,nt,J]),it=(0,k.useCallback)(e=>rt(e)?(q(e+1),!0):!1,[q,rt]),Y=(0,k.useRef)(null),at=e=>{g.current!==`step`||I===`sending`||e.target.closest(`input, select, textarea, button, a, label`)||(Y.current={id:e.pointerId,x0:e.clientX,y0:e.clientY,base:M.get(),actif:!1})},ot=e=>{let t=Y.current;if(!t||t.id!==e.pointerId)return;let n=e.clientX-t.x0,r=e.clientY-t.y0;if(!t.actif){if(Math.abs(n)<12)return;if(Math.abs(n)<=Math.abs(r)){Y.current=null;return}t.actif=!0,T.current?.setPointerCapture?.(e.pointerId)}let i=O.current||1,a=-H*i,o=t.base+n;o>0?o*=.25:o<a&&(o=a+(o-a)*.25),M.set(o)},st=e=>{let t=Y.current;if(Y.current=null,!t||(T.current?.hasPointerCapture?.(e.pointerId)&&T.current.releasePointerCapture(e.pointerId),!t.actif))return;let n=e.clientX-t.x0,r=Math.min(90,(O.current||320)*.18),i=_.current;if(n<-r&&i<H){it(i)||q(i);return}if(n>r&&i>0){x(null),q(i-1);return}q(i)};async function ct(e){if(e.preventDefault(),I===`sending`)return;for(let e=1;e<=H;e+=1){let t=nt(e);if(t){q(e),J(e,t);return}}let t=Se.current,n=new FormData(t),r=0;for(let e of Me){let t=n.get(e);t instanceof File&&(t.size===0?n.delete(e):r+=t.size)}if(r>je){Qe(!0),q(5),J(5,null,`Vos photos dépassent 10 Mo au total.`);return}F.current&&n.set(`reference`,F.current),C(`guichet_form_submit`),L(`sending`);try{let e=await fetch(we,{method:`POST`,body:n}),t=await e.json().catch(()=>null);if(!e.ok||!t||t.success!==!0)throw Error(`envoi refuse`);xe(``);let r=await ge(F.current);r&&(E(r.sessionId),G(r)),L(`success`)}catch{L(`error`),q(H)}}let X=(t=0)=>e?{}:{initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:`-60px`},transition:{duration:.6,ease:[.22,1,.36,1],delay:t}},lt=m!==`simple`,ut=I===`success`,Z=e=>lt&&e!==v,Q=(e,t)=>(0,A.jsxs)(`div`,{className:`gdn-nav`,children:[e>0?(0,A.jsxs)(`button`,{type:`button`,className:`gdn-back`,onClick:()=>{x(null),q(e-1)},children:[(0,A.jsx)(h,{size:15,"aria-hidden":`true`}),`Retour`]}):(0,A.jsx)(`span`,{}),(0,A.jsxs)(`button`,{type:`button`,className:`btn-gold gdn-next`,onClick:()=>it(e),children:[t,(0,A.jsx)(f,{size:16,style:{marginLeft:8},"aria-hidden":`true`})]})]}),$=e=>(0,A.jsxs)(`p`,{role:`alert`,className:`gdn-scene-error`,style:{display:b&&b.scene===e?`flex`:`none`},children:[(0,A.jsx)(oe,{size:15,strokeWidth:2,"aria-hidden":`true`}),b&&b.scene===e?b.message:``]});return(0,A.jsxs)(A.Fragment,{children:[(0,A.jsxs)(fe,{children:[(0,A.jsx)(`title`,{children:qe}),(0,A.jsx)(`meta`,{name:`description`,content:Je}),(0,A.jsx)(`link`,{rel:`canonical`,href:`https://assutempo.fr/guichet-de-nuit`}),(0,A.jsx)(`meta`,{property:`og:title`,content:qe}),(0,A.jsx)(`meta`,{property:`og:description`,content:Je}),(0,A.jsx)(`meta`,{property:`og:url`,content:`https://assutempo.fr/guichet-de-nuit`}),(0,A.jsx)(`meta`,{property:`og:type`,content:`website`}),(0,A.jsx)(`meta`,{name:`twitter:card`,content:`summary`}),(0,A.jsx)(`script`,{type:`application/ld+json`,children:S(Ke)}),(0,A.jsx)(`script`,{type:`application/ld+json`,children:S(He)}),(0,A.jsx)(`script`,{type:`application/ld+json`,children:S(Ue)}),(0,A.jsx)(`script`,{type:`application/ld+json`,children:S(Ge)}),(0,A.jsx)(`script`,{type:`application/ld+json`,children:S(We)})]}),(0,A.jsxs)(`div`,{className:`gdn-page`,children:[ut?(0,A.jsx)(Ce,{reference:z&&z.reference||ke,session:z}):null,(0,A.jsx)(`div`,{id:`depot`,className:`gdn-exp gdn-mode-${m}`,style:{"--gdn-n":V,display:ut?`none`:`block`},children:(0,A.jsx)(`div`,{className:`gdn-rail`,ref:w,children:(0,A.jsxs)(`div`,{className:`gdn-stage`,ref:T,onPointerDown:at,onPointerMove:ot,onPointerUp:st,onPointerCancel:st,children:[(0,A.jsxs)(`div`,{className:`gdn-sky`,"aria-hidden":`true`,children:[Ne.map((e,t)=>(0,A.jsx)(`span`,{className:e.tw?`gdn-star gdn-star-tw`:`gdn-star`,style:{top:`${e.t}%`,left:`${e.l}%`,width:e.s,height:e.s,opacity:e.o,...e.tw?{"--gdn-twd":`${e.d}s`,"--gdn-twdl":`${e.dl}s`}:null}},t)),(0,A.jsxs)(`svg`,{className:`gdn-moon`,viewBox:`0 0 120 120`,children:[(0,A.jsxs)(`defs`,{children:[(0,A.jsxs)(`linearGradient`,{id:`gdn-moon-g`,x1:`0`,y1:`0`,x2:`1`,y2:`1`,children:[(0,A.jsx)(`stop`,{offset:`0`,stopColor:`#E8C97A`}),(0,A.jsx)(`stop`,{offset:`1`,stopColor:`#C9A84C`})]}),(0,A.jsxs)(`radialGradient`,{id:`gdn-moon-halo`,cx:`0.5`,cy:`0.5`,r:`0.5`,children:[(0,A.jsx)(`stop`,{offset:`0.4`,stopColor:`rgba(232,201,122,0.14)`}),(0,A.jsx)(`stop`,{offset:`1`,stopColor:`rgba(232,201,122,0)`})]}),(0,A.jsxs)(`mask`,{id:`gdn-moon-m`,children:[(0,A.jsx)(`rect`,{width:`120`,height:`120`,fill:`#fff`}),(0,A.jsx)(`circle`,{cx:`46`,cy:`52`,r:`40`,fill:`#000`})]})]}),(0,A.jsx)(`circle`,{cx:`60`,cy:`60`,r:`58`,fill:`url(#gdn-moon-halo)`}),(0,A.jsx)(`circle`,{cx:`60`,cy:`60`,r:`42`,fill:`url(#gdn-moon-g)`,mask:`url(#gdn-moon-m)`,opacity:`0.9`})]}),(0,A.jsx)(`div`,{className:`gdn-glow`})]}),(0,A.jsxs)(`div`,{className:`gdn-thread`,children:[(0,A.jsx)(`div`,{className:`gdn-constellation`,"aria-hidden":`true`,children:B.map((e,t)=>(0,A.jsx)(`span`,{className:`gdn-cs`,style:{opacity:t===v?1:t<v||se.has(t)?.55:.16,transform:t===v?`scale(1.6)`:`scale(1)`}},e.key))}),(0,A.jsx)(`p`,{className:`gdn-announce`,"aria-live":`polite`,children:lt?`Scène ${v+1} sur ${V} : ${B[v].label}`:``}),(0,A.jsx)(`button`,{type:`button`,className:`gdn-switch`,onClick:()=>{ie(!0),x(null)},children:`Passer à la version simple`})]}),(0,A.jsxs)(`form`,{ref:Se,className:`gdn-form`,onSubmit:ct,onFocusCapture:et,noValidate:!0,children:[(0,A.jsx)(`input`,{type:`hidden`,name:`access_key`,value:Te}),(0,A.jsx)(`input`,{type:`hidden`,name:`subject`,value:`GUICHET DE NUIT - nouvelle demande`}),(0,A.jsx)(`input`,{type:`hidden`,name:`from_name`,value:`Le Guichet de Nuit`}),(0,A.jsx)(`input`,{type:`checkbox`,name:`botcheck`,tabIndex:-1,autoComplete:`off`,"aria-hidden":`true`,className:`gdn-honey`}),(0,A.jsxs)(r.div,{className:`gdn-track`,style:{x:M},children:[(0,A.jsx)(`section`,{className:`gdn-scene gdn-scene-hero`,ref:e=>{D.current[0]=e},"aria-label":`Le Guichet de Nuit`,inert:Z(0)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner gdn-hero-inner`,children:[(0,A.jsx)(`span`,{className:`gdn-badge`,children:`Ouvert quand tout est fermé`}),(0,A.jsx)(`h1`,{className:`gdn-h1`,children:`Le Guichet de Nuit`}),(0,A.jsx)(`p`,{className:`gdn-lead`,children:`Après 21h, plus aucune assurance temporaire ne peut vous couvrir. Notre équipe de nuit, si.`}),(0,A.jsx)(`p`,{className:`gdn-sub`,children:`Sortie de fourrière à l'aube, voiture achetée un dimanche soir, départ imprévu au petit matin : le Guichet de Nuit prépare votre contrat pendant que tout le monde dort, et vous roulez assuré.`}),(0,A.jsxs)(`button`,{type:`button`,className:`btn-gold gdn-open`,onClick:()=>q(1),children:[`Ouvrir le guichet`,(0,A.jsx)(f,{size:17,style:{marginLeft:8},"aria-hidden":`true`})]}),(0,A.jsxs)(`div`,{role:`status`,className:`gdn-etat`,children:[(0,A.jsxs)(`div`,{style:{display:N===`a`?`block`:`none`},children:[`La souscription en ligne classique est ouverte.`,` `,(0,A.jsx)(ne,{to:`/tarification`,className:`gdn-etat-link`,children:`Obtenir mon devis maintenant`}),(0,A.jsx)(`span`,{className:`gdn-etat-note`,children:`Le Guichet de Nuit ouvre à 21h.`})]}),(0,A.jsxs)(`div`,{className:`gdn-etat-live`,style:{display:N===`b`?`flex`:`none`},children:[(0,A.jsx)(`span`,{className:`gdn-dot`,"aria-hidden":`true`}),`Le Guichet de Nuit est ouvert. Devis et contrat en pleine nuit.`]}),(0,A.jsx)(`div`,{style:{display:N===`c`?`block`:`none`,color:`var(--text)`},children:`Dimanche : le Guichet de Nuit assure la permanence toute la journée.`})]})]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[1]=e},inert:Z(1)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(ae,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 1 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Qui êtes-vous ?`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`Le guichet vous rappelle uniquement si votre dossier demande une précision.`}),(0,A.jsxs)(`div`,{className:`gdn-grid`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-prenom`,className:`gdn-label`,children:`Prénom`}),(0,A.jsx)(`input`,{id:`gdn-prenom`,name:`prenom`,type:`text`,required:!0,autoComplete:`given-name`,className:`gdn-input`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-nom`,className:`gdn-label`,children:`Nom`}),(0,A.jsx)(`input`,{id:`gdn-nom`,name:`nom`,type:`text`,required:!0,autoComplete:`family-name`,className:`gdn-input`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-tel`,className:`gdn-label`,children:`Téléphone mobile`}),(0,A.jsx)(`input`,{id:`gdn-tel`,name:`telephone`,type:`tel`,inputMode:`tel`,required:!0,autoComplete:`tel`,className:`gdn-input`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-email`,className:`gdn-label`,children:`Email`}),(0,A.jsx)(`input`,{id:`gdn-email`,name:`email`,type:`email`,inputMode:`email`,required:!0,autoComplete:`email`,spellCheck:!1,pattern:`[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}`,className:`gdn-input`,"aria-describedby":`gdn-email-note`}),(0,A.jsx)(`p`,{id:`gdn-email-note`,className:`gdn-note`,children:`Vérifiez bien votre email : votre devis et votre lien de signature y seront envoyés.`})]})]}),$(1),Q(1,`Continuer`)]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[2]=e},inert:Z(2)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(ue,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 2 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Votre véhicule`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`La plaque suffit : le guichet retrouve le reste sur la carte grise.`}),(0,A.jsxs)(`div`,{className:`gdn-grid`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-immat`,className:`gdn-label`,children:`Immatriculation`}),(0,A.jsx)(`input`,{id:`gdn-immat`,name:`immatriculation`,type:`text`,required:!0,placeholder:`AB-123-CD`,autoCapitalize:`characters`,autoCorrect:`off`,spellCheck:!1,className:`gdn-input gdn-immat`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-vehicule`,className:`gdn-label`,children:`Marque et modèle`}),(0,A.jsx)(`input`,{id:`gdn-vehicule`,name:`vehicule`,type:`text`,required:!0,placeholder:`Renault Clio`,className:`gdn-input`})]})]}),$(2),Q(2,`Continuer`)]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[3]=e},inert:Z(3)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(p,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 3 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Votre besoin`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`Indiquez le moment exact où le véhicule doit être couvert, même en pleine nuit.`}),(0,A.jsxs)(`div`,{className:`gdn-grid`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-motif`,className:`gdn-label`,children:`Motif`}),(0,A.jsxs)(`select`,{id:`gdn-motif`,name:`motif`,required:!0,defaultValue:``,className:`gdn-input`,children:[(0,A.jsx)(`option`,{value:``,disabled:!0,children:`Choisir un motif`}),(0,A.jsx)(`option`,{value:`Sortie de fourrière`,children:`Sortie de fourrière`}),(0,A.jsx)(`option`,{value:`Achat ou vente`,children:`Achat ou vente`}),(0,A.jsx)(`option`,{value:`Autre`,children:`Autre`})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-duree`,className:`gdn-label`,children:`Durée souhaitée`}),(0,A.jsxs)(`select`,{id:`gdn-duree`,name:`duree`,required:!0,defaultValue:``,className:`gdn-input`,children:[(0,A.jsx)(`option`,{value:``,disabled:!0,children:`Choisir une durée`}),Ie.map(e=>(0,A.jsxs)(`option`,{value:`${e} jour${e===`1`?``:`s`}`,children:[e,` jour`,e===`1`?``:`s`]},e))]})]}),(0,A.jsxs)(`div`,{className:`gdn-full`,children:[(0,A.jsx)(`label`,{htmlFor:`gdn-debut`,className:`gdn-label`,children:`Date et heure auxquelles vous devez être couvert`}),(0,A.jsx)(`input`,{id:`gdn-debut`,name:`debut_couverture`,type:`datetime-local`,required:!0,className:`gdn-input`})]})]}),$(3),Q(3,`Continuer`)]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[4]=e},inert:Z(4)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(ce,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 4 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Deux questions rapides`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`Elles servent à établir un devis juste. Une réponse honnête évite un refus après paiement.`}),(0,A.jsxs)(`fieldset`,{className:`gdn-fieldset`,children:[(0,A.jsx)(`legend`,{className:`gdn-label`,children:`Avez-vous eu un accident ou un sinistre dans les dernières 24 heures ?`}),(0,A.jsxs)(`div`,{className:`gdn-radios`,children:[(0,A.jsxs)(`label`,{className:`gdn-radio`,children:[(0,A.jsx)(`input`,{type:`radio`,name:`sinistre_24h`,value:`Oui`,required:!0}),` Oui`]}),(0,A.jsxs)(`label`,{className:`gdn-radio`,children:[(0,A.jsx)(`input`,{type:`radio`,name:`sinistre_24h`,value:`Non`}),` Non`]})]})]}),(0,A.jsxs)(`fieldset`,{className:`gdn-fieldset`,children:[(0,A.jsx)(`legend`,{className:`gdn-label`,children:`Avez-vous déjà été résilié par un assureur ou eu un retrait de permis ces 5 dernières années ?`}),(0,A.jsxs)(`div`,{className:`gdn-radios`,children:[(0,A.jsxs)(`label`,{className:`gdn-radio`,children:[(0,A.jsx)(`input`,{type:`radio`,name:`resilie_ou_retrait`,value:`Oui`,required:!0}),` Oui`]}),(0,A.jsxs)(`label`,{className:`gdn-radio`,children:[(0,A.jsx)(`input`,{type:`radio`,name:`resilie_ou_retrait`,value:`Non`}),` Non`]})]})]}),$(4),Q(4,`Continuer`)]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[5]=e},inert:Z(5)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(d,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 5 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Vos 3 photos`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`Une photo nette prise avec votre téléphone suffit. Elles partent avec la demande.`}),(0,A.jsxs)(`div`,{className:`gdn-files`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-permis-recto`,className:`gdn-label`,children:`Permis de conduire, recto`}),(0,A.jsx)(`input`,{id:`gdn-permis-recto`,name:`permis_recto`,type:`file`,required:!0,accept:`image/*,.pdf`,capture:`environment`,onChange:e=>tt(`permis_recto`,e),className:`gdn-input gdn-file`}),(0,A.jsx)(`p`,{className:`gdn-note gdn-filename`,style:{display:K.permis_recto?`block`:`none`},children:K.permis_recto})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{htmlFor:`gdn-permis-verso`,className:`gdn-label`,children:`Permis de conduire, verso`}),(0,A.jsx)(`input`,{id:`gdn-permis-verso`,name:`permis_verso`,type:`file`,required:!0,accept:`image/*,.pdf`,capture:`environment`,onChange:e=>tt(`permis_verso`,e),className:`gdn-input gdn-file`}),(0,A.jsx)(`p`,{className:`gdn-note gdn-filename`,style:{display:K.permis_verso?`block`:`none`},children:K.permis_verso})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`label`,{htmlFor:`gdn-carte-grise`,className:`gdn-label`,children:[`Carte grise du véhicule `,(0,A.jsx)(`span`,{style:{color:`var(--text-subtle)`},children:`(facultatif)`})]}),(0,A.jsx)(`input`,{id:`gdn-carte-grise`,name:`carte_grise`,type:`file`,accept:`image/*,.pdf`,capture:`environment`,onChange:e=>tt(`carte_grise`,e),className:`gdn-input gdn-file`,"aria-describedby":`gdn-carte-grise-note`}),(0,A.jsx)(`p`,{className:`gdn-note gdn-filename`,style:{display:K.carte_grise?`block`:`none`},children:K.carte_grise}),(0,A.jsx)(`p`,{id:`gdn-carte-grise-note`,className:`gdn-note`,children:`Pas sous la main, par exemple restée dans le véhicule en fourrière ? Envoyez-la plus tard en répondant au mail de confirmation.`})]}),(0,A.jsx)(`p`,{role:`alert`,className:`gdn-toobig`,style:{display:Ze?`block`:`none`},children:`Vos photos dépassent 10 Mo au total. Reprenez la plus lourde en photo simple, sans mode haute définition, puis déposez-la de nouveau.`})]}),$(5),Q(5,`Continuer`)]})}),(0,A.jsx)(`section`,{className:`gdn-scene`,ref:e=>{D.current[6]=e},inert:Z(6)||void 0,children:(0,A.jsxs)(`div`,{className:`gdn-scene-inner`,children:[(0,A.jsxs)(`p`,{className:`gdn-eyebrow`,children:[(0,A.jsx)(re,{size:13,strokeWidth:2,"aria-hidden":`true`}),`Étape 6 sur 6`]}),(0,A.jsx)(`h2`,{className:`gdn-h2`,children:`Dernière étape`}),(0,A.jsx)(`p`,{className:`gdn-scene-sub`,children:`Aucun paiement ici. Le tarif de nuit tout compris sera indiqué sur votre devis, avant toute signature.`}),(0,A.jsxs)(`label`,{className:`gdn-check`,children:[(0,A.jsx)(`input`,{type:`checkbox`,name:`consentement_rgpd`,value:`Oui`,required:!0}),(0,A.jsx)(`span`,{children:`J'accepte que mes données soient utilisées uniquement pour établir mon devis. Elles ne sont jamais revendues.`})]}),(0,A.jsxs)(`label`,{className:`gdn-check`,children:[(0,A.jsx)(`input`,{type:`checkbox`,name:`acceptation_tarif_nuit`,value:`Oui`,required:!0}),(0,A.jsx)(`span`,{children:`J'ai compris que le tarif de nuit tout compris sera indiqué sur mon devis, avant tout paiement.`})]}),$(6),(0,A.jsx)(`button`,{type:`submit`,className:`btn-gold gdn-submit`,disabled:I===`sending`,style:{opacity:I===`sending`?.7:1},children:I===`sending`?`Dépôt en cours`:`Déposer ma demande au guichet`}),(0,A.jsxs)(`p`,{role:`alert`,className:`gdn-send-error`,style:{display:I===`error`?`block`:`none`},children:[`L'envoi n'a pas abouti. Écrivez directement au guichet :`,` `,(0,A.jsx)(`a`,{href:`mailto:${Ee}?subject=GUICHET%20DE%20NUIT%20-%20nouvelle%20demande`,children:Ee}),`. Joignez vos informations et vos photos au mail, votre demande sera traitée de la même façon.`]}),(0,A.jsx)(`div`,{className:`gdn-back-wrap`,children:(0,A.jsxs)(`button`,{type:`button`,className:`gdn-back`,onClick:()=>{x(null),q(5)},children:[(0,A.jsx)(h,{size:15,"aria-hidden":`true`}),`Retour`]})})]})})]})]}),l&&t&&!e?(0,A.jsx)(`div`,{className:`gdn-switch-back`,children:(0,A.jsx)(`button`,{type:`button`,className:`gdn-switch`,onClick:()=>{ie(!1),x(null)},children:`Revenir à l'expérience guidée`})}):null]})})}),(0,A.jsx)(`section`,{style:{padding:`88px 24px 72px`},children:(0,A.jsx)(`div`,{style:{maxWidth:860,margin:`0 auto`},children:(0,A.jsx)(me,{capsule:Le})})}),(0,A.jsx)(`section`,{style:{padding:`0 24px 88px`},children:(0,A.jsxs)(`div`,{style:{maxWidth:760,margin:`0 auto`},children:[(0,A.jsxs)(r.div,{...X(),children:[(0,A.jsx)(`h2`,{style:{...W,fontSize:`clamp(1.4rem, 2.8vw, 1.9rem)`},children:`Peut-on souscrire une assurance temporaire la nuit ?`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,lineHeight:1.8,margin:`0 0 36px`},children:`Oui. Le Guichet de Nuit reçoit les demandes de 21h à 9h du lundi au samedi, et sans interruption le dimanche. Vous remplissez le formulaire, vous joignez vos trois photos, un conseiller prépare le contrat et vous renvoie un devis dans les 30 minutes. La signature se fait en ligne, l'attestation arrive par mail dès le paiement : rien à imprimer, personne à rappeler le lendemain matin.`})]}),(0,A.jsxs)(r.div,{...X(),children:[(0,A.jsx)(`h2`,{style:{...W,fontSize:`clamp(1.4rem, 2.8vw, 1.9rem)`},children:`Et le dimanche, ou un jour férié ?`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,lineHeight:1.8,margin:`0 0 36px`},children:`Le guichet assure la permanence toute la journée du dimanche, et les jours fériés suivent le même régime. Ce sont précisément les journées où la souscription en ligne classique est fermée, et où une sortie de fourrière ou une vente entre particuliers vous laisse devant un véhicule que vous n'avez pas le droit de conduire.`})]}),(0,A.jsxs)(r.div,{...X(),children:[(0,A.jsx)(`h2`,{style:{...W,fontSize:`clamp(1.4rem, 2.8vw, 1.9rem)`},children:`Que faire en attendant votre attestation ?`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,lineHeight:1.8,margin:`0 0 16px`},children:`Ne prenez pas le volant. L'assurance de responsabilité civile est obligatoire dès le premier mètre parcouru, même pour un trajet de cinq minutes, et rouler sans assurance expose à une amende et à l'immobilisation du véhicule. Tant que votre attestation n'est pas arrivée, laissez le véhicule où il est : c'est le conseil le moins cher que nous puissions vous donner.`}),(0,A.jsxs)(ne,{to:`/articles/controle-sans-assurance-risques-amende`,className:`gdn-inline-link`,children:[`Ce que risque un conducteur non assuré`,(0,A.jsx)(f,{size:14,strokeWidth:2,"aria-hidden":`true`})]})]})]})}),(0,A.jsx)(`section`,{style:{padding:`88px 24px`},children:(0,A.jsxs)(`div`,{style:{maxWidth:1060,margin:`0 auto`},children:[(0,A.jsxs)(r.div,{...X(),style:{textAlign:`center`,marginBottom:56},children:[(0,A.jsx)(`h2`,{style:W,children:`Comment ça marche ?`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,margin:0},children:`Trois étapes, tout par mail et SMS, depuis votre téléphone.`})]}),(0,A.jsx)(`div`,{className:`gdn-cards-3`,children:Re.map((e,t)=>(0,A.jsxs)(r.div,{id:`etape-${t+1}`,...X(t*.12),style:{...U,textAlign:`center`},children:[(0,A.jsx)(`div`,{className:`gdn-step-icon`,children:(0,A.jsx)(e.Icon,{size:23,color:`var(--gold-light)`,strokeWidth:1.5,"aria-hidden":`true`})}),(0,A.jsx)(`div`,{style:{fontSize:12,fontWeight:700,color:`var(--gold-light)`,letterSpacing:`0.15em`,marginBottom:10},children:e.num}),(0,A.jsx)(`h3`,{style:{fontSize:18,fontWeight:600,color:`var(--text)`,margin:`0 0 10px`},children:e.title}),(0,A.jsx)(`p`,{style:{fontSize:14.5,color:`var(--text-muted)`,lineHeight:1.65,margin:0},children:e.body})]},e.num))})]})}),(0,A.jsx)(`section`,{style:{padding:`8px 24px 88px`},children:(0,A.jsxs)(r.div,{...X(),style:{maxWidth:860,margin:`0 auto`,position:`relative`,textAlign:`center`,background:`linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)`,border:`1px solid var(--gold-strong)`,borderRadius:22,padding:`44px 32px`,overflow:`hidden`},children:[(0,A.jsx)(`span`,{"aria-hidden":`true`,style:{position:`absolute`,top:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent, var(--gold-light), transparent)`}}),(0,A.jsx)(u,{size:30,color:`var(--gold-light)`,strokeWidth:1.5,"aria-hidden":`true`}),(0,A.jsx)(`h2`,{style:{...W,margin:`16px 0 12px`},children:`Devis en 30 minutes ou tarif de jour`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,lineHeight:1.7,maxWidth:620,margin:`0 auto`},children:`Si le guichet met plus de 30 minutes à vous répondre une fois votre demande complète déposée, photos comprises, la majoration de nuit est offerte.`})]})}),(0,A.jsx)(`section`,{style:{padding:`0 24px 88px`},children:(0,A.jsxs)(`div`,{style:{maxWidth:860,margin:`0 auto`},children:[(0,A.jsxs)(r.div,{...X(),children:[(0,A.jsx)(`h2`,{style:{...W,textAlign:`center`},children:`L'équipe de nuit`}),(0,A.jsx)(`p`,{style:{fontSize:16,color:`var(--text-muted)`,lineHeight:1.8,textAlign:`center`,maxWidth:680,margin:`0 auto 40px`},children:`Pendant que les plateformes affichent des horaires de bureau, notre guichet reste allumé. Chaque dossier de nuit est préparé puis validé par un conseiller, du devis jusqu'à l'attestation dans votre boîte mail. Les demandes sont traitées dans leur ordre d'arrivée ; un dossier inhabituel peut demander un échange de plus, et dans ce cas le guichet vous prévient tout de suite par mail.`})]}),(0,A.jsx)(`div`,{className:`gdn-cards-3`,children:ze.map(({Icon:e,label:t},n)=>(0,A.jsxs)(r.div,{...X(n*.1),style:{display:`flex`,alignItems:`flex-start`,gap:12,background:`rgba(10, 13, 28, 0.45)`,border:`1px solid var(--glass-border)`,borderRadius:14,padding:`18px 18px`},children:[(0,A.jsx)(e,{size:19,color:`var(--gold-light)`,strokeWidth:1.75,style:{flexShrink:0,marginTop:2},"aria-hidden":`true`}),(0,A.jsx)(`span`,{style:{fontSize:14,color:`var(--text-muted)`,lineHeight:1.55},children:t})]},t))})]})}),(0,A.jsx)(`section`,{style:{padding:`0 24px 96px`},children:(0,A.jsxs)(`div`,{style:{maxWidth:1060,margin:`0 auto`},children:[(0,A.jsx)(r.div,{...X(),style:{textAlign:`center`,marginBottom:48},children:(0,A.jsx)(`h2`,{style:W,children:`Ils arrivent au guichet pour`})}),(0,A.jsx)(`div`,{className:`gdn-cards-3`,children:Be.map(({Icon:e,title:t,body:n,to:i,cta:a},o)=>(0,A.jsxs)(r.div,{...X(o*.12),style:{...U,display:`flex`,flexDirection:`column`},children:[(0,A.jsx)(e,{size:22,color:`var(--gold-light)`,strokeWidth:1.5,"aria-hidden":`true`}),(0,A.jsx)(`h3`,{style:{fontSize:17,fontWeight:600,color:`var(--text)`,margin:`14px 0 10px`},children:t}),(0,A.jsx)(`p`,{style:{fontSize:14.5,color:`var(--text-muted)`,lineHeight:1.65,margin:`0 0 18px`,flex:1},children:n}),(0,A.jsxs)(ne,{to:i,className:`gdn-card-link`,children:[a,(0,A.jsx)(f,{size:14,"aria-hidden":`true`})]})]},t))})]})}),(0,A.jsx)(`section`,{style:{padding:`0 24px 96px`},children:(0,A.jsxs)(`div`,{style:{maxWidth:1060,margin:`0 auto`},children:[(0,A.jsxs)(r.div,{...X(),style:{textAlign:`center`,marginBottom:48},children:[(0,A.jsx)(`p`,{style:{fontSize:12,letterSpacing:`0.2em`,textTransform:`uppercase`,color:`var(--gold)`,marginBottom:14},children:`QUESTIONS FRÉQUENTES`}),(0,A.jsx)(`h2`,{style:W,children:`Vos questions sur le Guichet de Nuit`})]}),(0,A.jsx)(`div`,{className:`gdn-faq`,children:Ve.map(e=>(0,A.jsxs)(r.div,{...X(),style:U,children:[(0,A.jsx)(`h3`,{style:{fontSize:16.5,fontWeight:600,color:`var(--text)`,margin:`0 0 10px`,lineHeight:1.4},children:e.q}),(0,A.jsx)(`p`,{style:{fontSize:14.5,color:`var(--text-muted)`,lineHeight:1.7,margin:0},children:e.a})]},e.q))}),(0,A.jsxs)(`p`,{style:{textAlign:`center`,fontSize:13,color:`var(--text-subtle)`,margin:`40px 0 0`},children:[`Page mise à jour le `,Pe,`.`]})]})})]}),(0,A.jsx)(pe,{}),(0,A.jsx)(`style`,{children:`
        .gdn-page {
          background: linear-gradient(180deg, #05060F 0%, #060810 42%, #0A0A0A 100%);
        }

        /* ── Ciel ─────────────────────────────────────────────────────── */
        .gdn-sky {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .gdn-star {
          position: absolute;
          border-radius: 50%;
          background: #E8C97A;
          pointer-events: none;
        }
        @keyframes gdn-twinkle {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.75; }
        }
        .gdn-star-tw {
          animation: gdn-twinkle var(--gdn-twd, 5s) ease-in-out var(--gdn-twdl, 0s) infinite;
        }
        .gdn-moon {
          position: absolute;
          top: 96px;
          right: 6%;
          width: clamp(58px, 8vw, 96px);
          height: auto;
        }
        .gdn-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 34% at 50% 100%, rgba(201,168,76,0.09) 0%, transparent 70%);
        }
        .gdn-dot {
          flex-shrink: 0;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 8px rgba(232, 201, 122, 0.8);
          animation: gdn-pulse 2.4s ease-in-out infinite;
        }
        @keyframes gdn-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        /* ── L'experience : ossature commune ──────────────────────────── */
        .gdn-exp { position: relative; }
        .gdn-rail { position: relative; }
        .gdn-stage { position: relative; }
        .gdn-form { position: relative; z-index: 1; width: 100%; }
        .gdn-track { position: relative; z-index: 1; }
        .gdn-scene { position: relative; scroll-margin-top: 90px; }
        .gdn-scene-inner {
          position: relative;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Mode simple : le rendu du serveur, le sans-JS, le reduced-motion.
              Formulaire vertical empile, aucune transformation. ─────────── */
        .gdn-mode-simple .gdn-track {
          transform: none !important;
          display: block;
          width: 100%;
        }
        .gdn-mode-simple .gdn-stage { padding: 0 0 40px; }
        .gdn-mode-simple .gdn-scene { padding: 0 24px 64px; }
        .gdn-mode-simple .gdn-scene-hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 120px;
          padding-bottom: 80px;
          text-align: center;
        }
        .gdn-mode-simple .gdn-thread { display: none; }
        .gdn-mode-simple .gdn-nav { display: none; }
        .gdn-mode-simple .gdn-back-wrap { display: none; }
        .gdn-mode-simple .gdn-scene-inner { max-width: 640px; }
        .gdn-mode-simple .gdn-hero-inner { max-width: 720px; }

        /* ── Mode rail : scrollytelling horizontal (desktop) ───────────── */
        .gdn-mode-rail .gdn-rail { height: calc(var(--gdn-n) * 100svh); }
        .gdn-mode-rail .gdn-stage {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .gdn-mode-rail .gdn-track {
          display: flex;
          width: calc(var(--gdn-n) * 100%);
        }
        .gdn-mode-rail .gdn-scene {
          flex: 0 0 calc(100% / var(--gdn-n));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 96px 32px 92px;
          min-height: 100svh;
        }
        .gdn-mode-rail .gdn-scene-inner {
          max-height: calc(100svh - 200px);
          overflow-y: auto;
        }
        .gdn-mode-rail .gdn-scene-hero { text-align: center; }
        .gdn-mode-rail .gdn-thread {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 26px;
          z-index: 2;
        }

        /* ── Mode step : stepper plein ecran (tactile) ─────────────────────
              Aucun detournement du scroll : la page defile normalement, le
              clavier n'est jamais masque (pas de conteneur a hauteur figee,
              pas de position fixed). overflow-x: clip ne cree PAS de conteneur
              de defilement : le navigateur reste libre d'amener un champ
              focalise a l'ecran. ────────────────────────────────────────── */
        .gdn-mode-step .gdn-stage {
          padding: 92px 0 40px;
          overflow-x: clip;
          overflow-y: visible;
          touch-action: pan-y;
        }
        .gdn-mode-step .gdn-thread {
          position: relative;
          z-index: 2;
          margin: 0 auto 20px;
        }
        .gdn-mode-step .gdn-track {
          display: flex;
          width: calc(var(--gdn-n) * 100%);
        }
        .gdn-mode-step .gdn-scene {
          flex: 0 0 calc(100% / var(--gdn-n));
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8px 20px 24px;
          min-height: calc(100svh - 220px);
        }
        .gdn-mode-step .gdn-scene-hero { text-align: center; }

        /* ── Fil de progression ───────────────────────────────────────── */
        .gdn-thread { text-align: center; }
        .gdn-constellation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          height: 14px;
        }
        .gdn-cs {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 6px rgba(232, 201, 122, 0.6);
          transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
        }
        .gdn-announce {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .gdn-switch {
          margin-top: 10px;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 12px;
          color: var(--text-subtle);
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          padding: 4px 8px;
        }
        .gdn-switch:hover { color: var(--gold-light); }
        .gdn-switch-back { text-align: center; padding: 8px 24px 0; }

        /* ── Scenes : typographie ─────────────────────────────────────── */
        .gdn-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 999px;
          padding: 8px 18px;
          margin-bottom: 24px;
        }
        .gdn-h1 {
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 0 0 20px;
        }
        .gdn-lead {
          font-size: clamp(17px, 2.4vw, 21px);
          font-weight: 500;
          color: var(--gold-light);
          line-height: 1.5;
          margin: 0 auto 18px;
          max-width: 620px;
        }
        .gdn-sub {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.75;
          margin: 0 auto 32px;
          max-width: 600px;
        }
        .gdn-open { font-size: 16px; padding: 16px 32px; }
        .gdn-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 12px;
        }
        .gdn-h2 {
          font-size: clamp(1.7rem, 3.6vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin: 0 0 10px;
        }
        .gdn-scene-sub {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0 0 28px;
          max-width: 560px;
        }
        .gdn-mode-simple .gdn-scene-hero .gdn-scene-sub,
        .gdn-mode-rail .gdn-scene-hero .gdn-scene-sub { margin-left: auto; margin-right: auto; }

        /* ── Etat du guichet ──────────────────────────────────────────── */
        .gdn-etat {
          margin: 30px auto 0;
          max-width: 560px;
          background: rgba(8, 10, 22, 0.55);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .gdn-etat-link { color: var(--gold-light); text-decoration: underline; }
        .gdn-etat-note {
          display: block;
          margin-top: 4px;
          font-size: 13px;
          color: var(--text-subtle);
        }
        .gdn-etat-live {
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text);
        }

        /* ── Champs ───────────────────────────────────────────────────── */
        .gdn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 16px;
        }
        .gdn-full { grid-column: 1 / -1; }
        @media (max-width: 640px) {
          .gdn-grid { grid-template-columns: 1fr; }
        }
        .gdn-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 7px;
        }
        .gdn-input {
          width: 100%;
          font-family: inherit;
          font-size: 16px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 11px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gdn-input:focus {
          border-color: var(--gold-strong);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.14);
        }
        .gdn-input::placeholder { color: var(--text-subtle); }
        .gdn-immat { text-transform: uppercase; letter-spacing: 0.06em; }
        select.gdn-input { appearance: auto; background-color: rgba(255,255,255,0.04); }
        select.gdn-input option { background: #0A0C1A; color: var(--text); }
        input.gdn-input[type="datetime-local"] { color-scheme: dark; }
        .gdn-note {
          font-size: 12.5px;
          color: var(--text-subtle);
          line-height: 1.5;
          margin: 7px 0 0;
        }
        .gdn-filename { color: var(--gold-light); }
        .gdn-fieldset {
          border: none;
          margin: 0 0 22px;
          padding: 0;
        }
        .gdn-fieldset legend { padding: 0; }
        .gdn-radios { display: flex; gap: 26px; margin-top: 6px; }
        .gdn-radio {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: var(--text);
          cursor: pointer;
        }
        .gdn-radio input, .gdn-check input { accent-color: var(--gold); width: 17px; height: 17px; }
        .gdn-check {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .gdn-check input { flex-shrink: 0; margin-top: 2px; }
        .gdn-files {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 20px 18px;
        }
        .gdn-file {
          padding: 10px 12px;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
        }
        .gdn-file::file-selector-button {
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 9px;
          padding: 8px 14px;
          margin-right: 12px;
          cursor: pointer;
        }
        .gdn-toobig {
          margin: 4px 0 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 11px;
          padding: 12px 14px;
        }
        .gdn-honey {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        /* ── Navigation de scene ──────────────────────────────────────── */
        .gdn-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 28px;
        }
        .gdn-next { font-size: 15px; padding: 14px 26px; }
        .gdn-submit {
          width: 100%;
          justify-content: center;
          font-size: 16px;
          padding: 16px 24px;
          margin-top: 6px;
        }
        .gdn-back-wrap { margin-top: 18px; text-align: center; }
        .gdn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px 4px;
        }
        .gdn-back:hover { color: var(--gold-light); }
        .gdn-scene-error {
          align-items: center;
          gap: 8px;
          margin: 18px 0 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 11px;
          padding: 11px 14px;
        }
        .gdn-send-error {
          margin: 16px 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: var(--gold-light);
          text-align: center;
        }
        .gdn-send-error a { color: var(--gold-light); text-decoration: underline; }

        /* ── Scene finale : le compteur de veille ─────────────────────── */
        .gdn-final {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 130px 24px 90px;
          outline: none;
        }
        .gdn-final-inner {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .gdn-ring {
          position: relative;
          width: 248px;
          height: 248px;
          margin: 14px auto 34px;
        }
        .gdn-ring-face {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid var(--gold-border);
          background: radial-gradient(circle at 50% 50%, rgba(201,168,76,0.09) 0%, transparent 68%);
        }
        .gdn-ring-star {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          margin: -2px 0 0 -2px;
          border-radius: 50%;
          background: var(--gold-light);
          transition: opacity 0.8s var(--ease-out);
        }
        .gdn-orbit {
          position: absolute;
          inset: 0;
          animation: gdn-orbit 60s linear infinite;
        }
        .gdn-orbit-off { animation: none; }
        @keyframes gdn-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gdn-orbit-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          margin: -4.5px 0 0 -4.5px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 14px rgba(232, 201, 122, 0.9);
          transform: translateY(-${Ye}px);
        }
        .gdn-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gdn-ring-time {
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }
        .gdn-ring-label {
          margin-top: 6px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-subtle);
        }
        .gdn-final-title {
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin: 0 0 14px;
        }
        .gdn-final-text {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.75;
          margin: 0 auto;
          max-width: 520px;
        }
        .gdn-final-ref {
          margin: 26px 0 0;
          font-size: 13px;
          color: var(--text-subtle);
          letter-spacing: 0.04em;
        }
        .gdn-final-ref strong { color: var(--gold-light); font-weight: 600; }
        .gdn-final-band {
          margin-top: 44px;
          padding: 26px 24px;
          background: rgba(10, 13, 28, 0.5);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          text-align: left;
        }
        .gdn-band-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 16px;
        }
        .gdn-band-list { list-style: none; margin: 0 0 20px; padding: 0; }
        .gdn-band-list li {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 11px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .gdn-band-list li svg { flex-shrink: 0; margin-top: 2px; }
        .gdn-band-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(201, 168, 76, 0.14);
        }
        .gdn-band-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          background: var(--gold-glow);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--gold-light);
          text-decoration: none;
        }

        /* ── Sections editoriales ─────────────────────────────────────── */
        .gdn-cards-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gdn-faq {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .gdn-cards-3 { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
          .gdn-faq { grid-template-columns: 1fr; }
        }
        .gdn-step-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 18px;
          border-radius: 15px;
          background: linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04));
          border: 1px solid var(--gold-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gdn-inline-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--gold-glow);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--gold);
          text-decoration: none;
        }
        .gdn-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--gold-light);
          text-decoration: none;
        }

        /* ── Mouvement reduit : rien ne bouge, tout reste lisible ─────── */
        @media (prefers-reduced-motion: reduce) {
          .gdn-star-tw { animation: none; }
          .gdn-dot { animation: none; opacity: 1; }
          .gdn-orbit { animation: none; }
          .gdn-cs { transition: none; }
          .gdn-ring-star { transition: none; }
        }
      `})]})}var k,A,we,Te,Ee,j,M,De,N,Oe,ke,P,F,I,Ae,je,Me,Ne,L,R,Pe,z,B,V,H,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,U,W,qe,Je,Ye,G,K;t((()=>{k=e(s()),x(),l(),c(),le(),de(),b(),T(),w(),A=n(),we=`https://api.web3forms.com/submit`,Te=`1dbb89c0-8b09-4abe-888d-f89f001d0627`,Ee=`guichetassutempo@gmail.com`,j=`/api/guichet/start`,M=`/api/guichet/status`,De=15e3,N=1e3,Oe=5e3,ke=2e3,P=1800*1e3,F=30,I=`guichet_session`,Ae=360*60*1e3,je=10*1024*1024,Me=[`permis_recto`,`permis_verso`,`carte_grise`],Ne=[{t:6,l:4,s:2,o:.4},{t:12,l:11,s:1,o:.3,tw:!0,d:5.2,dl:.4},{t:22,l:7,s:1,o:.25},{t:9,l:18,s:1.5,o:.35},{t:30,l:14,s:1,o:.2},{t:17,l:26,s:1,o:.3,tw:!0,d:6.1,dl:1.8},{t:5,l:33,s:1,o:.25},{t:26,l:31,s:2,o:.35},{t:38,l:22,s:1,o:.2},{t:11,l:42,s:1,o:.3},{t:21,l:47,s:1.5,o:.4,tw:!0,d:4.4,dl:.9},{t:33,l:41,s:1,o:.22},{t:7,l:52,s:1,o:.28},{t:16,l:58,s:1,o:.32},{t:28,l:55,s:1,o:.2,tw:!0,d:6.8,dl:2.6},{t:40,l:49,s:1.5,o:.25},{t:4,l:64,s:1,o:.35},{t:13,l:70,s:2,o:.4,tw:!0,d:5.6,dl:1.2},{t:24,l:66,s:1,o:.25},{t:35,l:72,s:1,o:.2},{t:8,l:78,s:1,o:.3},{t:19,l:83,s:1,o:.28,tw:!0,d:4.9,dl:3.1},{t:31,l:80,s:1.5,o:.35},{t:44,l:76,s:1,o:.18},{t:6,l:90,s:1,o:.32},{t:15,l:95,s:1,o:.25},{t:27,l:92,s:1,o:.3,tw:!0,d:6.4,dl:.2},{t:39,l:88,s:1,o:.22},{t:47,l:35,s:1,o:.2},{t:50,l:61,s:1,o:.25,tw:!0,d:5.9,dl:2.2},{t:52,l:12,s:1.5,o:.22},{t:45,l:5,s:1,o:.28}],L=`guichet_ref`,R=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`,Pe=`13 juillet 2026`,z=`2026-07-13`,B=[{key:`ouverture`,label:`Le guichet`},{key:`identite`,label:`Qui etes-vous`},{key:`vehicule`,label:`Votre vehicule`},{key:`besoin`,label:`Votre besoin`},{key:`questions`,label:`Deux questions rapides`},{key:`photos`,label:`Vos 3 photos`},{key:`depot`,label:`Derniere etape`}],V=B.length,H=V-1,Fe=(e,t,n)=>Math.min(n,Math.max(t,e)),Ie=[`1`,`2`,`3`,`5`,`7`,`10`,`15`,`20`,`30`,`60`,`90`],Le={answer:`Oui. Le Guichet de Nuit AssuTempo prépare votre assurance auto temporaire de 21h à 9h du lundi au samedi, et le dimanche toute la journée. Vous déposez votre demande avec 3 photos, le devis part dans les 30 minutes, et l'attestation arrive par mail dès le paiement.`,facts:[{anchor:`21h à 9h`,text:`La souscription en ligne classique ferme à 21h en semaine et à 20h le samedi. Le Guichet de Nuit prend le relais sur ces heures, et le dimanche sans interruption.`},{anchor:`30 minutes`,text:`Le devis part dans les 30 minutes suivant le dépôt de la demande complète, photos comprises. Au-delà, la majoration de nuit est offerte.`},{anchor:`ORIAS 20005719`,text:`Evidence Assurances, intermédiaire immatriculé à l'ORIAS. Le risque est porté par un assureur agréé, via notre partenaire de souscription.`}],updated:Pe},Re=[{num:`01`,Icon:se,title:`Déposez votre demande`,body:`Le formulaire prend 3 minutes, depuis votre téléphone. Aucun paiement à cette étape.`},{num:`02`,Icon:d,title:`Joignez vos 3 photos`,body:`Permis recto et verso, carte grise : les photos partent directement dans le formulaire, depuis votre téléphone.`},{num:`03`,Icon:re,title:`Signez et payez, vous êtes assuré`,body:`Vous recevez votre devis, le lien de signature électronique par mail et SMS, puis le lien de paiement. L'attestation arrive dès le paiement.`}],ze=[{Icon:y,label:`Intermédiaire immatriculé à l'ORIAS sous le n° 20005719`},{Icon:g,label:`Assureur porteur du risque via notre partenaire de souscription JL Assure`},{Icon:_,label:`Attestation officielle envoyée par mail dès le paiement`}],Be=[{Icon:ue,title:`Sortie de fourrière`,body:`La fourrière exige une attestation avant de rendre le véhicule, souvent dès l'ouverture. Préparez la vôtre pendant la nuit.`,to:`/articles/combien-de-jours-assurance-sortir-fourriere`,cta:`Lire le guide fourrière`},{Icon:v,title:`Voiture achetée le week-end`,body:`Le vendeur vous tend les clés un samedi soir ou un dimanche : il faut être assuré avant le trajet retour.`,to:`/articles/assurance-trajet-retour-achat-voiture`,cta:`Lire le guide trajet retour`},{Icon:ce,title:`Contrôle sans assurance`,body:`Rouler sans assurance coûte cher, même pour un seul trajet. Régularisez avant de reprendre la route.`,to:`/articles/controle-sans-assurance-risques-amende`,cta:`Lire le guide contrôle`}],Ve=[{q:`Peut-on vraiment être assuré à 3h du matin ?`,a:`Oui. Le Guichet de Nuit prépare votre contrat d'assurance temporaire en pleine nuit : vous déposez votre demande, vous recevez le devis puis le lien de signature, et l'attestation arrive par mail dès le paiement.`},{q:`Pourquoi les assurances temporaires ferment-elles après 21h ?`,a:`Parce que la souscription en ligne classique suit des horaires de bureau : après 21h en semaine et 20h le samedi, plus aucun contrat ne peut être émis. Le Guichet de Nuit a été créé pour couvrir ces heures creuses.`},{q:`Combien coûte le Guichet de Nuit ?`,a:`Le tarif de nuit est un tarif tout compris, affiché sur votre devis avant tout paiement. Vous ne payez rien au moment de la demande et le devis est sans engagement.`},{q:`Quels documents préparer ?`,a:`Trois photos suffisent : votre permis de conduire recto et verso, et la carte grise du véhicule. Vous les joignez directement dans le formulaire, depuis votre téléphone. Si la carte grise n'est pas sous la main, vous l'enverrez plus tard en répondant au mail de confirmation.`},{q:`En combien de temps l'attestation arrive-t-elle ?`,a:`Le devis part dans les 30 minutes qui suivent le dépôt de votre demande complète, et l'attestation officielle arrive par mail dès le paiement. Entre le dépôt de la demande et la couverture, tout peut se jouer dans l'heure.`},{q:`Que se passe-t-il si je ne signe pas le devis ?`,a:`Rien. Le devis est sans engagement : si vous ne signez pas, aucun contrat n'est émis et rien ne vous est facturé.`},{q:`Le Guichet de Nuit fonctionne-t-il le dimanche et les jours fériés ?`,a:`Oui. Le dimanche, le guichet assure la permanence toute la journée, et les jours fériés suivent le même régime. Ce sont justement les journées où la souscription en ligne classique est fermée.`},{q:`J'achète une voiture un samedi soir : puis-je être assuré avant le trajet retour ?`,a:`Oui, c'est l'un des cas les plus fréquents au guichet. Déposez votre demande dès que le vendeur vous remet les clés : l'assurance doit couvrir le véhicule dès le premier mètre parcouru, y compris pour rentrer chez vous.`},{q:`Faut-il un relevé d'information pour passer par le guichet ?`,a:`Non, aucun relevé d'information n'est exigé pour souscrire une assurance temporaire. Le formulaire vous demande simplement si vous avez été résilié ou si vous avez eu un retrait de permis : cette information sert à établir un devis juste, et la réponse du guichet vous parvient avant tout paiement.`}],He={"@context":`https://schema.org`,"@type":`BreadcrumbList`,itemListElement:[{"@type":`ListItem`,position:1,name:`Accueil`,item:`https://assutempo.fr/`},{"@type":`ListItem`,position:2,name:`Le Guichet de Nuit`,item:`https://assutempo.fr/guichet-de-nuit`}]},Ue={"@context":`https://schema.org`,"@type":`Service`,name:`Le Guichet de Nuit AssuTempo`,serviceType:`Souscription d'assurance auto temporaire de nuit`,description:`Préparation de contrats d'assurance auto temporaire pendant la nuit, de 21h à 9h du lundi au samedi et le dimanche toute la journée : devis en 30 minutes, signature électronique et attestation par mail.`,provider:{"@id":`https://assutempo.fr/#organization`},areaServed:`FR`,hoursAvailable:[{"@type":`OpeningHoursSpecification`,dayOfWeek:[`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],opens:`21:00`,closes:`09:00`},{"@type":`OpeningHoursSpecification`,dayOfWeek:`Sunday`,opens:`00:00`,closes:`23:59`}],availableChannel:{"@type":`ServiceChannel`,serviceUrl:`https://assutempo.fr/guichet-de-nuit`}},We={"@context":`https://schema.org`,"@type":`FAQPage`,mainEntity:Ve.map(e=>({"@type":`Question`,name:e.q,acceptedAnswer:{"@type":`Answer`,text:e.a}}))},Ge={"@context":`https://schema.org`,"@type":`HowTo`,name:`Souscrire une assurance auto temporaire la nuit`,description:`Obtenir une assurance auto temporaire entre 21h et 9h, ou le dimanche, avec le Guichet de Nuit AssuTempo.`,totalTime:`PT30M`,step:Re.map((e,t)=>({"@type":`HowToStep`,position:t+1,name:e.title,text:e.body,url:`https://assutempo.fr/guichet-de-nuit#etape-${t+1}`}))},Ke={"@context":`https://schema.org`,"@type":`WebPage`,"@id":`https://assutempo.fr/guichet-de-nuit#webpage`,url:`https://assutempo.fr/guichet-de-nuit`,name:`Assurance temporaire la nuit : Le Guichet de Nuit AssuTempo`,inLanguage:`fr-FR`,isPartOf:{"@id":`https://assutempo.fr/#website`},about:{"@id":`https://assutempo.fr/#organization`},dateModified:z,speakable:{"@type":`SpeakableSpecification`,cssSelector:[`h1`,`[aria-label="La réponse en bref"]`]}},U={background:`rgba(10, 13, 28, 0.55)`,border:`1px solid var(--gold-border)`,borderRadius:18,padding:`26px 24px`},W={fontSize:`clamp(1.6rem, 3.4vw, 2.3rem)`,fontWeight:700,letterSpacing:`-0.025em`,color:`var(--text)`,margin:`0 0 14px`},qe=`Assurance temporaire la nuit : Le Guichet de Nuit AssuTempo, 21h à 9h et dimanche`,Je=`Oui, on s'assure aussi en pleine nuit : le Guichet de Nuit prépare votre contrat de 21h à 9h et le dimanche. Devis en 30 minutes, attestation par mail.`,Ye=104,G=Array.from({length:F},(e,t)=>({i:t,transform:`rotate(${360/F*t}deg) translateY(-${Ye}px)`})),K=[`signature_sent`,`paid`]}))();export{O as default};