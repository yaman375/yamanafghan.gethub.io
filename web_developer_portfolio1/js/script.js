
const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');

if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    })
  );
}

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === current) a.classList.add('active');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      if (entry.target.classList.contains('bar')) {
        const fill = entry.target.querySelector('i');
        if (fill) fill.style.width = `${entry.target.dataset.width || 0}%`;
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal,.bar').forEach(el => observer.observe(el));

const typed = document.querySelector('[data-typing]');
if (typed) {
  const words = ['Web Developer','Frontend Developer','UI Builder','Freelancer'];
  let wi = 0, ci = 0, deleting = false;
  const type = () => {
    const word = words[wi];
    typed.textContent = word.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > word.length) { deleting = true; setTimeout(type, 1000); return; }
    } else {
      ci--;
      if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 55 : 95);
  };
  type();
}

document.querySelectorAll('.year').forEach(x => x.textContent = new Date().getFullYear());

const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const note = document.querySelector('#formNote');
    const button = document.querySelector('#submitBtn');
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      note.textContent = 'Please complete your name, email, and message.';
      note.className = 'form-note error';
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending...';
    note.textContent = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.error || 'Unable to send your message.');

      note.textContent = 'Message sent successfully. I will reply to you by email.';
      note.className = 'form-note success';
      form.reset();
    } catch (error) {
      note.textContent = error.message || 'Something went wrong. Please try again.';
      note.className = 'form-note error';
    } finally {
      button.disabled = false;
      button.textContent = 'Send Project Inquiry →';
    }
  });
}
