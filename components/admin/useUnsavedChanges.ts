'use client';
import { useEffect } from 'react';

export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    const linkClick = (event: MouseEvent) => {
      if (!dirty || event.defaultPrevented || event.button !== 0) return;
      const link = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.origin !== window.location.origin) return;
      if (!window.confirm('Leave this page and discard unsaved changes?')) { event.preventDefault(); event.stopPropagation(); }
    };
    const formSubmit = (event: SubmitEvent) => {
      if (dirty && !window.confirm('Leave this page and discard unsaved changes?')) { event.preventDefault(); event.stopPropagation(); }
    };
    const historyChange = () => {
      if (dirty && !window.confirm('Leave this page and discard unsaved changes?')) window.setTimeout(() => history.forward(), 0);
    };
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('popstate', historyChange);
    document.addEventListener('click', linkClick, true);
    document.addEventListener('submit', formSubmit, true);
    return () => { window.removeEventListener('beforeunload', beforeUnload); window.removeEventListener('popstate', historyChange); document.removeEventListener('click', linkClick, true); document.removeEventListener('submit', formSubmit, true); };
  }, [dirty]);
}
