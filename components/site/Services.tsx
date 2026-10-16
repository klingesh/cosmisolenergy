const services = [
  ['⌂', 'Residential solar', 'A rooftop solar system designed for your home and everyday energy needs.'],
  ['▦', 'Commercial solar', 'Put available space to work with a solution tailored to your business.'],
  ['▥', 'Industrial solar', 'Plan for larger energy demands around your facility and operations.'],
];
export function Services() {
  return <section id="solutions" className="section wrap reveal"><p className="eyebrow">Solar services</p><h2>Good energy. For every space.</h2>
    <div className="cards">{services.map(([icon,title,text]) => <article className="card" key={title}><span className="card__icon" aria-hidden>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
  </section>;
}
