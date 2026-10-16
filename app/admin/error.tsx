'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="admin-login" aria-labelledby="admin-error-title">
      <h1 id="admin-error-title">The admin page couldn’t load</h1>
      <p>Your work may still be saved. Try loading the page again.</p>
      <button className="button" type="button" onClick={reset}>Try again</button>
    </section>
  );
}
