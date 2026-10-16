'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="shell">
      <div className="shell__content">
        <p className="shell__eyebrow">Something went wrong</p>
        <h1>We couldn’t load this page.</h1>
        <p>Please try again. If the problem continues, contact Cosmisol Energy.</p>
        <div className="error-actions">
          <button className="shell__action" type="button" onClick={reset}>Try again</button>
          <a className="shell__action" href="/">Return home</a>
        </div>
      </div>
    </main>
  );
}
