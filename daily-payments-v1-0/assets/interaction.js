
(function () {
  var q = new URLSearchParams(location.search);
  var state = q.get('s');

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  each('[data-state]', function (el) {
    var want = el.getAttribute('data-state');
    el.classList.toggle('hidden', want !== state);
  });
  each('[data-state-not]', function (el) {
    if (el.getAttribute('data-state-not') === state) el.classList.add('hidden');
  });

  var toastTimer;
  function toast(text) {
    var t = document.getElementById('__toast');
    if (!t) { t = document.createElement('div'); t.id = '__toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open],[data-close],[data-toast],[data-go],.tabs__item[data-tab]');
    if (!el) {
      if (e.target.classList && e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
      return;
    }
    if (el.hasAttribute('data-close')) {
      var m = el.closest('.modal-overlay');
      if (m) m.classList.remove('active');
    }
    if (el.hasAttribute('data-open')) {
      var target = document.querySelector(el.getAttribute('data-open'));
      if (target) target.classList.add('active');
    }
    if (el.hasAttribute('data-toast')) toast(el.getAttribute('data-toast'));
    if (el.hasAttribute('data-go')) location.href = el.getAttribute('data-go');
    if (el.hasAttribute('data-tab')) {
      var box = el.closest('[data-tabs]') || document;
      var key = el.getAttribute('data-tab');
      Array.prototype.forEach.call(box.querySelectorAll('.tabs__item[data-tab]'), function (i) { i.classList.toggle('active', i === el); });
      Array.prototype.forEach.call(box.querySelectorAll('[data-panel]'), function (p) { p.classList.toggle('hidden', p.getAttribute('data-panel') !== key); });
    }
  });

  var auto = q.get('open');
  if (auto) { var t = document.querySelector(auto); if (t) t.classList.add('active'); }

  window.PRD = { toast: toast, state: function () { return state; } };
})();
