import { hasMeaningfulRichText } from '@/lib/content/rich-text';
import { RichText } from './RichText';

export function ProjectNarrativeSections({ challenge, solution, outcome }: { challenge: unknown; solution: unknown; outcome: unknown }) {
  return <>
    {hasMeaningfulRichText(challenge) && <section><h2>Challenge</h2><RichText document={challenge} /></section>}
    {hasMeaningfulRichText(solution) && <section><h2>Cosmisol Energy solution</h2><RichText document={solution} /></section>}
    {hasMeaningfulRichText(outcome) && <section><h2>Outcome</h2><RichText document={outcome} /></section>}
  </>;
}
