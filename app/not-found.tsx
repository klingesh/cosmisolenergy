import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="shell">
      <div className="shell__content">
        <p className="shell__eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page may have moved or the address may be incorrect.</p>
        <Link className="shell__action" href="/">Return home</Link>
      </div>
    </main>
  );
}
