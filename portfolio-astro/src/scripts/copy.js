/* Mail: copia la dirección y abre el correo si se puede. */
let toast = null, toastT;

export const say = html => { toast.innerHTML = html; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2600); };

export function initCopy() {
  toast = document.getElementById('toast');
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const mail = a.getAttribute('href').slice(7);
    const ok = () => say('<b>✓</b> Copiado: ' + mail);
    try { navigator.clipboard.writeText(mail).then(ok, () => say('Escribime a <b>' + mail + '</b>')); } catch (er) { say('Escribime a <b>' + mail + '</b>'); }
    try { window.open(a.href, '_blank', 'noopener'); } catch (er) {}
    if (a.classList.contains('hb')) gsap.fromTo(a.querySelectorAll('span'), { yPercent: 0 }, { yPercent: -18, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, stagger: .03 });
  }));
}
