import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const defaultContact = { name: '', email: '', phone: '', message: '' };
const defaultPartner = { company: '', email: '', phone: '', message: '' };

function ContactPartners() {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactData, setContactData] = useState(defaultContact);
  const [partnerData, setPartnerData] = useState(defaultPartner);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (section, field, value) => {
    if (section === 'contact') {
      setContactData((prev) => ({ ...prev, [field]: value }));
    } else {
      setPartnerData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-lg shadow-slate-900/5">
      <div className="flex flex-wrap gap-3 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700">
        <button type="button" onClick={() => setActiveTab('contact')} className={`rounded-full px-5 py-2 transition ${activeTab === 'contact' ? 'bg-slate-950 text-white' : 'bg-transparent hover:bg-slate-200'}`}>
          Contact
        </button>
        <button type="button" onClick={() => setActiveTab('partnership')} className={`rounded-full px-5 py-2 transition ${activeTab === 'partnership' ? 'bg-slate-950 text-white' : 'bg-transparent hover:bg-slate-200'}`}>
          Partenariats pro
        </button>
      </div>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8 grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            {activeTab === 'contact' ? 'Nom complet' : "Nom de l'agence / garage"}
            <input value={activeTab === 'contact' ? contactData.name : partnerData.company} onChange={(e) => handleChange(activeTab, activeTab === 'contact' ? 'name' : 'company', e.target.value)} placeholder={activeTab === 'contact' ? 'Jean Dupont' : 'Garage du Centre'} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input value={activeTab === 'contact' ? contactData.email : partnerData.email} onChange={(e) => handleChange(activeTab, 'email', e.target.value)} placeholder="contact@exemple.com" type="email" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Téléphone
            <input value={activeTab === 'contact' ? contactData.phone : partnerData.phone} onChange={(e) => handleChange(activeTab, 'phone', e.target.value)} placeholder="09 74 19 78 20" type="tel" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Objet
            <input value={activeTab === 'contact' ? 'Demande d’assistance' : 'Partenariat commercial'} disabled className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Message
          <textarea value={activeTab === 'contact' ? contactData.message : partnerData.message} onChange={(e) => handleChange(activeTab, 'message', e.target.value)} rows="5" placeholder={activeTab === 'contact' ? 'Expliquez votre demande...' : 'Décrivez votre activité et vos attentes...'} className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">Formulaire {activeTab === 'contact' ? 'de contact' : 'de partenariat'}</p>
            <p className="text-sm text-slate-500">Nous vous répondrons sous 24h ouvrées.</p>
          </div>
          <Button variant="primary" type="submit" className="w-full sm:w-auto">
            Envoyer ma demande
          </Button>
        </div>

        {submitted && <div className="rounded-3xl bg-mint/10 p-4 text-sm text-slate-950">Merci ! Votre demande a bien été prise en compte.</div>}
      </motion.form>
    </div>
  );
}

export default ContactPartners;
