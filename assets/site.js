/* ALM365 Cloud — shared behaviour. Safe on every page: each block is guarded. */
(function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Mobile navigation: the tab strip collapses behind the Menu button. */
  document.body.classList.add('view-mode');
  var toggle = document.getElementById('mobile-toggle');
  var menu = document.getElementById('main-navigation');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* SolMan 7.2 countdown (home only). Stops counting once the date has passed. */
  var daysEl = document.getElementById('d-days');
  if (daysEl) {
    var end = new Date('2027-12-31T23:59:59');
    var days = Math.ceil((end - new Date()) / 864e5);
    if (days > 0) {
      daysEl.textContent = days.toLocaleString('en-US');
    } else {
      daysEl.textContent = '\u2014';
      var label = daysEl.nextElementSibling;
      if (label) label.textContent = 'mainstream maintenance ended';
    }
  }

  /* Copy the contact email to the clipboard. */
  var copyBtn = document.getElementById('copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var mail = document.getElementById('mail');
      if (!mail) return;
      var text = mail.textContent;
      var btn = this;
      function done() {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      }
      function select() {
        var r = document.createRange();
        r.selectNodeContents(mail);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      try {
        navigator.clipboard.writeText(text).then(done, select);
      } catch (e) {
        select();
      }
    });
  }

  /* Contact form.
     With FORM_ENDPOINT set to a form service URL (Formspree, Brevo, a Worker...)
     the form posts there with AJAX and reports the result inline. While it is
     empty it falls back to a prefilled email draft, so the page never claims a
     delivery it cannot make. */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'info@alm365cloud.com';
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('contact-status');
    var submitBtn = form.querySelector('button[type=submit]');
    function setStatus(msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    }
    if (!FORM_ENDPOINT && submitBtn) submitBtn.textContent = 'Send by email';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('contact-name').value.trim();
      var email = document.getElementById('contact-email').value.trim();
      var companyEl = document.getElementById('contact-company');
      var company = companyEl ? companyEl.value.trim() : '';
      var topicEl = document.getElementById('contact-topic');
      var topic = topicEl ? topicEl.value : 'General enquiry';
      var messageEl = document.getElementById('contact-message');
      var message = messageEl ? messageEl.value.trim() : '';
      var consentEl = document.getElementById('contact-consent');
      var consent = consentEl ? consentEl.checked : false;

      var trap = document.getElementById('contact-hp');
      if (trap && trap.value) {
        setStatus('Thank you — your enquiry is with us. We reply within two working days.', 'ok');
        return;
      }
      if (!name || !email || !consent || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setStatus('Please add your name, a valid work email and tick the consent box.', 'err');
        var first = !name ? document.getElementById('contact-name')
          : !email ? document.getElementById('contact-email') : consentEl;
        if (first) first.focus();
        return;
      }

      if (!FORM_ENDPOINT) {
        var body = 'Hello ALM365 Cloud,\n\nName: ' + name + '\nEmail: ' + email
          + (company ? '\nCompany: ' + company : '')
          + '\nTopic: ' + topic + '\n\n' + (message || '(no message)') + '\n';
        window.location.href = 'mailto:' + CONTACT_EMAIL
          + '?subject=' + encodeURIComponent('Website enquiry: ' + topic)
          + '&body=' + encodeURIComponent(body);
        setStatus('Your email app should open with the message ready. If it does not, write to ' + CONTACT_EMAIL + '.');
        return;
      }

      submitBtn.disabled = true;
      setStatus('Sending…');
      var data = new URLSearchParams();
      data.append('name', name);
      data.append('email', email);
      data.append('company', company);
      data.append('topic', topic);
      data.append('message', message);
      data.append('consent', 'yes');
      data.append('_subject', 'Website enquiry: ' + topic);

      fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r;
        })
        .then(function () {
          form.reset();
          setStatus('Thank you — your enquiry is with us. We reply within two working days.', 'ok');
        })
        .catch(function () {
          setStatus('The form could not be sent. Please write to ' + CONTACT_EMAIL + ' instead.', 'err');
        })
        .then(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
