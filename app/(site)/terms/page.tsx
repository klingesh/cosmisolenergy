import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
export const metadata:Metadata=pageMetadata({title:'Website Terms',description:'Website terms for using the Cosmisol Energy solar website and indicative solar calculator.',path:'/terms',noIndex:true});
export default function TermsPage(){return <main className="legal wrap"><h1>Website Terms</h1><p>Website information and calculator results are general, illustrative estimates. A final system design, price, generation estimate, subsidy eligibility and schedule require a site assessment and written proposal from Cosmisol Energy.</p><p>Product names and logos belong to their respective owners and indicate brands Cosmisol Energy may work with; availability is confirmed in each proposal.</p></main>}
