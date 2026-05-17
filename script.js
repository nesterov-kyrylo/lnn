document.addEventListener("DOMContentLoaded", () => {
    initHeader(); initMobileMenu(); initSmoothScroll(); initScrollReveal();
    initReviewsSlider(); initFAQ(); initContactForm(); initPhoneMask();
    initBackToTop(); initThemeToggle(); initTypewriter(); initMoodSelector();
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
    b.addEventListener("click", () => {
        b.classList.toggle("burger--active");
        n.classList.toggle("nav--open");
        document.body.style.overflow = n.classList.contains("nav--open") ? "hidden" : "";
    });
    n.querySelectorAll(".nav__link").forEach(l => l.addEventListener("click", () => {
        if (n.classList.contains("nav--open")) {
            b.classList.remove("burger--active"); n.classList.remove("nav--open");
            document.body.style.overflow = "";
        }
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
    dotsWrap.innerHTML = "";
    for (let i = 0; i < Math.ceil(cards.length / vis()); i++) {
        const d = document.createElement("button");
        d.className = "reviews__dot" + (i === 0 ? " reviews__dot--active" : "");
        d.addEventListener("click", () => go(i));
        dotsWrap.appendChild(d);
    }
    const updDots = () => dotsWrap.querySelectorAll(".reviews__dot").forEach((d, i) => d.classList.toggle("reviews__dot--active", i === cur));
    const go = (i) => { cur = Math.max(0, Math.min(i, mx())); track.style.transform = "translateX(-" + (cur * (cards[0].offsetWidth + 24)) + "px)"; updDots(); };
    prev?.addEventListener("click", () => go(cur - 1));
    next?.addEventListener("click", () => go(cur + 1));
    let sx = 0;
    track.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", e => { const d = sx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) go(cur + (d > 0 ? 1 : -1)); }, { passive: true });
    window.addEventListener("resize", () => { cur = 0; go(0); });
}

function initFAQ() {
    document.querySelectorAll(".faq-item").forEach(item => {
        const q = item.querySelector(".faq-item__question");
        q.addEventListener("click", () => {
            const was = item.classList.contains("faq-item--open");
            document.querySelectorAll(".faq-item").forEach(i => { i.classList.remove("faq-item--open"); i.querySelector(".faq-item__question")?.setAttribute("aria-expanded", "false"); });
            if (!was) { item.classList.add("faq-item--open"); q.setAttribute("aria-expanded", "true"); }
        });
    });
}

function initContactForm() {
    const form = document.getElementById("contactForm"), succ = document.getElementById("contactSuccess");
    if (!form) return;
    form.addEventListener("submit", e => {
        e.preventDefault();
        form.querySelectorAll(".form-group--error").forEach(g => g.classList.remove("form-group--error"));
        let ok = true;
        const name = form.querySelector("#name");
        if (!name.value.trim()) { name.closest(".form-group").classList.add("form-group--error"); ok = false; }
        const phone = form.querySelector("#phone");
        if (phone.value.replace(/\D/g, "").length < 10) { phone.closest(".form-group").classList.add("form-group--error"); ok = false; }
        if (!ok) return;
        const btn = form.querySelector('button[type="submit"]'), txt = btn.querySelector(".btn__text"), load = btn.querySelector(".btn__loader");
        btn.disabled = true; txt.style.display = "none"; load.style.display = "block";
        setTimeout(() => { form.style.display = "none"; succ.style.display = "flex"; }, 1500);
    });
}

function initPhoneMask() {
    const inp = document.getElementById("phone");
    if (!inp) return;
    inp.addEventListener("input", e => {
        const v = e.target.value.replace(/\D/g, ""), m = v.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (!m) return;
        let r = ""; if (m[1]) r += "+" + m[1]; if (m[2]) r += " (" + m[2]; if (m[3]) r += ") " + m[3]; if (m[4]) r += "-" + m[4]; if (m[5]) r += "-" + m[5];
        e.target.value = r;
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
    let cur = 0;
    const saved = localStorage.getItem("theme");
    if (saved) { cur = themes.indexOf(saved); if (cur >= 0) html.setAttribute("data-theme", saved); }
    t.addEventListener("click", () => { cur = (cur + 1) % themes.length; html.setAttribute("data-theme", themes[cur]); localStorage.setItem("theme", themes[cur]); });
}

function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    const phrases = ["Помогаю обрести\nвнутреннюю опору\nи спокойствие", "Нахожу слова,\nкогда их\nне хватает", "Создаю\nбезопасное\nпространство"];
    let pi = 0, ci = 0, del = false;
    const type = () => {
        const cur = phrases[pi];
        if (del) { el.textContent = cur.substring(0, ci - 1); ci--; } else { el.textContent = cur.substring(0, ci + 1); ci++; }
        let spd = del ? 30 : 70;
        if (!del && ci === cur.length) { spd = 2000; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; spd = 500; }
        setTimeout(type, spd);
    };
    setTimeout(type, 600);
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
                const map = { anxiety: 0, stress: 1, burnout: 2, self: 3, relations: 4 };
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
    let cur = 0; const ans = [];
    const updProg = () => { if (progress) progress.style.width = ((cur + 1) / slides.length * 100) + "%"; };
    const show = (i) => slides.forEach((s, j) => s.classList.toggle("quiz__slide--active", j === i));
    slides.forEach(slide => slide.querySelectorAll(".quiz__option").forEach(opt => opt.addEventListener("click", () => {
        ans.push(opt.dataset.value);
        if (cur < slides.length - 1) { cur++; show(cur); updProg(); }
        else {
            const recs = { anxiety: { t: "Работа с тревогой", d: "Когнитивно-поведенческий подход поможет справиться с тревожными мыслями." }, relations: { t: "Работа с отношениями", d: "Помогу разобраться в паттернах и выстроить здоровые границы." }, burnout: { t: "Восстановление ресурсов", d: "Выгорание требует бережного подхода. Восстановим силы." }, self: { t: "Поиск себя", d: "Гештальт-подход поможет услышать себя и найти ваш путь." } };
            const r = recs[ans[0]] || recs.anxiety;
            rTitle.textContent = r.t; rText.textContent = r.d;
            slides.forEach(s => s.style.display = "none");
            if (progress) progress.parentElement.style.display = "none";
            result.classList.add("quiz__result--show");
        }
    })));
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
