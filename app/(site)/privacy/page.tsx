import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({title:'Privacy Policy',description:'Learn how Cosmisol Energy handles information shared through the website and enquiry process.',path:'/privacy',noIndex:true});

export default function PrivacyPage() {
  return (
    <main className="legal wrap">
      <h1>Privacy Policy</h1>
      <p>Last updated: 5 October 2026</p>
      <h2>Information you choose to send</h2>
      <p>When you request a site visit, your name, phone number, location, selected service and optional message are placed into a WhatsApp message. Nothing is sent until you choose to send that message. Cosmisol Energy uses those details to answer your enquiry and arrange the requested service.</p>
      <h2>Website processors</h2>
      <p>This website is hosted by Vercel. Supabase provides private administrator authentication, the content database and media storage. Those providers may process limited technical data needed to deliver and secure the service under their own data-processing terms.</p>
      <h2>Analytics and consent</h2>
      <p>This website uses Google Analytics 4 in advanced consent mode. The Google tag loads on public pages. Before you accept analytics, and after you reject it, analytics and advertising storage remain denied. In that state the tag may send cookieless measurement signals to Google, but it does not read or write analytics cookies. If you accept analytics, Google Analytics may process information about your visit, such as pages viewed, interactions, browser and device details, and approximate location derived from network information; it may use analytics cookies for measurement. You can change your choice at any time in our <a href="/cookies">Cookie Policy</a>. We do not use advertising pixels.</p>
      <h2>Retention and sharing</h2>
      <p>Cosmisol Energy keeps enquiry information only as long as needed to respond, provide requested services and meet applicable record-keeping duties. We do not sell personal information. We share it only with service providers supporting the website or where law requires it.</p>
      <h2>Your choices</h2>
      <p>Contact <a href="mailto:contact@cosmisolenergy.com">contact@cosmisolenergy.com</a> or call <a href="tel:+917339617710">+91 73396 17710</a> to ask about, correct or delete information you previously sent, subject to applicable legal obligations.</p>
    </main>
  );
}
