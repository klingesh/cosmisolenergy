const reasons = [
  ['◎','Solutions designed around you','Your needs, space and energy usage shape every decision.'],
  ['◇','Quality from trusted brands','Carefully selected components for performance and long-term durability.'],
  ['⚙','Installation, done right','Complete structural, civil and electrical work with attention to detail.'],
  ['▤','Subsidy & loan assistance','Guidance for documentation, subsidy procedures and financing.'],
  ['♲','Support that stays','Periodic checks, maintenance and timely assistance.'],
  ['✓','End-to-end responsibility','One accountable team from first visit through commissioning and beyond.'],
];
export function WhyCosmisol(){return <section id="why" className="section wrap"><p className="eyebrow">Why Cosmisol Energy</p><h2>Thoughtfully designed.<br />Responsibly delivered.</h2><div className="cards cards--reasons">{reasons.map(([icon,title,text])=><article className="card reason reveal" key={title}><span className="card__icon" aria-hidden>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>}

