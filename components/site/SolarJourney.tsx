const steps = [
  ['⌖','Site visit','We listen to your energy needs and assess your site, roof and installation requirements.'],
  ['✎','Customised proposal','We design a system around your usage, available space and budget.'],
  ['▤','Paperwork & assistance','We guide you through documents, subsidy steps and loan assistance if needed.'],
  ['⚒','Professional installation','Our team completes structural, civil and electrical work with grid connectivity.'],
  ['♲','After-sales support','We stay connected with monitoring, maintenance and support.'],
];
export function SolarJourney() {
  return <section id="journey" className="section section--tint"><div className="wrap"><p className="eyebrow">Our 5-step process</p><h2>Your solar journey,<br /><span>made simple.</span></h2><p className="lede">From the first conversation to long-term support, we’re with you at every step.</p>
    <ol className="timeline">{steps.map(([icon,title,text],i)=><li className="timeline__item reveal" key={title}><span className="timeline__symbol" aria-label={`Step ${i+1}`}>{icon}</span><article><h3>{title}</h3><p>{text}</p></article></li>)}</ol>
  </div></section>;
}
