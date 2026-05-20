document.addEventListener("DOMContentLoaded", () => {
  initHeader(); initMobileMenu(); initSmoothScroll(); initScrollReveal();
  initReviewsSlider(); initFAQ(); initContactForm(); initPhoneMask(); initPrivacyModal();
  initBackToTop(); initThemeToggle(); initMoodSelector();
  initQuiz(); initBreathing(); initReadingProgress(); initEasterEgg();
});

function initHeader() {
  const h = document.getElementById("header");
  if (!h) return;
  const upd = () => h.classList.toggle("header--scrolled", window.scrollY > 50);
  window.addEventListener("scroll", upd, { passive: true });
  upd();
}

function initMobileMenu() {
  const b = document.getElementById("burger"), n = document.getElementById("nav");
  if (!b || !n) return;
  const toggleMenu = () => {
    const isOpen = n.classList.toggle("nav--open");
    b.classList.toggle("burger--active");
    b.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };
  b.addEventListener("click", toggleMenu);
  n.querySelectorAll(".nav__link").forEach(l => l.addEventListener("click", () => {
    if (n.classList.contains("nav--open")) toggleMenu();
  }));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const t = document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    const hh = document.getElementById("header")?.offsetHeight || 0;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - hh - 20, behavior: "smooth" });
  }));
  const secs = document.querySelectorAll("section[id]"), links = document.querySelectorAll(".nav__link"), hh = document.getElementById("header")?.offsetHeight || 0;
  window.addEventListener("scroll", () => {
    const pos = window.scrollY + hh + 100;
    secs.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        const id = s.getAttribute("id");
        links.forEach(l => l.classList.toggle("nav__link--active", l.getAttribute("href") === "#" + id));
      }
    });
  }, { passive: true });
}

function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const sibs = Array.from(e.target.parentElement?.children || []);
        setTimeout(() => e.target.classList.add("revealed"), sibs.indexOf(e.target) * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => obs.observe(el));
}

function initReviewsSlider() {
  const track = document.getElementById("reviewsTrack"), prev = document.getElementById("reviewsPrev"), next = document.getElementById("reviewsNext"), dotsWrap = document.getElementById("reviewsDots");
  if (!track) return;
  const cards = track.querySelectorAll(".review-card");
  if (!cards.length) return;
  let cur = 0;
  const vis = () => window.innerWidth <= 768 ? 1 : 2;
  const mx = () => Math.max(0, cards.length - vis());
  
  const buildDots = () => {
    dotsWrap.innerHTML = "";
    const total = Math.ceil(cards.length / vis());
    for (let i = 0; i < total; i++) {
      const d = document.createElement("button");
      d.className = "reviews__dot" + (i === 0 ? " reviews__dot--active" : "");
      d.setAttribute("aria-label", `Перейти к отзыву ${i + 1}`);
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
    }
  };
  const updDots = () => dotsWrap.querySelectorAll(".reviews__dot").forEach((d, i) => d.classList.toggle("reviews__dot--active", i === cur));
  const go = (i) => {
    cur = Math.max(0, Math.min(i, mx()));
    const offset = cur * (cards[0].offsetWidth + 24);
    track.style.transform = `translateX(-${offset}px)`;
    updDots();
  };
  
  prev?.addEventListener("click", () => go(cur - 1));
  next?.addEventListener("click", () => go(cur + 1));
  
  let sx = 0;
  track.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener("touchend", e => {
    const d = sx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) go(cur + (d > 0 ? 1 : -1));
  }, { passive: true });
  
  window.addEventListener("resize", () => { cur = 0; go(0); buildDots(); });
  buildDots();
}

function initFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-item__question");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("faq-item--open");
      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("faq-item--open");
        i.querySelector(".faq-item__question")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("faq-item--open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm"), succ = document.getElementById("contactSuccess");
  const consent = document.getElementById("consent"), consentGroup = document.querySelector(".form-checkbox-group");
  if (!form) return;

  const validateField = (input) => {
    const group = input.closest(".form-group");
    let isValid = true;
    if (input.required && !input.value.trim()) isValid = false;
    if (input.pattern && !new RegExp(input.pattern).test(input.value)) isValid = false;
    group?.classList.toggle("form-group--error", !isValid);
    return isValid;
  };

  const validateConsent = () => {
    const ok = consent.checked;
    consentGroup?.classList.toggle("form-checkbox-group--error", !ok);
    return ok;
  };

  ["input", "blur"].forEach(evt => form.addEventListener(evt, e => validateField(e.target)));
  consent?.addEventListener("change", validateConsent);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = form.querySelector("#name");
    const phone = form.querySelector("#phone");
    let ok = validateField(name) && validateField(phone) && validateConsent();
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.querySelector(".btn__text");
    const load = btn.querySelector(".btn__loader");
    btn.disabled = true; txt.style.display = "none"; load.style.display = "block";

    try {
      const templateParams = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        telegram: form.querySelector("#telegram")?.value.trim() || "не указан",
        message: form.querySelector("#message")?.value.trim() || "нет сообщения",
        service_id: "service_ud3szi1",
        template_id: "template_nfxqeou"
      };
      await emailjs.send(templateParams.service_id, templateParams.template_id, templateParams);
      form.reset();
      form.style.display = "none";
      succ.style.display = "flex";
    } catch (err) {
      console.error("EmailJS Error:", err);
      btn.disabled = false; txt.style.display = "block"; load.style.display = "none";
      alert("Не удалось отправить заявку. Попробуйте позже или напишите напрямую.");
    }
  });
}

function initPrivacyModal() {
  const modal = document.getElementById("privacyModal");
  const openBtn = document.getElementById("openPrivacy");
  const closeBtn = modal?.querySelector(".modal__close");
  if (!modal || !openBtn) return;

  const open = (e) => {
    e.preventDefault();
    modal.classList.add("modal-overlay--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.classList.remove("modal-overlay--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("modal-overlay--open")) close(); });
}

function initPhoneMask() {
  const inp = document.getElementById("phone");
  if (!inp) return;
  inp.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 1 && v[0] === "8") v = "7" + v.slice(1);
    if (v[0] !== "7") v = "7" + v;
    
    let formatted = "+7";
    if (v.length > 1) formatted += " (" + v.slice(1, 4);
    if (v.length >= 5) formatted += ") " + v.slice(4, 7);
    if (v.length >= 8) formatted += "-" + v.slice(7, 9);
    if (v.length >= 10) formatted += "-" + v.slice(9, 11);
    
    e.target.value = formatted;
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("back-to-top--visible", window.scrollY > 500), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initThemeToggle() {
  const t = document.getElementById("themeToggle");
  if (!t) return;
  const html = document.documentElement, themes = ["light", "pastel", "dark"];
  let cur = themes.indexOf(localStorage.getItem("theme")) !== -1 ? themes.indexOf(localStorage.getItem("theme")) : 0;
  html.setAttribute("data-theme", themes[cur]);
  
  t.addEventListener("click", () => {
    cur = (cur + 1) % themes.length;
    html.setAttribute("data-theme", themes[cur]);
    localStorage.setItem("theme", themes[cur]);
    const icons = ["☀", "🌸", "🌙"];
    t.textContent = icons[cur];
  });
  const icons = ["☀", "🌸", "🌙"];
  t.textContent = icons[cur];
}

function initMoodSelector() {
  document.querySelectorAll(".hero__mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.target, sec = document.getElementById(t);
      if (!sec) return;
      btn.style.transform = "scale(0.9)"; setTimeout(() => btn.style.transform = "", 150);
      const hh = document.getElementById("header")?.offsetHeight || 0;
      window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - hh - 20, behavior: "smooth" });
      setTimeout(() => {
        const cards = sec.querySelectorAll(".service-card");
        const map = { anxiety: 0, stress: 1, burnout: 2, self: 6, relations: 4 };
        const idx = map[btn.dataset.scroll];
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: "smooth", block: "center" });
          cards[idx].style.cssText = "transition:all 0.6s ease;transform:scale(1.03);box-shadow:0 25px 50px rgba(184,123,110,0.2);";
          setTimeout(() => cards[idx].style.cssText = "", 2000);
        }
      }, 600);
    });
  });
}

function initQuiz() {
  const wrap = document.getElementById("quizWrapper");
  if (!wrap) return;
  const slides = wrap.querySelectorAll(".quiz__slide"), progress = document.getElementById("quizProgress");
  const result = document.getElementById("quizResult"), rTitle = document.getElementById("quizResultTitle"), rText = document.getElementById("quizResultText");
  let cur = 0; const answers = [];
  const updProg = () => { if (progress) progress.querySelector(".quiz__progress-bar").style.width = ((cur + 1) / slides.length * 100) + "%"; };
  const show = (i) => slides.forEach((s, j) => s.classList.toggle("quiz__slide--active", j === i));
  
  const showResult = () => {
    // Подсчёт частоты ответов
    const counts = answers.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
    const topKey = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
    
    const recs = {
      anxiety: { t: "Работа с тревогой", d: "Когнитивно-поведенческий подход поможет справиться с тревожными мыслями. Начнём с мягкого анализа паттернов." },
      relations: { t: "Работа с отношениями", d: "Помогу разобраться в паттернах и выстроить здоровые границы. Фокус на диалоге и понимании." },
      burnout: { t: "Восстановление ресурсов", d: "Выгорание требует бережного подхода. Восстановим силы через техники mindfulness и планирование отдыха." },
      self: { t: "Поиск себя", d: "Гештальт-подход поможет услышать себя, принять текущее состояние и найти ваш путь." }
    };
    const r = recs[topKey] || recs.anxiety;
    rTitle.textContent = r.t; rText.textContent = r.d;
    
    slides.forEach(s => s.style.display = "none");
    progress.style.display = "none";
    result.classList.add("quiz__result--show");
  };

  slides.forEach(slide => slide.querySelectorAll(".quiz__option").forEach(opt => opt.addEventListener("click", () => {
    answers.push(opt.dataset.value);
    if (cur < slides.length - 1) { cur++; show(cur); updProg(); }
    else { showResult(); }
  })));
  
  document.getElementById("quizRestart")?.addEventListener("click", () => {
    cur = 0; answers.length = 0;
    slides.forEach(s => s.style.display = "block");
    slides.forEach((s, i) => s.classList.toggle("quiz__slide--active", i === 0));
    progress.style.display = "block";
    result.classList.remove("quiz__result--show");
    updProg();
  });
  updProg();
}

function initBreathing() {
  const circle = document.getElementById("breathingCircle"), text = document.getElementById("breathingText");
  const btn = document.getElementById("breathingStart"), particles = document.getElementById("breathingParticles");
  if (!circle || !btn || !particles) return;
  
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("span"); p.className = "breathing__particle";
    const angle = (i / 8) * Math.PI * 2, dist = 130;
    p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    p.style.left = "50%"; p.style.top = "50%"; p.style.animationDelay = (i * 0.5) + "s";
    particles.appendChild(p);
  }
  
  let running = false, interval;
  const cycle = () => {
    if (!running) return;
    text.textContent = "Вдох...";
    setTimeout(() => { if (running) text.textContent = "Задержка..."; }, 3000);
    setTimeout(() => { if (running) text.textContent = "Выдох..."; }, 5500);
  };
  
  btn.addEventListener("click", () => {
    if (running) { running = false; circle.classList.remove("breathing__circle--active"); text.textContent = "Начнём"; btn.textContent = "Начать дыхание"; clearInterval(interval); }
    else { running = true; circle.classList.add("breathing__circle--active"); btn.textContent = "Остановить"; cycle(); interval = setInterval(cycle, 8000); }
  });
}

function initReadingProgress() {
  const bar = document.createElement("div"); bar.className = "reading-progress"; document.body.appendChild(bar);
  const upd = () => { const h = document.documentElement; bar.style.width = Math.min(100, Math.max(0, (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100)) + "%"; };
  window.addEventListener("scroll", upd, { passive: true }); upd();
}

function initEasterEgg() {
  let count = 0, last = 0;
  document.addEventListener("keydown", e => {
    if (e.code !== "Space") return;
    const now = Date.now();
    count = (now - last < 800) ? count + 1 : 1; last = now;
    if (count >= 3) {
      count = 0; e.preventDefault();
      const hint = document.createElement("div");
      hint.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--c-surface);padding:24px 32px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.15);z-index:10001;text-align:center;border:1px solid var(--c-border);";
      hint.innerHTML = "<p style='font-size:28px;margin-bottom:8px;'>🫁</p><p style='font-family:var(--f-h);font-size:18px;color:var(--c-text);margin-bottom:4px;'>Не забывайте дышать</p><p style='font-size:14px;color:var(--c-text-muted);'>Прокрутите к форме записи — там есть упражнение</p>";
      document.body.appendChild(hint);
      setTimeout(() => { hint.style.opacity = "0"; hint.style.transition = "opacity 0.4s"; setTimeout(() => hint.remove(), 400); }, 3000);
    }
  });
}