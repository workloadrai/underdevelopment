/**
 * workloadr.ai -- Under Development Landing Page
 * Pure vanilla JS, no dependencies.
 */

(function () {
  "use strict";

  /* =========================================================
   * 1. PARTICLE / STAR CANVAS BACKGROUND
   * ========================================================= */

  function initParticles() {
    var canvas = document.getElementById("particles");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var BASE_COUNT = 100;
    var MOBILE_BREAKPOINT = 768;
    var CONNECTION_DISTANCE = 120;
    var CONNECTION_OPACITY = 0.03;

    var width = 0;
    var height = 0;
    var particles = [];
    var animationId = null;
    var paused = false;

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function particleCount() {
      return width < MOBILE_BREAKPOINT
        ? Math.round(BASE_COUNT * 0.55)
        : BASE_COUNT;
    }

    function randomColor() {
      var roll = Math.random();
      if (roll < 0.15) {
        return { r: 124, g: 92, b: 255, baseAlpha: rand(0.2, 0.3) };
      }
      if (roll < 0.28) {
        return { r: 112, g: 202, b: 212, baseAlpha: rand(0.15, 0.25) };
      }
      return { r: 255, g: 255, b: 255, baseAlpha: rand(0.15, 0.4) };
    }

    function createParticle() {
      var color = randomColor();
      var depth = rand(0.3, 1);
      return {
        x: rand(0, width),
        y: rand(0, height),
        radius: rand(1, 3) * depth,
        vx: rand(-0.4, 0.4) * depth,
        vy: rand(-0.4, 0.4) * depth,
        depth: depth,
        r: color.r,
        g: color.g,
        b: color.b,
        baseAlpha: color.baseAlpha,
        alpha: color.baseAlpha,
        pulses: Math.random() < 0.35,
        pulseSpeed: rand(0.003, 0.012),
        pulseOffset: rand(0, Math.PI * 2),
      };
    }

    function populate() {
      var count = particleCount();
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    var resizeTimer = null;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      populate();
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }

    function draw(timestamp) {
      if (paused) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      var frameTime = timestamp || 0;
      ctx.clearRect(0, 0, width, height);

      var len = particles.length;
      var i, j, p, a, b, dx, dy, dist, maxDist, opacity;

      for (i = 0; i < len; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        if (p.pulses) {
          var pulse = Math.sin(frameTime * p.pulseSpeed + p.pulseOffset);
          p.alpha = p.baseAlpha + pulse * 0.12;
          if (p.alpha < 0.05) p.alpha = 0.05;
        }
      }

      maxDist = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
      ctx.lineWidth = 0.5;
      for (i = 0; i < len; i++) {
        a = particles[i];
        for (j = i + 1; j < len; j++) {
          b = particles[j];
          dx = a.x - b.x;
          dy = a.y - b.y;
          dist = dx * dx + dy * dy;
          if (dist < maxDist) {
            opacity = CONNECTION_OPACITY * (1 - dist / maxDist);
            ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (i = 0; i < len; i++) {
        p = particles[i];
        ctx.fillStyle =
          "rgba(" + p.r + "," + p.g + "," + p.b + "," + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    function onVisibilityChange() {
      paused = document.hidden;
    }

    resize();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    animationId = requestAnimationFrame(draw);
  }

  /* =========================================================
   * 2. STAGGERED ENTRANCE ANIMATIONS
   * ========================================================= */

  function initEntranceAnimations() {
    var animatedEls = document.querySelectorAll("[data-animate]");

    animatedEls.forEach(function (el, index) {
      var baseDelay = index * 80;
      var extra = parseInt(el.getAttribute("data-animate-delay"), 10) || 0;
      el.style.transitionDelay = baseDelay + extra + "ms";
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("is-ready");
      });
    });
  }

  /* =========================================================
   * 3. FEATURE CARDS HOVER GLOW EFFECT
   * ========================================================= */

  function initFeatureCardGlow() {
    var cards = document.querySelectorAll(".feature-card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      });

      card.addEventListener("mouseleave", function () {
        card.style.removeProperty("--mouse-x");
        card.style.removeProperty("--mouse-y");
      });
    });
  }

  /* =========================================================
   * 4. EMAIL WAITLIST FORM
   * ========================================================= */

  function initWaitlistForm() {
    var SHEET_URL =
      "https://script.google.com/macros/s/AKfycbwHkL7zGay2X2tAtIMOSKWFgvCMA0MCSO_3RDBmFnsKt5-0XNzV-nHlIdL7ultSC3Ir7A/exec";

    var form = document.querySelector("form.waitlist-form");
    if (!form) return;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitting = false;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submitting) return;

      // Honeypot check — bots fill hidden fields, humans don't
      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      var input = form.querySelector(
        'input[type="email"], input[name="email"]'
      );
      if (!input) return;

      var email = (input.value || "").trim();

      if (!EMAIL_RE.test(email)) {
        input.classList.add("is-error");
        form.classList.add("is-error");
        setTimeout(function () {
          input.classList.remove("is-error");
          form.classList.remove("is-error");
        }, 600);
        return;
      }

      // Disable button and show loading state
      submitting = true;
      var originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending\u2026";

      fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      })
        .then(function () {
          // Show success (no-cors returns opaque response, so we trust it went through)
          form.classList.add("is-success");

          var msg = document.createElement("div");
          msg.className = "waitlist-success";
          msg.setAttribute("role", "status");
          msg.innerHTML =
            '<svg class="waitlist-check" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M7 12.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round"/>' +
            "</svg>" +
            "<span>You're on the list!</span>";

          form.parentNode.insertBefore(msg, form.nextSibling);

          requestAnimationFrame(function () {
            msg.classList.add("is-visible");
          });
        })
        .catch(function () {
          // Reset button on failure
          submitting = false;
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          input.classList.add("is-error");
          setTimeout(function () {
            input.classList.remove("is-error");
          }, 600);
        });
    });
  }

  /* =========================================================
   * 5. TOOLTIP
   * ========================================================= */

  function initTooltips() {
    var targets = document.querySelectorAll(".tooltip-target");
    targets.forEach(function (target) {
      target.addEventListener("click", function () {
        target.classList.add("is-tooltip");
        setTimeout(function () {
          target.classList.remove("is-tooltip");
        }, 1400);
      });
    });
  }

  /* =========================================================
   * 6. INTERSECTION OBSERVER FOR FEATURE CARDS
   * ========================================================= */

  function initFeatureCardObserver() {
    var cards = document.querySelectorAll(".feature-card");
    if (!cards.length) return;

    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* =========================================================
   * BOOTSTRAP
   * ========================================================= */

  window.addEventListener("DOMContentLoaded", function () {
    initParticles();
    initEntranceAnimations();
    initFeatureCardGlow();
    initWaitlistForm();
    initTooltips();
    initFeatureCardObserver();
  });
})();
