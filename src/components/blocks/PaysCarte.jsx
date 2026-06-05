import { motion } from 'framer-motion';
import { CATS, CAT_LABEL, classifySection } from '../../lib/carteCategories';

export function PaysCarte({ section, index = 0, IconComp }) {
  const key = classifySection(section);
  const cat = CATS[key];
  const Ico = IconComp;
  return (
    <motion.article
      className="pays-carte"
      style={{
        '--c':     cat.color,
        '--cbg':   cat.bg,
        '--cbd':   cat.border,
        '--chover': cat.hover,
        '--cglow': cat.glow,
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="pays-carte-head">
        <span className="chip"><Ico size={23} strokeWidth={2} /></span>
        <span className="pill">{CAT_LABEL[key]}</span>
      </div>
      <h3 className="ctitle">{section.titre}</h3>
      <p className="ctext">{section.texte}</p>
    </motion.article>
  );
}

export function PaysLegende() {
  const ORDER = ['regle', 'peage', 'route', 'astuce'];
  return (
    <div className="pays-legende">
      <div className="pays-legende-titre">Comment lire cette page</div>
      <div className="pays-legende-row">
        {ORDER.map((k) => (
          <span
            key={k}
            className="pill"
            style={{ '--c': CATS[k].color, '--cbg': CATS[k].bg, '--cbd': CATS[k].border }}
          >
            <span className="dot" />
            {CAT_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  );
}
