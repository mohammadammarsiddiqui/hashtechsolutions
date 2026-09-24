/* ============================================================
   Hashtech Solutions — shared front-end behaviour
   Nav state, reveal-on-scroll, mobile menu, marquee duplication.
   Page-specific behaviour (work filters, contact form) lives in
   their own <script> blocks at the bottom of each page.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Nav: solid on scroll ---------------- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const setNavState = () => {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    setNavState();
    window.addEventListener("scroll", setNavState, { passive: true });
  }

  /* ---------------- Mobile menu toggle ---------------- */
  const menuBtn = document.querySelector("[data-menu-btn]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menuPanel.classList.toggle("flex");
      menuPanel.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("overflow-hidden", isOpen);
    });
    menuPanel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menuPanel.classList.add("hidden");
        menuPanel.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }

  /* ---------------- Marquee: duplicate track for seamless loop ---------------- */
  document.querySelectorAll("[data-marquee]").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------------- Floating image parallax (home hero) ---------------- */
  const floatMedia = document.querySelector("[data-parallax]");
  if (floatMedia) {
    let ticking = false;
    const update = () => {
      const rect = floatMedia.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (elementCenter - viewportCenter) * 0.08;
      floatMedia.style.transform = `translateY(${distance}px)`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
