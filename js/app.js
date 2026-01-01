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

  // Load login JS (toggle, form)
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
    loadLoginAssets(); // load CSS & JS after HTML is ready
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
  loadPartial("nav", "partials/nav.html");
  loadPartial("footer", "partials/footer.html");

  // Load default page (SPA)
  loadPage("pages/service-desk.html");

  removeLoginAssets(); // remove login CSS/JS
}

// ================================
// SPA page loader
// ================================
async function loadPage(path) {
  const container = document.getElementById("page-content");
  if (!container) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    container.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load page.</p>";
  }
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
