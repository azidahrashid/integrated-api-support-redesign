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
    if (!container) return;

    container.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}


// ================================
// Page Loader (SPA)
// ================================
// ================================
// Page Loader (SPA SAFE)
// ================================
async function loadPage(path) {
  const container = document.getElementById("content-app");
  if (!container) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);

    container.innerHTML = await res.text();

    // ------------------------------
    // Run page-specific inits SPA-safe
    // ------------------------------
    // Use requestAnimationFrame to ensure DOM is parsed
    requestAnimationFrame(() => {
      const pageInits = [
        () => initParticles(),        // always safe
        () => initTicketModal(),      // modal if exists
        () => initBackToTop(),        // back-to-top if exists
        () => initFAQ(),              // FAQ page if exists
        () => inquiryType()           // inquiry page if exists
      ];

      pageInits.forEach(fn => {
        try {
          fn();
        } catch (err) {
          console.warn("Page init skipped or failed:", err);
        }
      });
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading page.</p>";
  }
}



// ================================
// Login assets
// ================================
function loadLoginAssets() {
  if (!document.getElementById("login-css")) {
    const link = document.createElement("link");
    link.id = "login-css";
    link.rel = "stylesheet";
    link.href = "css/login.css";
    document.head.appendChild(link);
  }

  if (!document.getElementById("login-scripts")) {
    const script = document.createElement("script");
    script.id = "login-scripts";
    script.src = "js/login-scripts.js";
    document.body.appendChild(script);
  }
}

function removeLoginAssets() {
  document.getElementById("login-css")?.remove();
  document.getElementById("login-scripts")?.remove();
}


// ================================
// Show Login / App
// ================================
function showLogin() {
  document.getElementById("app-view")?.style.setProperty("display", "none");
  document.getElementById("login-view")?.style.setProperty("display", "flex");

  loadPartial("front-login", "pages/login.html").then(() => {
    loadLoginAssets();
    initLoginParticles();
  });
}

function showApp() {
  document.getElementById("login-view")?.style.setProperty("display", "none");
  document.getElementById("app-view")?.style.setProperty("display", "block");

  loadPartial("nav", "partials/nav.html").then(initNavbar);
  loadPartial("footer", "partials/footer.html");

  removeLoginAssets();
  loadPage(DEFAULT_PAGE);
}


// ================================
// APP INIT (ONLY ONCE ❗)
// ================================
document.addEventListener("DOMContentLoaded", () => {
  localStorage.getItem("isLoggedIn") ? showApp() : showLogin();

  document.addEventListener("click", (e) => {

    // Logo
    if (e.target.closest("#logo")) {
      e.preventDefault();
      loadPage(DEFAULT_PAGE);
      return;
    }

    // SPA links
    const link = e.target.closest("[data-page]");
    if (link) {
      e.preventDefault();
      loadPage(link.dataset.page);
      document.getElementById("navbar-collapse")?.classList.remove("active");
      document.getElementById("navbar-burger-menu")?.classList.remove("active");
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
// Navbar
// ================================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("is-sticky", window.scrollY >= 150);
  });

  const burger = document.getElementById("navbar-burger-menu");
  const collapse = document.getElementById("navbar-collapse");

  burger?.addEventListener("click", () => {
    burger.classList.toggle("active");
    collapse?.classList.toggle("active");
  });

  document.querySelectorAll('#navbar [data-page]').forEach(link => {
    link.addEventListener("click", () => {
      document
        .querySelectorAll('#navbar [data-page]')
        .forEach(l => l.classList.remove("active-nav"));

      link.classList.add("active-nav");
    });
  });

}


// ================================
// Particles (SAFE FOR SPA)
// ================================
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.width = p.style.height = Math.random() * 4 + 2 + "px";
    p.style.animationDelay = Math.random() * 20 + "s";
    container.appendChild(p);
  }
}




// ================================
// Back to top
// ================================
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });

  btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}


// ================================
// Ticket Modal (JSON FORMAT)
// ================================
function initTicketModal() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeModal");

  if (!modal || !overlay) return;

  const bind = id => document.getElementById(id);

  document.querySelectorAll(".ticket-row").forEach(row => {
    row.onclick = () => {
      const data = JSON.parse(row.dataset.ticket);

      bind("modalTicketId").textContent = `#${data.id}`;
      bind("modalTitle").textContent = data.title;
      bind("modalDescription").textContent = data.description;
      bind("modalAgent").textContent = data.agent;
      bind("modalRequestor").textContent = data.requestor;
      bind("modalDate").textContent = data.date;
      bind("modalCategory").textContent = data.category;
      bind("modalStatus").textContent = data.status;

      modal.classList.add("active");
      overlay.classList.add("active");
    };
  });

  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", close);

  function close() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

  // Tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".tab, .tab-content").forEach(el => el.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab)?.classList.add("active");
    };
  });






  /* ===== IMAGE LIGHTBOX ===== */
  const zoomImages = document.querySelectorAll(".zoomable");
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  if (zoomImages.length && lightbox) {
    zoomImages.forEach(img => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
      });
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  }



}


// ================================
// Login canvas particles
// ================================
function initLoginParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const dots = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6,182,212,.6)";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}










// ================================
// FAQ - INIT (SPA SAFE)
// ================================
function initFAQ() {

  /* ==============================
   * Heading Animation
   * ============================== */
  const heading = document.querySelector('.animated-heading');
  if (heading && !heading.classList.contains('animated-done')) {
    const text = heading.textContent;
    heading.innerHTML = text
      .split('')
      .map(ch => ch === ' ' ? `<span>&nbsp;</span>` : `<span>${ch}</span>`)
      .join('');
    heading.classList.add('animated-done');
  }

  /* ==============================
   * Accordion
   * ============================== */
  document.querySelectorAll('.faq-header').forEach(header => {
    header.onclick = () => {
      const card = header.closest('.faq-card');
      const isOpen = card.classList.contains('open');

      document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    };
  });

  /* ==============================
   * Category Filter
   * ============================== */
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = () => {
      const category = btn.dataset.category;

      document.querySelectorAll('.category-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.faq-card').forEach(card => {
        card.style.display =
          category === 'all' || card.dataset.category === category
            ? ''
            : 'none';
      });

      updateCount();
    };
  });

  /* ==============================
   * Dropdown
   * ============================== */
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectedValue = document.getElementById("selectedValue");

  if (dropdownBtn && dropdownMenu && selectedValue) {
    dropdownBtn.onclick = () => dropdownMenu.classList.toggle("hidden");

    dropdownMenu.querySelectorAll("li").forEach(li => {
      li.onclick = () => {
        selectedValue.textContent = li.textContent;
        dropdownMenu.classList.add("hidden");
      };
    });

    document.addEventListener("click", e => {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  /* ==============================
   * Search
   * ============================== */
  // const searchInput = document.getElementById('searchInput');
  // const searchBtn = document.getElementById('search-Btn');

  // if (searchInput && searchBtn) {
  //   searchBtn.onclick = () => {
  //     const term = searchInput.value.toLowerCase().trim();

  //     document.querySelectorAll('.faq-card').forEach(card => {
  //       const q = card.querySelector('.faq-question-text')?.textContent.toLowerCase() || '';
  //       const a = card.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';
  //       card.style.display = (q.includes(term) || a.includes(term)) ? '' : 'none';
  //     });

  //     updateCount();
  //   };
  // }
/* ==============================
 * Search on input
 * ============================== */
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();

    document.querySelectorAll('.faq-card').forEach(card => {
      const q = card.querySelector('.faq-question-text')?.textContent.toLowerCase() || '';
      const a = card.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';
      card.style.display = (q.includes(term) || a.includes(term)) ? '' : 'none';
    });

    updateCount();
  });
}

  /* ==============================
   * Refresh Button
   * ============================== */
  const refreshBtn = document.querySelector('.refresh-btn');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      document.querySelectorAll('.faq-card').forEach(card => {
        card.style.display = '';
        card.classList.remove('open');
      });

      document.querySelectorAll('.category-btn')
        .forEach(b => b.classList.remove('active'));
      document.querySelector('.category-btn[data-category="all"]')
        ?.classList.add('active');

      searchInput && (searchInput.value = '');
      updateCount();

      const icon = refreshBtn.querySelector('svg');
      if (icon) {
        icon.style.transition = 'transform .5s';
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => (icon.style.transform = 'rotate(0)'), 500);
      }
    };
  }

  updateCount();
}


function updateCount() {
  const visible = document.querySelectorAll(
    '#faqContainer .faq-card:not([style*="display: none"])'
  );
  const counter = document.getElementById('totalCount');
  if (counter) counter.textContent = visible.length;
}



/* ==============================
   * Inquiry Type
   * ============================== */
function inquiryType() {
  //Inquiry Type 
        const categories = [
            "Technical Inquiry",
            "Inquiry for Results",
            "Both Sides Inquiry",
            "Operational",
            "Account Inquiry",
            "Promotion",
            "계좌 문의",
            "운영 관련",
            "기능 개선",
            "결과 처리 요청",
            "비스포크",
            "프로모션",
            "비스포크 토너먼트 신청",
            "후원금 신청",
            "기타"
        ];
  const container = document.getElementById("categoryContainer");

          categories.forEach((name, index) => {
          const btn = document.createElement("button");
          btn.className = "category-btn";
          btn.textContent = name;

          if (index === 0) btn.classList.add("active");

          btn.addEventListener("click", () => {
              document
                  .querySelectorAll(".category-btn")
                  .forEach(b => b.classList.remove("active"));
              btn.classList.add("active");
          });

          container.appendChild(btn);
      });
}




