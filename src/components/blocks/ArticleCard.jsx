import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function ArticleCard({ title, category, excerpt, link }) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }} className="group rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mint">{category}</p>
      <h3 className="mt-4 text-2xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{excerpt}</p>
      <a href={link} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mint transition hover:text-[#00d6a8]">
        Lire l'article
        <ArrowRight size={18} />
      </a>
    </motion.article>
  );
}

export default ArticleCard;
