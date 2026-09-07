
(() => {
  const standalone = document.body.dataset.mode === 'standalone';
  const labels = {"home": "홈", "learning": "학습 콘텐츠", "about": "만든 이야기", "docs": "사용 안내", "pricing": "요금제", "start": "시작하기", "support": "도움말·문의", "terms": "이용약관", "privacy": "개인정보처리방침", "refund": "환불 정책"};
  function openTarget(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    requestAnimationFrame(() => { el.scrollIntoView({block:'start'}); });
  }
  function route(initial = false) {
    if (!standalone) { if(location.hash) openTarget(location.hash.slice(1)); return; }
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const key = Object.hasOwn(labels, parts[0]) ? parts[0] : 'home';
    document.querySelectorAll('.site-page').forEach(p => p.hidden = p.dataset.page !== key);
    document.querySelectorAll('[data-nav]').forEach(a => {
      if(a.dataset.nav === key) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    document.title = labels[key] + ' · OTT STANDARD';
    if(parts[1]) openTarget(parts[1]);
    else { window.scrollTo(0,0); if(!initial){const h=document.querySelector('.site-page:not([hidden]) h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}} }
  }
  window.addEventListener('hashchange', () => route(false));
  document.addEventListener('click', e => {
    const a=e.target.closest('a');
    if(!a) return;
    const href=a.getAttribute('href') || '';
    if(href==='#main'){e.preventDefault();const main=document.getElementById('main');main.tabIndex=-1;main.focus();main.scrollIntoView({block:'start'});return;}
    if(href===location.hash && href.startsWith('#/')) { e.preventDefault();route(false); }
    if(!standalone && href.startsWith('#')) openTarget(href.slice(1));
  });
  document.querySelectorAll('.policy').forEach(policy => {
    policy.querySelectorAll('[data-l]').forEach(button => button.addEventListener('click', () => {
      const lang=button.dataset.l;
      policy.querySelectorAll('[data-l]').forEach(b=>{b.classList.toggle('on', b===button);b.setAttribute('aria-pressed',String(b===button));});
      policy.querySelectorAll('[data-policy-lang]').forEach(section => section.hidden=section.dataset.policyLang!==lang);
    }));
  });
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click',async()=>{
    const status=button.parentElement.querySelector('.copy-status');
    try { await navigator.clipboard.writeText('info@ottstandard.com'); status.textContent='이메일 주소를 복사했습니다.'; }
    catch(e) {status.textContent='주소를 직접 선택해 복사하세요: info@ottstandard.com';}
  }));
  route(true);
})();
