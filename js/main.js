(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const loader = $("#loader");
  window.addEventListener("load", () => {
    window.setTimeout(() => loader?.classList.add("hidden"), 450);
  });

  const navbar = $("#navbar");
  const updateNav = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 24);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const hamburger = $("#hamburger");
  const mobileMenu = $("#mob-menu");
  const closeMenu = () => {
    hamburger?.classList.remove("active");
    hamburger?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  hamburger?.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu?.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  $$("#mob-menu a").forEach((link) => link.addEventListener("click", closeMenu));

  const marquee = $("#marquee");
  if (marquee) {
    const items = [
      "Actas de nacimiento",
      "Actas de matrimonio",
      "RFC",
      "Buró de crédito",
      "Círculo de crédito",
      "Seguro Social",
      "Papelería y oficina",
      "Accesorios para celular"
    ];
    const content = items.map((item) => `<span>${item}</span>`).join("");
    marquee.innerHTML = content + content;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const end = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const duration = 1300;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(end * eased);
        el.textContent = `${prefix}${value.toLocaleString("es-MX")}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.55 });

  $$(".stat-num[data-count]").forEach((el) => counterObserver.observe(el));

  const form = $("#wa-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#f-name")?.value.trim();
    const interest = $("#f-interest")?.value.trim();
    const message = $("#f-msg")?.value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola, visité su sitio web de Ciber-Conexión Papelería.",
      `Mi nombre es ${name}.`,
      `Necesito: ${interest}.`,
      `Mensaje: ${message}`
    ].join("\n");

    window.open(`https://wa.me/527351926478?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const canvas = $("#hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let accents = [];
    let rafId = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      accents = Array.from({ length: Math.max(22, Math.floor(width / 42)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 8 + Math.random() * 22,
        speed: 0.18 + Math.random() * 0.45,
        alpha: 0.14 + Math.random() * 0.28,
        color: Math.random() > 0.72 ? "255,191,47" : "229,9,20"
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      accents.forEach((accent) => {
        accent.y += accent.speed;
        accent.x += accent.speed * 0.22;
        if (accent.y > height + 30) {
          accent.y = -30;
          accent.x = Math.random() * width;
        }
        ctx.strokeStyle = `rgba(${accent.color}, ${accent.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(accent.x, accent.y);
        ctx.lineTo(accent.x + accent.length, accent.y + accent.length * 0.28);
        ctx.stroke();
      });
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
  }
})();
