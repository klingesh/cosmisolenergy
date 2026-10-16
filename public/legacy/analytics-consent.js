(function () {
  'use strict';

  var STORAGE_KEY = 'cosmisol-analytics-consent';
  var MEASUREMENT_ID = 'G-0026VFLVWR';
  var TAG_ID = 'cosmisol-google-analytics';
  var CRAWLER_USER_AGENT = /(?:bot|crawler|spider|slurp|fetch|preview)|ChatGPT-User/i;
  var DENIED_CONSENT = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };

  // Public content is readable by crawlers without triggering analytics or a consent prompt.
  if (window.location.pathname.indexOf('/admin') === 0 || CRAWLER_USER_AGENT.test(window.navigator.userAgent || '')) return;

  function readChoice() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (_error) {
      return null;
    }
  }

  function saveChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch (_error) {
      // Analytics is still gated by the current page's choice if storage is unavailable.
    }
  }

  function initialiseAnalytics(choice) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', Object.assign({}, DENIED_CONSENT, {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
    }));
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });

    if (!document.getElementById(TAG_ID)) {
      var script = document.createElement('script');
      script.id = TAG_ID;
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
      document.head.appendChild(script);
    }
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      }
    });
  }

  function denyAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', DENIED_CONSENT);
    }
    clearAnalyticsCookies();
  }

  function allowAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', Object.assign({}, DENIED_CONSENT, {
        analytics_storage: 'granted',
      }));
    }
  }

  var style = document.createElement('style');
  style.textContent = [
    '.cosmisol-cookie-notice{position:fixed;z-index:2147483000;left:50%;bottom:20px;transform:translateX(-50%);width:min(720px,calc(100% - 32px));box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 20px;background:#fff;border:1px solid #dce3e4;border-radius:22px;box-shadow:0 12px 40px rgba(11,39,48,.2);color:#0b2730;font:15px/1.5 Arial,Helvetica,sans-serif}',
    '.cosmisol-cookie-copy{flex:1;min-width:0}.cosmisol-cookie-copy strong{display:block;margin-bottom:3px;font-size:16px}.cosmisol-cookie-copy p{margin:0;color:#5d6d73}.cosmisol-cookie-copy a{color:#b83d19;text-decoration:underline;text-underline-offset:2px}',
    '.cosmisol-cookie-actions{display:flex;flex:none;gap:8px}.cosmisol-cookie-actions button{min-height:42px;padding:9px 15px;border:1px solid #b83d19;border-radius:999px;background:#fff;color:#a93716;font:700 14px Arial,Helvetica,sans-serif;cursor:pointer}.cosmisol-cookie-actions button[data-cookie-accept]{background:#f15a2a;color:#fff}.cosmisol-cookie-actions button:focus-visible,.cookie-preferences-link:focus-visible{outline:3px solid #1769aa;outline-offset:3px}.cookie-preferences-link{padding:0;border:0;background:none;color:#b83d19;text-decoration:underline;text-underline-offset:2px;font:inherit;cursor:pointer}',
    '@media(max-width:600px){.cosmisol-cookie-notice{bottom:10px;align-items:stretch;flex-direction:column;gap:12px;padding:16px;border-radius:18px}.cosmisol-cookie-actions{width:100%}.cosmisol-cookie-actions button{flex:1;padding:9px 10px}}',
    '@media(prefers-reduced-motion:reduce){.cosmisol-cookie-notice{scroll-behavior:auto}}',
  ].join('');
  document.head.appendChild(style);

  var notice;

  function removeNotice() {
    if (notice && notice.parentNode) notice.parentNode.removeChild(notice);
    notice = null;
  }

  function showNotice() {
    if (notice && notice.parentNode) return;
    notice = document.createElement('aside');
    notice.className = 'cosmisol-cookie-notice';
    notice.setAttribute('aria-label', 'Cookie preferences');
    notice.setAttribute('role', 'region');

    var copy = document.createElement('div');
    copy.className = 'cosmisol-cookie-copy';
    var title = document.createElement('strong');
    title.textContent = 'Your privacy choices';
    var message = document.createElement('p');
    message.appendChild(document.createTextNode('Google Analytics may send cookieless measurement signals before consent. Accept analytics to allow analytics storage; reject keeps it off. '));
    var policyLink = document.createElement('a');
    policyLink.href = '/cookies';
    policyLink.textContent = 'Cookie details';
    message.appendChild(policyLink);
    copy.appendChild(title);
    copy.appendChild(message);

    var actions = document.createElement('div');
    actions.className = 'cosmisol-cookie-actions';
    var reject = document.createElement('button');
    reject.type = 'button';
    reject.textContent = 'Reject analytics';
    reject.setAttribute('data-cookie-reject', '');
    var accept = document.createElement('button');
    accept.type = 'button';
    accept.textContent = 'Accept analytics';
    accept.setAttribute('data-cookie-accept', '');
    actions.appendChild(reject);
    actions.appendChild(accept);
    notice.appendChild(copy);
    notice.appendChild(actions);
    document.body.appendChild(notice);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-open-cookie-preferences]')) {
      event.preventDefault();
      saveChoice('unset');
      denyAnalytics();
      showNotice();
      var acceptButton = notice.querySelector('[data-cookie-accept]');
      if (acceptButton) acceptButton.focus();
      return;
    }

    if (target.closest('[data-cookie-accept]')) {
      saveChoice('accepted');
      removeNotice();
      allowAnalytics();
      return;
    }

    if (target.closest('[data-cookie-reject]')) {
      saveChoice('rejected');
      denyAnalytics();
      removeNotice();
    }
  });

  var savedChoice = readChoice();
  initialiseAnalytics(savedChoice);
  if (savedChoice !== 'accepted' && savedChoice !== 'rejected') {
    if (document.body) showNotice();
    else document.addEventListener('DOMContentLoaded', showNotice, { once: true });
  }
}());
