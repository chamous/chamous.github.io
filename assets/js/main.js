(function () {
  "use strict";

  var EMAIL = "hadjayed.chames@gmail.com";
  var root = document.documentElement;

  /* ---------- theme ---------- */
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      draw();
    });
  }

  /* ---------- nav state, progress, active link ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  var sections = [].slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = [].slice.call(document.querySelectorAll("#navLinks a"));

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 620);

    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

    var current = "";
    var probe = y + (window.innerHeight * 0.32);
    sections.forEach(function (s) {
      if (s.offsetTop <= probe) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var linksWrap = document.getElementById("navLinks");

  function closeMenu() {
    if (!linksWrap || !burger) return;
    linksWrap.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.querySelector("use").setAttribute("href", "#i-menu");
    document.body.classList.remove("no-scroll");
  }

  if (burger && linksWrap) {
    burger.addEventListener("click", function () {
      var open = linksWrap.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
      document.body.classList.toggle("no-scroll", open);
    });

    linksWrap.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- hero canvas network ---------- */
  var canvas = document.getElementById("heroCanvas");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var nodes = [];
  var raf = null;
  var w = 0;
  var h = 0;

  function css(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function resize() {
    if (!canvas || !ctx) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(70, Math.max(26, Math.round(w / 22)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: Math.random() * 1.6 + 0.7
      });
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    var accent = css("--accent") || "#22d3ee";
    var accent2 = css("--accent-2") || "#6366f1";
    var linkDist = 132;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      for (var j = i + 1; j < nodes.length; j++) {
        var m = nodes[j];
        var dx = n.x - m.x;
        var dy = n.y - m.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - d / linkDist) * 0.22;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.75;
      ctx.fillStyle = (i % 3 === 0) ? accent2 : accent;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = window.requestAnimationFrame(draw);
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      resize();
      draw();
    }, 160);
  });

  if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resize();
    draw();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else {
        draw();
      }
    });
  }

  /* ---------- contact form (mailto, no backend needed) ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var subject = form.elements.subject;
      var msg = form.elements.message;
      var bad = [];

      if (!name.value.trim()) { bad.push(name); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { bad.push(email); }
      if (!msg.value.trim()) { bad.push(msg); }

      if (bad.length) {
        bad.forEach(function (f) { f.classList.add("invalid"); });
        note.className = "form-note err";
        note.textContent = "Please fill in your name, a valid email and a message.";
        bad[0].focus();
        return;
      }

      bad.forEach(function (f) { f.classList.remove("invalid"); });

      var body =
        msg.value.trim() +
        "\n\n---\nFrom: " + name.value.trim() +
        "\nEmail: " + email.value.trim();

      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(
          (subject.value.trim() || "Portfolio enquiry") + " — " + name.value.trim()
        ) +
        "&body=" + encodeURIComponent(body);

      note.className = "form-note";
      note.textContent = "Opening your email client… if nothing happens, write to " + EMAIL + ".";
    });

    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("invalid")) e.target.classList.remove("invalid");
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  onScroll();
})();