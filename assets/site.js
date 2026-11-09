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
})();
