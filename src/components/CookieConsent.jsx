import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'assutempo_consent_v1';

// Mesure d'audience ACTIVE par défaut, tant que l'utilisateur n'a pas explicitement refusé.
export function isAnalyticsAllowed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    return JSON.parse(raw).analytics !== false;
  } catch {
    return true;
  }
}

function hasChosen() {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function save(analytics) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, date: new Date().toISOString() }));
  } catch { /* stockage indisponible : le consentement ne persiste pas */ }
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: { analytics } }));
}

function clearAnalyticsCookies() {
  try {
    const host = location.hostname;
    const root = '.' + host.split('.').slice(-2).join('.');
    const domains = ['', host, '.' + host, root];
    document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .forEach((name) => {
        if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_') || name.startsWith('_gat_')) {
          domains.forEach((d) => {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
          });
        }
      });
    window['ga-disable-G-W8M4ZGXZE1'] = true;
  } catch { /* cookies inaccessibles : rien a purger */ }
}

const C = { card: '#0E0E0E', gold: '#C9A84C', goldLight: '#E8C97A', text: '#F5F5F5', sub: '#A0A0A0' };

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasChosen()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);

  const accept = () => { save(true); setOpen(false); };
  const refuse = () => { save(false); clearAnalyticsCookies(); setOpen(false); };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Gestion des cookies"
          style={{ position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 9999, maxWidth: 460, margin: '0 auto' }}
        >
          <div style={{ background: C.card, border: '1px solid ' + C.gold + '40', borderRadius: 16, padding: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: C.sub }}>
              Nous utilisons des cookies pour le bon fonctionnement du site et pour mesurer son audience. Vous pouvez accepter ou refuser.{' '}
              <a href="/cookies" style={{ color: C.goldLight, textDecoration: 'underline' }}>En savoir plus</a>.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={accept} style={{ flex: 1, cursor: 'pointer', borderRadius: 10, border: 'none', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#000', background: C.gold }}>
                Accepter
              </button>
              <button onClick={refuse} style={{ flex: 1, cursor: 'pointer', borderRadius: 10, border: '1px solid ' + C.gold + '66', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: C.text, background: 'transparent' }}>
                Refuser
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
