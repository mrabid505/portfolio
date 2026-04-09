// ===== MATRIX NAME ANIMATION =====
function matrixReveal(elementId, text, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  let iteration = 0;
  const finalText = text;
  const interval = setInterval(() => {
    el.innerHTML = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return '<span> </span>';
        if (i < iteration) {
          return `<span class="${i < finalText.indexOf(' ') || finalText.indexOf(' ') === -1 ? '' : 'highlight'}">${finalText[i]}</span>`;
        }
        return `<span style="color:#f5c518;opacity:0.4">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
      })
      .join('');
    if (iteration >= finalText.length) {
      clearInterval(interval);
      // Final render with proper highlight
      el.innerHTML = finalText
        .split(' ')
        .map((word, wi) =>
          wi === 0
            ? `<span>${word}</span>`
            : `<span class="highlight">${word}</span>`
        )
        .join(' ');
      if (callback) callback();
    }
    iteration += 0.4;
  }, 40);
}

// Ye line dhundo aur replace karo jahan typing animation start hoti hai
// setTimeout(typeLoop, 1000);  <-- ye wali line k UPAR ye add karo:
window.addEventListener('load', () => {
  setTimeout(() => {
    // MODIFY: Apna naam yahan likhو
    matrixReveal('heroName', 'Hi I am Abid Mehmood');
  }, 300);
  setTimeout(typeLoop, 1800);
});
// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 80);
});

// ===== PARTICLES =====
const container = document.getElementById('particles');
if (container) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    const size = (Math.random() * 3 + 1) + 'px';
    p.style.width = size;
    p.style.height = size;
    container.appendChild(p);
  }
}

// ===== TYPING ANIMATION =====
// MODIFY: Add more titles in this array
const titles = [
  'Senior IT Technician',
  'Learning – Backend Development',
  'Data Analyst',
  'AI / ML Enthusiast',
  'Mentor & Freelancing Coach'
];
let tIdx = 0, cIdx = 0, deleting = false;
const titleEl = document.getElementById('typingTitle');

function typeLoop() {
  if (!titleEl) return;
  const current = titles[tIdx];
  if (!deleting) {
    titleEl.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) { deleting = true; setTimeout(typeLoop, 3000); return; }
  } else {
    titleEl.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; }
  }
  setTimeout(typeLoop, deleting ? 80 : 130);
}
setTimeout(typeLoop, 1000);

// ===== SMOOTH SCROLL =====
function goTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== DOT NAV ACTIVE STATE =====
const sectionIds = ['home', 'about', 'skills', 'experience', 'contact'];
const dots = document.querySelectorAll('.dot');

const secObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = sectionIds.indexOf(entry.target.id);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.5 });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) secObserver.observe(el);
});

// ===== CONTACT FORM — sends to Flask /api/contact =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');
    btn.disabled = true;
    btn.textContent = '[ SENDING... ]';
    msg.textContent = '';
    msg.className = 'form-msg';

    const payload = {
      name:    document.getElementById('fname').value.trim(),
      email:   document.getElementById('femail').value.trim(),
      subject: document.getElementById('fsubject').value.trim(),
      message: document.getElementById('fmessage').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = '✓ Message sent! I will reply within 24 hours.';
        msg.className = 'form-msg success';
        form.reset();
        btn.textContent = '[ MESSAGE SENT ✓ ]';
        setTimeout(() => { btn.textContent = '[ SEND MESSAGE → ]'; btn.disabled = false; }, 3000);
      } else {
        msg.textContent = '✗ ' + (data.message || 'Something went wrong.');
        msg.className = 'form-msg error';
        btn.textContent = '[ SEND MESSAGE → ]';
        btn.disabled = false;
      }
    } catch (err) {
      msg.textContent = '✗ Network error. Please try again.';
      msg.className = 'form-msg error';
      btn.textContent = '[ SEND MESSAGE → ]';
      btn.disabled = false;
    }
  });
}
