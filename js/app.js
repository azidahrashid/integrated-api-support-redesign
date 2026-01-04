// ================================
// SPA CONFIG
// ================================
const DEFAULT_PAGE = "pages/home.html";


// ================================
// Helper to load HTML partials
// ================================
async function loadPartial(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);

    const container = document.getElementById(id);
    if (!container) {
      console.warn(`Container with id="${id}" not found!`);
      return;
    }

    container.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}


// ================================
// Page Loader (SPA)
// ================================
async function loadPage(path) {
  const container = document.getElementById("content-app");
  if (!container) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);

    container.innerHTML = await res.text();

    // ✅ Page-specific init
    if (path.includes("faq")) {
      initFAQPage();
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading page.</p>";
  }
}


// ================================
// Load login-specific assets
// ================================
function loadLoginAssets() {
  if (!document.getElementById("login-css")) {
    const link = document.createElement("link");
    link.id = "login-css";
    link.rel = "stylesheet";
    link.href = "css/login.css?v=007";
    document.head.appendChild(link);
  }

  if (!document.getElementById("login-scripts")) {
    const script = document.createElement("script");
    script.id = "login-scripts";
    script.src = "js/login-scripts.js";
    document.body.appendChild(script);
  }
}


// ================================
// Remove login assets
// ================================
function removeLoginAssets() {
  document.getElementById("login-css")?.remove();
  document.getElementById("login-scripts")?.remove();
}


// ================================
// Show login view
// ================================
function showLogin() {
  document.getElementById("app-view")?.style.setProperty("display", "none");
  document.getElementById("login-view")?.style.setProperty("display", "flex");

  loadPartial("front-login", "pages/login.html").then(() => {
    loadLoginAssets();
    initLoginParticles();
  });
}


// ================================
// Show main app view
// ================================
function showApp() {
  document.getElementById("login-view")?.style.setProperty("display", "none");
  document.getElementById("app-view")?.style.setProperty("display", "block");

  loadPartial("nav", "partials/nav.html").then(() => {
    initNavbar();
    initParticles();
  });

  loadPartial("footer", "partials/footer.html");

  removeLoginAssets();

  // ✅ Load default page
  loadPage(DEFAULT_PAGE);
}


// ================================
// Initialize App
// ================================
document.addEventListener("DOMContentLoaded", () => {
  localStorage.getItem("isLoggedIn") ? showApp() : showLogin();

  document.addEventListener("click", (e) => {

    // ======================
    // Logo → Default page
    // ======================
    if (e.target.closest("#logo")) {
      e.preventDefault();
      loadPage(DEFAULT_PAGE);
      return;
    }

    // ======================
    // SPA navigation
    // ======================
    const link = e.target.closest("[data-page]");
    if (link) {
      e.preventDefault();
      loadPage(link.dataset.page);

      document.getElementById("navbar-burger-menu")?.classList.remove("active");
      document.getElementById("navbar-collapse")?.classList.remove("active");
      return;
    }

    // ======================
    // Login
    // ======================
    if (e.target.id === "loginBtn") {
      localStorage.setItem("isLoggedIn", "true");
      showApp();
    }

    // ======================
    // Logout
    // ======================
    if (e.target.id === "logoutBtn") {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      showLogin();
    }
  });
});


// ================================
// Navbar
// ================================
function initNavbar() {
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle(
        "is-sticky",
        document.documentElement.scrollTop >= 150
      );
    });
  }

  const button = document.getElementById("navbar-burger-menu");
  const collapse = document.getElementById("navbar-collapse");

  button?.addEventListener("click", () => {
    button.classList.toggle("active");
    collapse?.classList.toggle("active");
  });

  document.querySelectorAll('#navbar a[data-page]').forEach(link => {
    link.addEventListener("click", () => {
      document
        .querySelectorAll('#navbar a[data-page]')
        .forEach(l => l.classList.remove("active-nav"));

      link.classList.add("active-nav");
    });
  });
}


// ================================
// App Particles
// ================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.width = p.style.height = `${Math.random() * 4 + 2}px`;
    p.style.animationDelay = `${Math.random() * 20}s`;
    container.appendChild(p);
  }
}


// ================================
// Login Particles
// ================================
function initLoginParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 2
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6,182,212,0.6)";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}


// ================================
// FAQ Page Logic
// ================================
function initFAQPage() {
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.faq-card');
      const open = card.classList.contains('open');
      document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
      if (!open) card.classList.add('open');
    });
  });

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;

      document.querySelectorAll('.category-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.faq-card').forEach(card => {
        card.style.display =
          cat === 'all' || card.dataset.category === cat ? 'block' : 'none';
      });

      updateCount();
    });
  });

  const search = document.getElementById('searchInput');
  search?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.faq-card').forEach(card => {
      card.style.display =
        card.textContent.toLowerCase().includes(q) ? 'block' : 'none';
    });
    updateCount();
  });

  updateCount();
}


// ================================
// FAQ Counter
// ================================
function updateCount() {
  const count = document.getElementById('totalCount');
  if (!count) return;

  count.textContent =
    document.querySelectorAll('.faq-card:not([style*="display: none"])').length;
}
