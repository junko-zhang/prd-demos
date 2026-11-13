/* interaction.js —— 原型公共交互（纯原生 JS，无依赖）。
 * 用 data-* 属性声明交互，页面里不用再写脚本：
 *   data-open="#id"        点击后打开弹窗（给目标加 .active）
 *   data-close             点击后关闭所在弹窗（遮罩本身被点击也会关闭）
 *   data-toast="文案"       点击后弹出 Toast（约 1.8 秒）
 *   data-go="页面.html"     点击后跳转（也可以直接用 <a href>）
 *   data-tabs 容器内：.tabs__item[data-tab="x"] 与 [data-panel="x"] 成对，点击切换
 *   data-state="b"          只在 URL 带 ?s=b 时显示（用来呈现空态/异常态/成功态，便于截图）
 *   data-state-not="b"      在 URL 带 ?s=b 时隐藏
 * 另外：页面加载时若 URL 带 ?open=#id，会自动打开对应弹窗，方便截图工具直接到达。
 */
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
