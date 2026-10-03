
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
    try { await navigator.clipboard.writeText('info@ottstandard.com'); status.textContent='이메일 주소를 복사했습니다. 메일의 받는 사람 칸에 붙여 넣어 주세요.'; }
    catch(e) {status.textContent='주소를 직접 선택해 복사하세요: info@ottstandard.com';}
  }));
  route(true);
})();

/* ===== 자동 다국어 (구글 번역 기반) ===== */
(function(){
  if(document.querySelector('.policy')) return; /* 법률 페이지는 자체 번역 토글 사용 */
  var SUP={ko:1,ja:1,en:1};
  function base(){return location.hostname.replace(/^www\./,'');}
  function setTrans(tl){
    var exp='; expires='+new Date(Date.now()+365*864e5).toUTCString()+'; path=/';
    if(tl==='ko'){
      document.cookie='googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie='googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.'+base();
    } else {
      document.cookie='googtrans=/ko/'+tl+exp;
      document.cookie='googtrans=/ko/'+tl+exp+'; domain=.'+base();
    }
  }
  function curTL(){var m=document.cookie.match('(^|; )googtrans=([^;]*)');if(m){var p=decodeURIComponent(m[2]).split('/');return p[2]||'ko';}return 'ko';}
  var pref=null; try{pref=localStorage.getItem('langPref');}catch(e){}
  var target;
  if(pref&&SUP[pref]) target=pref;
  else { var l=(navigator.language||'ko').toLowerCase(); target=l.indexOf('ja')===0?'ja':l.indexOf('en')===0?'en':'ko'; }
  var cur=curTL();
  if(cur!==target){
    var mark=null; try{mark=sessionStorage.getItem('gtReload');}catch(e){}
    if(mark!==target){ try{sessionStorage.setItem('gtReload',target);}catch(e){} setTrans(target); location.reload(); return; }
  }
  window.googleTranslateElementInit=function(){
    new google.translate.TranslateElement({pageLanguage:'ko',includedLanguages:'ko,en,ja',autoDisplay:false},'google_translate_element');
  };
  var holder=document.createElement('div'); holder.id='google_translate_element'; holder.style.display='none'; document.body.appendChild(holder);
  var sc=document.createElement('script'); sc.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; sc.async=true; document.body.appendChild(sc);
  function choose(tl){ try{localStorage.setItem('langPref',tl);}catch(e){} try{sessionStorage.removeItem('gtReload');}catch(e){} setTrans(tl); location.reload(); }
  document.querySelectorAll('nav.nav').forEach(function(nav){
    if(nav.querySelector('.lang-switch'))return;
    var w=document.createElement('span'); w.className='lang-switch notranslate'; w.setAttribute('translate','no');
    [['ko','KO'],['ja','日本語'],['en','EN']].forEach(function(p){
      var b=document.createElement('button'); b.type='button'; b.textContent=p[1]; b.setAttribute('aria-label',p[1]+'로 보기');
      if(p[0]===target) b.classList.add('on');
      b.addEventListener('click',function(){choose(p[0]);});
      w.appendChild(b);
    });
    nav.appendChild(w);
  });
})();
