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
// Load login-specific assets
// ================================
function loadLoginAssets() {
  // Load CSS
  if (!document.getElementById("login-css")) {
    const link = document.createElement("link");
    link.id = "login-css";
    link.rel = "stylesheet";
    link.href = "css/login.css?v=007";
    document.head.appendChild(link);
  }

  // Load login JS ( toggle, form)
  if (!document.getElementById("login-scripts")) {
    const script = document.createElement("script");
    script.id = "login-scripts";
    script.src = "js/login-scripts.js";
    document.body.appendChild(script);
  }
}

// Remove login assets after login
function removeLoginAssets() {
  const loginCss = document.getElementById("login-css");
  if (loginCss) loginCss.remove();

  const loginScript = document.getElementById("login-scripts");
  if (loginScript) loginScript.remove();
}

// ================================
// Show login view
// ================================
function showLogin() {
  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");

  if (appView) appView.style.display = "none";
  if (loginView) loginView.style.display = "flex";

  // Load login HTML into front-login
  loadPartial("front-login", "pages/login.html").then(() => {
    loadLoginAssets(); // CSS & JS for login

    // ====== Particle animation ======
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();

    const particles = [];
    const particleCount = 60;
    const connectDistance = 120;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.color = Math.random() > 0.5
          ? "rgba(6,182,212,0.6)"
          : "rgba(59,130,246,0.5)";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectDistance) {
            ctx.strokeStyle = `rgba(6,182,212,${0.08 * (1 - distance / connectDistance)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', resizeCanvas);
    // ====== end particle animation ======
  });
}


// ================================
// Show main app view
// ================================
function showApp() {
  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");

  if (loginView) loginView.style.display = "none";
  if (appView) appView.style.display = "block";

  // Load shared partials
  loadPartial("nav", "partials/nav.html").then(() => {
    initNavbar();



   // ✅ Safe place: particles container now exists
    initParticles();

  });

  loadPartial("footer", "partials/footer.html");

  removeLoginAssets();
}


// ================================
// Initialize
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn")) {
    showApp();
  } else {
    showLogin();
  }


async function loadPage(path) {
  const container = document.getElementById("main-board"); // default page
  if (!container) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    container.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading page.</p>";
  }
}


  document.addEventListener("click", (e) => {
  // SPA navigation
  const link = e.target.closest("[data-page]");
  if (link) {
    e.preventDefault();
    loadPage(link.dataset.page);

    // Close mobile menu after click
    const burger = document.getElementById("navbar-burger-menu");
    const collapse = document.getElementById("navbar-collapse");
    if (burger && collapse) {
      burger.classList.remove("active");
      collapse.classList.remove("active");
    }
    return;
  }

  // Login
  if (e.target.id === "loginBtn") {
    localStorage.setItem("isLoggedIn", "true");
    showApp();
  }

  // Logout
  if (e.target.id === "logoutBtn") {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    showLogin();
  }
});

});





// ================================
// particles
// ================================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return; 

  particlesContainer.innerHTML = ""; // prevent duplicates

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const delay = Math.random() * 20;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.background = `rgba(${
      Math.random() > 0.5 ? '6,182,212' : '59,130,246'
    }, 0.6)`;

    particlesContainer.appendChild(particle);
  }
}






// ================================
// Navbar
// ================================
function initNavbar() {
  // ================================
  // Sticky navbar
  // ================================
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      const height = 150;
      const scrollTop = document.documentElement.scrollTop;
      navbar.classList.toggle("is-sticky", scrollTop >= height);
    });
  }

  // ================================
  // Hamburger toggle
  // ================================
  const button = document.getElementById("navbar-burger-menu");
  const collapse = document.getElementById("navbar-collapse");

  if (button && collapse) {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      collapse.classList.toggle("active");
    });
  }

  // ================================
  // Active nav handling
  // ================================
  const navLinks = document.querySelectorAll(
    '#navbar a[data-page]'
  );

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      // remove active from all links
      navLinks.forEach(l => l.classList.remove("active-nav"));

      // add active to clicked link
      link.classList.add("active-nav");

      // close mobile menu after click
      if (collapse) {
        collapse.classList.remove("active");
        button?.classList.remove("active");
      }
    });
  });
}




