// ===== HAMBURGER MENU =====
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const btn = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== NAVBAR ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 80;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });

  // Navbar shadow on scroll
  const nav = document.querySelector('nav');
  nav.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(0,0,0,0.15)'
    : '0 2px 12px rgba(0,0,0,0.1)';
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = count + suffix;
  }, 25);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-item .num').forEach(el => {
        const val = parseInt(el.dataset.val);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, val, suffix);
      });
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) observer.observe(statsBar);

// ===== MODAL =====
function openModal() {
  document.getElementById('wa-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('wa-modal')) {
    document.getElementById('wa-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('wa-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
});


async function sendWhatsApp() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-msg').value.trim();

  if (!name || !message) {
    alert('Please enter your name and message.');
    return;
  }

  const btn = document.querySelector('.btn-whatsapp');
  btn.disabled = true;
  btn.innerHTML = `<span style="opacity:0.8">Sending...</span>`;

  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, message }),
    });

    const data = await res.json();

    if (data.success) {
      window.open(data.waLink, '_blank');
      document.getElementById('wa-modal').classList.remove('open');
      document.body.style.overflow = '';
      ['f-name','f-phone','f-email','f-msg'].forEach(id => document.getElementById(id).value = '');
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch (err) {
    // Fallback: direct WhatsApp if backend not running
    const text = encodeURIComponent(
      `Hello Dynamic Engineers,\n\n*Name:* ${name}\n*Phone:* ${phone || 'N/A'}\n*Email:* ${email || 'N/A'}\n\n*Message:*\n${message}`
    );
    window.open(`https://wa.me/917709052619?text=${text}`, '_blank');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.797 1.848 6.787L2 30l7.43-1.82A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.8-1.573l-.416-.247-4.41 1.082 1.115-4.3-.272-.44A11.46 11.46 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.61c-.345-.172-2.04-1.006-2.356-1.12-.316-.115-.546-.172-.776.172-.23.345-.89 1.12-1.09 1.35-.2.23-.4.258-.745.086-.345-.172-1.456-.537-2.773-1.71-1.025-.913-1.717-2.04-1.918-2.385-.2-.345-.021-.531.15-.703.155-.155.345-.4.517-.6.172-.2.23-.345.345-.575.115-.23.057-.43-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.59l-.66-.011c-.23 0-.603.086-.918.43-.316.345-1.205 1.178-1.205 2.872s1.234 3.33 1.406 3.56c.172.23 2.428 3.71 5.882 5.203.822.355 1.463.567 1.963.726.824.263 1.574.226 2.167.137.66-.099 2.04-.834 2.328-1.638.287-.804.287-1.493.2-1.638-.086-.144-.316-.23-.66-.4z"/></svg> Send via WhatsApp`;
  }
}
const slides = document.querySelectorAll('.hero-slide');
let current = 0;

function nextSlide() {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}

if (slides.length > 1) setInterval(nextSlide, 4000);
