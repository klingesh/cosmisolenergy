import Image from 'next/image';
import Link from 'next/link';

export function Header({ hasProjects = false, hasPosts = false }: { hasProjects?: boolean; hasPosts?: boolean }) {
  return (
    <header className="header">
      <Link className="header__brand" href="/" aria-label="Cosmisol Energy home"><Image src="/images/logo.png" alt="Cosmisol Energy — Energy that works for you" width={210} height={82} priority /></Link>
      <nav aria-label="Primary navigation">
        <details className="services-menu"><summary>Services</summary><a href="/#solutions">Solar services</a></details>
        <Link href="/about">About Us</Link>
        {hasProjects && <Link href="/projects">Projects</Link>}
        {hasPosts && <Link href="/blog">Blog</Link>}
      </nav>
    </header>
  );
}
