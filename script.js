document.addEventListener('DOMContentLoaded', () => {
  // Header scroll
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Fade-up on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Form → WhatsApp
  const form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const objectType = form.object ? form.object.value : '';
      const message = form.message ? form.message.value.trim() : '';
      if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
      }
      const labels = {
        private: 'Частный дом', apartment: 'Квартира / МКД',
        commercial: 'Коммерческий объект', industrial: 'Промышленный объект',
        horeca: 'Ресторан / кафе / гостиница', other: 'Другое',
        boiler: 'Газовый котёл', generator: 'Газовый генератор'
      };
      let text = `Здравствуйте! Заявка с сайта ГазКомм.%0A%0AИмя: ${encodeURIComponent(name)}%0AТелефон: ${encodeURIComponent(phone)}`;
      if (objectType) text += `%0AОбъект/товар: ${encodeURIComponent(labels[objectType] || objectType)}`;
      if (message) text += `%0AКомментарий: ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/996500303003?text=${text}`, '_blank');
      form.reset();
    });
  }

  // Phone mask hint
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+996 ';
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Video reviews: custom poster with logo, proper play
  document.querySelectorAll('.review-card').forEach(card => {
    const video = card.querySelector('video');
    const poster = card.querySelector('.review-card__poster');
    if (!video || !poster) return;

    // Ensure video is muted for autoplay compatibility, but allow unmute on play
    video.muted = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    poster.addEventListener('click', () => {
      poster.classList.add('hidden');
      video.controls = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay blocked, user can still use native controls
          video.controls = true;
        });
      }
    });

    video.addEventListener('ended', () => {
      poster.classList.remove('hidden');
      video.controls = false;
      video.currentTime = 0;
    });

    video.addEventListener('pause', () => {
      if (video.currentTime === 0 || video.ended) {
        poster.classList.remove('hidden');
      }
    });
  });
});
