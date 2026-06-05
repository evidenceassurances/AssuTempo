import './TempoDial.css';

export default function TempoDial() {
  return (
    <div className="atd" aria-hidden="true">
      <div className="atd-bloom" />
      <div className="atd-ring atd-r1" />
      <div className="atd-ring atd-r2" />
      <div className="atd-ring atd-dash" />
      <div className="atd-ticks" />
      <div className="atd-ticks atd-ticks-major" />
      <div className="atd-comet">
        <span className="atd-trail" />
        <span className="atd-dot" />
      </div>
    </div>
  );
}
