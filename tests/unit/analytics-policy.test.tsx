import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';
import CookiesPage from '../../app/(site)/cookies/page';
import PrivacyPage from '../../app/(site)/privacy/page';

describe('Google Analytics consent configuration', () => {
  it('permits only the required Google Analytics script and collection hosts', async () => {
    const headers = await nextConfig.headers?.();
    const contentSecurityPolicy = headers
      ?.flatMap((entry) => entry.headers)
      .find((header) => header.key === 'Content-Security-Policy')?.value;

    expect(contentSecurityPolicy).toContain('https://www.googletagmanager.com');
    expect(contentSecurityPolicy).toContain('https://*.google-analytics.com');
  });

  it('discloses denied-state cookieless signals and provides a way to change cookie preferences', () => {
    const cookiePolicy = renderToStaticMarkup(CookiesPage());
    const privacyPolicy = renderToStaticMarkup(PrivacyPage());

    expect(cookiePolicy).toContain('Google Analytics');
    expect(cookiePolicy).toContain('cookieless');
    expect(cookiePolicy).toContain('data-open-cookie-preferences');
    expect(privacyPolicy).toContain('Google Analytics');
    expect(privacyPolicy).toContain('cookieless');
    expect(privacyPolicy).toContain('consent');
  });
});
