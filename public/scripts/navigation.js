const toggle = document.querySelector('.mobile-toggle');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  document.querySelector('.main-nav')?.classList.toggle('open', open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  toggle?.setAttribute('aria-expanded', 'false');
  document.querySelector('.main-nav')?.classList.remove('open');
}));
document.addEventListener('keydown', event => { if(event.key==='Escape') { toggle?.setAttribute('aria-expanded','false'); document.querySelector('.main-nav')?.classList.remove('open'); } });
// PII-free event hook only. No remote analytics is loaded or sent.
document.querySelectorAll('[data-conversion]').forEach(el => el.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('smart-exam:conversion', { detail: { event: el.dataset.conversion, path: location.pathname } }));
}));
