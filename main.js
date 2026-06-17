/* ── PHONE MASK ────────────────────────────── */
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
  let val = e.target.value.replace(/\D/g, '');
  if (val.startsWith('8')) val = '7' + val.slice(1);
  if (!val.startsWith('7') && val.length > 0) val = '7' + val;
  val = val.slice(0, 11);
  let formatted = '+7';
  if (val.length > 1) formatted += ' (' + val.slice(1, 4);
  if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
  if (val.length >= 7) formatted += '-' + val.slice(7, 9);
  if (val.length >= 9) formatted += '-' + val.slice(9, 11);
  e.target.value = formatted;
});
phoneInput.addEventListener('keydown', function(e) {
  if (e.key === 'Backspace' && this.value === '+7') e.preventDefault();
});
phoneInput.addEventListener('focus', function() {
  if (!this.value) this.value = '+7 ';
});

/* ── HEADER SCROLL ─────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── BURGER MENU ───────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ── SCROLL REVEAL ─────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── FORM SUBMIT ───────────────────────────── */
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const consent = document.getElementById('consent');
  const consentLabel = consent.closest('.checkbox-label');

  // Валидация телефона
  if (!phone || phone.replace(/\D/g, '').length < 11) {
    phoneInput.style.borderColor = '#ef4444';
    phoneInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
    phoneInput.focus();
    setTimeout(() => {
      phoneInput.style.borderColor = '';
      phoneInput.style.boxShadow = '';
    }, 2000);
    return;
  }

  // Валидация чекбокса согласия
  if (!consent.checked) {
    consentLabel.classList.add('error');
    consentLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => consentLabel.classList.remove('error'), 2500);
    return;
  }

  const msg = `🚗 Новая заявка с сайта!\n👤 Имя: ${name || 'Не указано'}\n📞 Телефон: ${phone}`;
  const BOT_TOKEN = '8905437640:AAFBSrTKO_hQzyfZB_8kllZq6VRSqrBnB9c';
  const CHAT_ID = '664345402';
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
  });

  this.style.display = 'none';
  document.getElementById('form-success').classList.add('show');
  setTimeout(() => window.open(tgUrl, '_blank'), 400);
});

/* ── MODALS ────────────────────────────────── */
function openModal(type) {
  document.getElementById('modal-' + type).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(type) {
  document.getElementById('modal-' + type).classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

/* ── COOKIE BANNER ─────────────────────────── */
function showCookieBanner() {
  if (!localStorage.getItem('cookieAccepted')) {
    setTimeout(() => {
      document.getElementById('cookie-banner').classList.add('show');
    }, 2000);
  }
}

function acceptCookie() {
  localStorage.setItem('cookieAccepted', 'true');
  document.getElementById('cookie-banner').classList.remove('show');
}

function dismissCookie() {
  document.getElementById('cookie-banner').classList.remove('show');
}

showCookieBanner();

/* ── SMOOTH ANCHOR ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});