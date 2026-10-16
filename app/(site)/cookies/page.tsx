import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({title:'Cookie Policy',description:'Details about essential cookies and tracking technologies used by the Cosmisol Energy website.',path:'/cookies',noIndex:true});

export default function CookiesPage() {
  return (
    <main className="legal wrap">
      <h1>Cookie Policy</h1>
      <p>Last updated: 5 October 2026</p>
      <h2>Essential cookies</h2>
      <p>Cosmisol Energy uses only essential cookies required to keep the private administrator area secure and maintain an administrator session. Public visitors do not need these administrator cookies.</p>
      <h2>Analytics cookies</h2>
      <p>This website uses Google Analytics 4 in advanced consent mode to understand how visitors use the site. The Google tag loads when a public page opens. Until you accept analytics, or if you reject it, analytics storage and advertising storage remain denied: Google Analytics will not read or write analytics cookies, but may send cookieless measurement signals to Google. If you select “Accept analytics”, analytics storage is allowed and Google Analytics may use cookies and similar technologies to measure site use. Advertising storage remains denied, and we do not use advertising cookies or advertising pixels.</p>
      <p>You can change your choice at any time using <button type="button" className="cookie-preferences-link" data-open-cookie-preferences>Change cookie preferences</button>.</p>
      <h2>Managing cookies</h2>
      <p>You can also control or delete cookies through your browser settings. Blocking cookies may affect other sites’ features.</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be sent to <a href="mailto:contact@cosmisolenergy.com">contact@cosmisolenergy.com</a>.</p>
    </main>
  );
}
