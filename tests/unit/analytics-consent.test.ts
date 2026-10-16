import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';

const consentScript = readFileSync('public/legacy/analytics-consent.js', 'utf8');
const defaultUserAgent = window.navigator.userAgent;

function resetConsentEnvironment() {
  Object.defineProperty(window.navigator, 'userAgent', { configurable: true, value: defaultUserAgent });
  localStorage.clear();
  document.body.innerHTML = '';
  document.head.querySelectorAll('#cosmisol-google-analytics, style').forEach((node) => node.remove());
  delete (window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] })['gtag'];
  delete (window as Window & { dataLayer?: unknown[] })['dataLayer'];
}

describe('Google Analytics consent controls', () => {
  beforeEach(resetConsentEnvironment);

  it('loads the Google tag with analytics storage denied before a visitor chooses', () => {
    window.eval(consentScript);

    expect(document.querySelector('.cosmisol-cookie-notice')).toBeInTheDocument();
    expect(document.querySelector<HTMLScriptElement>('#cosmisol-google-analytics')?.src)
      .toBe('https://www.googletagmanager.com/gtag/js?id=G-0026VFLVWR');
    const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    const consentDefault = Array.from(dataLayer[0] ?? []);
    expect(consentDefault[0]).toBe('consent');
    expect(consentDefault[1]).toBe('default');
    expect(consentDefault[2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied' });

    document.querySelector<HTMLButtonElement>('[data-cookie-accept]')!.click();

    expect(localStorage.getItem('cosmisol-analytics-consent')).toBe('accepted');
    const consentUpdate = Array.from(dataLayer.at(-1) ?? []);
    expect(consentUpdate[0]).toBe('consent');
    expect(consentUpdate[1]).toBe('update');
    expect(consentUpdate[2]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'denied' });
    expect(document.querySelectorAll('#cosmisol-google-analytics')).toHaveLength(1);
  });

  it('lets AI crawlers read the public page without showing consent UI or loading analytics', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 OAI-SearchBot/1.0',
    });

    window.eval(consentScript);

    expect(document.querySelector('.cosmisol-cookie-notice')).not.toBeInTheDocument();
    expect(document.querySelector('#cosmisol-google-analytics')).not.toBeInTheDocument();
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toBeUndefined();
  });

  it('keeps analytics storage denied after rejection while leaving the advanced tag active', () => {
    window.eval(consentScript);

    document.querySelector<HTMLButtonElement>('[data-cookie-reject]')!.click();

    expect(localStorage.getItem('cosmisol-analytics-consent')).toBe('rejected');
    expect(document.querySelector('#cosmisol-google-analytics')).toBeInTheDocument();
    const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    const consentUpdate = Array.from(dataLayer.at(-1) ?? []);
    expect(consentUpdate[2]).toMatchObject({ analytics_storage: 'denied' });
    expect(document.querySelector('.cosmisol-cookie-notice')).not.toBeInTheDocument();
  });

  it('restores a saved acceptance before the Google tag loads', () => {
    localStorage.setItem('cosmisol-analytics-consent', 'accepted');
    window.eval(consentScript);

    expect(document.querySelector('.cosmisol-cookie-notice')).not.toBeInTheDocument();
    expect(document.querySelector('#cosmisol-google-analytics')).toBeInTheDocument();
    const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    expect(Array.from(dataLayer[0] ?? [])[2]).toMatchObject({ analytics_storage: 'granted' });
  });

  it('reopens preferences by returning consent to denied', () => {
    localStorage.setItem('cosmisol-analytics-consent', 'accepted');
    document.body.innerHTML = '<button data-open-cookie-preferences>Change preferences</button>';
    window.eval(consentScript);
    document.querySelector<HTMLButtonElement>('[data-open-cookie-preferences]')!.click();

    expect(localStorage.getItem('cosmisol-analytics-consent')).toBe('unset');
    expect(document.querySelector('.cosmisol-cookie-notice')).toBeInTheDocument();
    const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    expect(Array.from(dataLayer.at(-1) ?? [])[2]).toMatchObject({ analytics_storage: 'denied' });
  });
});
