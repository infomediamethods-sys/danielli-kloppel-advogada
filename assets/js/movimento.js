/* movimento.js — movimento do site da Danielli Klöppel, reproduzido da referência (alessandrielotorto.it; Kit §Movimento,
   design.md §10). Sem entrada de seção (a referência não tem). Tudo que reage à rolagem passa por window.aoRolar.
   Só transform/opacity/classes. prefers-reduced-motion: sem barra de progresso e sem transform (CSS). */
(function () {
  'use strict';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Barra de progresso de leitura (scaleX) e cabeçalho-pílula que encolhe depois de 60px */
  var barra = document.querySelector('.progresso__barra');
  var cab = document.querySelector('.cabecalho');
  var rolado = false;
  if (window.aoRolar) {
    window.aoRolar(function (d) {
      if (barra && !reduzir) barra.style.transform = 'scaleX(' + d.progress.toFixed(4) + ')';
      var r = d.scroll > 60;
      if (cab && r !== rolado) { rolado = r; cab.classList.toggle('rolado', r); }
    });
  }

  /* Seletor em pílula (abas): clique, setas, Home/End */
  var seletor = document.querySelector('.seletor');
  if (seletor) {
    var abas = Array.prototype.slice.call(seletor.querySelectorAll('[role="tab"]'));
    var ativar = function (i, foco) {
      abas.forEach(function (a, j) {
        var on = i === j;
        a.setAttribute('aria-selected', on ? 'true' : 'false');
        a.tabIndex = on ? 0 : -1;
        var p = document.getElementById(a.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      seletor.dataset.ativa = String(i + 1);
      if (foco) abas[i].focus();
    };
    abas.forEach(function (a, i) {
      a.addEventListener('click', function () { ativar(i, false); });
      a.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % abas.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + abas.length) % abas.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = abas.length - 1;
        if (n !== null) { e.preventDefault(); ativar(n, true); }
      });
    });
  }

  /* Modal das frases ("Em poucas linhas"): <dialog> nativo, Esc fecha, foco volta à frase, Lenis parado */
  var origem = null;
  var fechar = function (dlg) { if (dlg.open) dlg.close(); };
  document.querySelectorAll('[data-abre-modal]').forEach(function (b) {
    b.addEventListener('click', function () {
      var dlg = document.getElementById(b.getAttribute('data-abre-modal'));
      if (!dlg || typeof dlg.showModal !== 'function') return;
      origem = b;
      dlg.showModal();
      if (window.__lenis) window.__lenis.stop();
    });
  });
  document.querySelectorAll('dialog.modal').forEach(function (dlg) {
    dlg.querySelectorAll('[data-fechar-modal]').forEach(function (x) { x.addEventListener('click', function () { fechar(dlg); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) fechar(dlg); });
    dlg.addEventListener('close', function () {
      if (window.__lenis) window.__lenis.start();
      if (origem) { origem.focus(); origem = null; }
    });
  });
})();
