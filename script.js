document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ===================== MOBILE NAV TOGGLE ===================== */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const bar1 = document.getElementById("bar1");
  const bar2 = document.getElementById("bar2");
  const bar3 = document.getElementById("bar3");

  let menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    mobileMenu.classList.toggle("grid-rows-[0fr]", !open);
    mobileMenu.classList.toggle("grid-rows-[1fr]", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";

    bar1.style.transform = open
      ? "translateY(0) rotate(45deg)"
      : "translateY(-8px) rotate(0deg)";
    bar2.style.opacity = open ? "0" : "1";
    bar3.style.transform = open
      ? "translateY(0) rotate(-45deg)"
      : "translateY(8px) rotate(0deg)";
  }

  menuToggle.addEventListener("click", () => setMenu(!menuOpen));
  document
    .querySelectorAll("#mobileMenu .nav-link, #mobileMenu .btn-primary")
    .forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

  /* ===================== SMOOTH SCROLL WITH HEADER OFFSET ===================== */
  const navbar = document.getElementById("navbar");
  const headerHeight = navbar.offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight +
        1;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  /* ===================== NAVBAR SCROLLED STATE + BACK TO TOP ===================== */
  const backToTop = document.getElementById("backToTop");

  function handleScrollUI() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle("bg-white/85", scrolled);
    navbar.classList.toggle("backdrop-blur-xl", scrolled);
    navbar.classList.toggle("border-slate-200", scrolled);
    navbar.classList.toggle("shadow-sm", scrolled);

    const show = window.scrollY > 400;
    backToTop.classList.toggle("opacity-0", !show);
    backToTop.classList.toggle("invisible", !show);
    backToTop.classList.toggle("translate-y-4", !show);
  }
  window.addEventListener("scroll", handleScrollUI, { passive: true });
  handleScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  /* ===================== SCROLL-TRIGGERED REVEAL (WITH STAGGER) ===================== */
  document.querySelectorAll(".stagger").forEach((group) => {
    group.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("active"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ===================== ACTIVE NAV LINK ON SCROLL ===================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: `-${headerHeight + 40}px 0px -60% 0px`, threshold: 0 },
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ===================== HERO TYPING EFFECT ===================== */
  const typingTextEl = document.getElementById("typingText");
  const roles = [
    "Web Developer",
    "Frontend Specialist",
    "WordPress Developer",
    "Freelancer",
  ];

  if (prefersReducedMotion) {
    typingTextEl.textContent = roles[0];
  } else {
    let roleIndex = 0,
      charIndex = 0,
      isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];
      charIndex += isDeleting ? -1 : 1;
      typingTextEl.textContent = currentRole.substring(0, charIndex);

      let delay = isDeleting ? 45 : 95;

      if (!isDeleting && charIndex === currentRole.length) {
        delay = 1400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  /* ===================== CURSOR GLOW (DESKTOP ONLY) ===================== */
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && isFinePointer && !prefersReducedMotion) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* ===================== 3D TILT ON PROJECT CARDS ===================== */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      const strength = 8;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0)";
      });
    });
  }

  /* ===================== MAGNETIC BUTTON EFFECT ===================== */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ===================== CONTACT FORM VALIDATION ===================== */
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "mt-4 text-sm font-semibold min-h-[20px]";

    if (!validateForm()) {
      formStatus.textContent = "Please fix the errors above before submitting.";
      formStatus.classList.add("text-red-600");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent =
          "Thank you! Your message has been sent successfully. I'll get back to you soon.";
        formStatus.classList.add("text-emerald-600");
        contactForm.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      formStatus.textContent =
        "Something went wrong. Please try again or email me directly.";
      formStatus.classList.add("text-red-600");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  /* ===================== FOOTER YEAR ===================== */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ===================== THREE.JS HERO 3D SCENE ===================== */
  initHeroScene();

  function initHeroScene() {
    const canvas = document.getElementById("hero3d");
    const fallback = document.getElementById("hero3dFallback");
    if (!canvas) return;

    if (typeof THREE === "undefined") {
      canvas.classList.add("hidden");
      if (fallback) fallback.classList.remove("hidden");
      return;
    }

    try {
      const container = canvas.parentElement;
      let width = container.clientWidth;
      let height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /* Lighting */
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const dirLight = new THREE.DirectionalLight(0x2563eb, 1.2);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);
      const pointLight = new THREE.PointLight(0x38bdf8, 1.5, 20);
      pointLight.position.set(-4, -3, 4);
      scene.add(pointLight);

      /* Main rotating group: solid core + wireframe shell */
      const group = new THREE.Group();
      scene.add(group);

      const coreGeometry = new THREE.IcosahedronGeometry(2.1, 1);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0a142b,
        metalness: 0.45,
        roughness: 0.3,
        transparent: true,
        opacity: 0.88,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(coreMesh);

      const wireGeometry = new THREE.IcosahedronGeometry(2.16, 1);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
      group.add(wireMesh);

      /* Orbiting satellite shapes */
      const satellites = [];
      const satGeometries = [
        new THREE.OctahedronGeometry(0.28),
        new THREE.TetrahedronGeometry(0.3),
        new THREE.TorusGeometry(0.25, 0.08, 8, 24),
      ];
      for (let i = 0; i < 6; i++) {
        const geo = satGeometries[i % satGeometries.length];
        const mat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x2563eb : 0x0a142b,
          metalness: 0.5,
          roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3.6;
        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.6,
          Math.sin(angle) * 1.5,
        );
        scene.add(mesh);
        satellites.push({ mesh, angle, radius });
      }

      /* Particle field */
      const particleCount = 160;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      }
      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.045,
        transparent: true,
        opacity: 0.6,
      });
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      /* Mouse tracking (works anywhere on the page, not just over the canvas) */
      let mouseX = 0,
        mouseY = 0;
      let targetRotX = 0,
        targetRotY = 0;

      window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      });

      function onResize() {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.position.z = width < 640 ? 11 : 9;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      window.addEventListener("resize", onResize);
      onResize();

      if (prefersReducedMotion) {
        group.rotation.set(0.3, -0.4, 0);
        wireMesh.rotation.copy(group.rotation);
        renderer.render(scene, camera);
        return;
      }

      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        targetRotY += (mouseX * 0.6 - targetRotY) * 0.04;
        targetRotX += (-mouseY * 0.4 - targetRotX) * 0.04;

        group.rotation.y = elapsed * 0.15 + targetRotY;
        group.rotation.x = targetRotX + Math.sin(elapsed * 0.3) * 0.05;
        wireMesh.rotation.copy(group.rotation);

        satellites.forEach((sat, i) => {
          const a = sat.angle + elapsed * 0.25 * (i % 2 === 0 ? 1 : -1);
          sat.mesh.position.x = Math.cos(a) * sat.radius;
          sat.mesh.position.y = Math.sin(a) * sat.radius * 0.6;
          sat.mesh.rotation.x += 0.01;
          sat.mesh.rotation.y += 0.015;
        });

        particles.rotation.y = elapsed * 0.02;

        renderer.render(scene, camera);
      }
      animate();
    } catch (err) {
      console.warn("3D scene failed to initialize:", err);
      canvas.classList.add("hidden");
      if (fallback) fallback.classList.remove("hidden");
    }
  }
});
