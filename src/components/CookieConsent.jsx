// src/components/CookieConsent.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'assutempo_consent_v1';

export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...consent, necessary: true, date: new Date().toISOString() })
    );
  } catch (e) {
    // localStorage indisponible (navigation privée stricte) : on ignore
  }
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: consent }));
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => { setCustom(true); setOpen(true); };
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);

  const decide = (consent) => {
    saveConsent(consent);
    setOpen(false);
    setCustom(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-[9999] p-4"
          role="dialog"
          aria-label="Gestion des cookies"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#C9A84C]/25 bg-[#0E0E0E]/95 backdrop-blur p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <p className="text-sm leading-relaxed text-[#A0A0A0]">
              Nous utilisons des cookies pour le bon fonctionnement du site et, avec votre accord, pour mesurer son audience. Vous pouvez accepter, refuser ou personnaliser vos choix.{' '}
              <a href="/cookies" className="text-[#E8C97A] underline underline-offset-2">En savoir plus</a>.
            </p>

            {custom && (
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-center justify-between gap-4 opacity-70">
                  <span>Cookies nécessaires (toujours actifs)</span>
                  <input type="checkbox" checked disabled />
                </label>
                <label className="flex items-center justify-between gap-4 text-[#F5F5F5]">
                  <span>Mesure d&apos;audience</span>
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 text-[#F5F5F5]">
                  <span>Marketing</span>
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => decide({ analytics: true, marketing: true })}
                className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#E8C97A]"
              >
                Tout accepter
              </button>
              <button
                onClick={() => decide({ analytics: false, marketing: false })}
                className="rounded-lg border border-[#C9A84C]/40 px-4 py-2 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#C9A84C]"
              >
                Tout refuser
              </button>
              {!custom ? (
                <button
                  onClick={() => setCustom(true)}
                  className="rounded-lg px-4 py-2 text-sm text-[#A0A0A0] transition hover:text-[#F5F5F5]"
                >
                  Personnaliser
                </button>
              ) : (
                <button
                  onClick={() => decide(prefs)}
                  className="rounded-lg px-4 py-2 text-sm text-[#A0A0A0] transition hover:text-[#F5F5F5]"
                >
                  Enregistrer mes choix
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
