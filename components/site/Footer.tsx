import Image from 'next/image';
import Link from 'next/link';
import { COSMISOL_ADDRESSES } from '@/lib/site/addresses';

export function Footer() {
  return <footer className="footer wrap">
    <div><Image src="/images/logo.png" alt="Cosmisol Energy — Energy that works for you" width={190} height={74} /><p>Energy that works for you.</p></div>
    <div className="footer__links"><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div>
    <section className="footer__locations" aria-labelledby="footer-locations-title">
      <h2 id="footer-locations-title">Our locations</h2>
      <div>{COSMISOL_ADDRESSES.map(address => <address key={address}>{address}</address>)}</div>
    </section>
    <p>© 2026 Cosmisol Energy. All rights reserved.</p>
  </footer>;
}

