/* Cookieless analytics loader.
   Set PROVIDER and SITE_ID below to enable. While both are empty this file loads
   nothing and makes no network request, so the site keeps its "no third-party
   requests" property and the cookie policy stays accurate.

   Umami Cloud (free tier, cookieless):
     PROVIDER = 'umami';   SITE_ID = the website-id from cloud.umami.is
   Plausible (paid, EU, cookieless):
     PROVIDER = 'plausible'; SITE_ID = 'alm365cloud.com'

   Either way: no cookies, no fingerprinting, no personal data. Remember to add the
   provider to the processor list in privacidad.html before enabling it. */
(function () {
  var PROVIDER = 'umami';
  var SITE_ID = 'bbfbaad4-18c5-4961-9a28-20cf2c63dba0';

  if (!PROVIDER || !SITE_ID) return;

  var s = document.createElement('script');
  s.defer = true;

  if (PROVIDER === 'umami') {
    s.src = 'https://cloud.umami.is/script.js';
    s.setAttribute('data-website-id', SITE_ID);
  } else if (PROVIDER === 'plausible') {
    s.src = 'https://plausible.io/js/script.js';
    s.setAttribute('data-domain', SITE_ID);
  } else {
    return;
  }

  document.head.appendChild(s);
})();
