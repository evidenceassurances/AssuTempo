import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

function StepFlow({ steps, ariaLabel }) {
  const reduce = useReducedMotion();

  return (
    <>
      <div
        role="img"
        aria-label={ariaLabel}
        className="stepflow"
        style={{
          margin: '32px 0',
          padding: '20px 24px',
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          borderRadius: 16,
        }}
      >
        <div className="stepflow-inner">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            return (
              <Fragment key={i}>
                <motion.div
                  className="stepflow-step"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={reduce ? false : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="stepflow-icon" aria-hidden="true">
                    <Icon size={20} color="var(--gold)" strokeWidth={1.5} />
                  </div>
                  <p className="stepflow-label">{step.label}</p>
                </motion.div>

                {!isLast && (
                  <ChevronRight
                    className="stepflow-arrow"
                    size={14}
                    color="var(--gold)"
                    strokeWidth={2}
                    aria-hidden="true"
                    style={{ opacity: 0.55, flexShrink: 0 }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        .stepflow-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .stepflow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .stepflow-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.12);
          border: 1.5px solid var(--gold-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stepflow-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          text-align: center;
          margin: 0;
          line-height: 1.35;
        }
        .stepflow-arrow {
          flex-shrink: 0;
          margin-bottom: 22px;
        }
        @media (max-width: 560px) {
          .stepflow-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .stepflow-step {
            flex-direction: row;
            flex: none;
            width: 100%;
            gap: 12px;
          }
          .stepflow-label {
            text-align: left;
            font-size: 13px;
          }
          .stepflow-arrow {
            transform: rotate(90deg);
            margin-bottom: 0;
            margin-left: 15px;
          }
        }
      `}</style>
    </>
  );
}

export default StepFlow;
