// ================================
// Helper function to load HTML partials
// ================================
async function loadPartial(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);

    const container = document.getElementById(id); // get the container
    if (!container) {
      console.warn(`Container with id="${id}" not found!`);
      return; // stop here if container doesn't exist
    }

    container.innerHTML = await res.text(); // safe to set now
  } catch (err) {
    console.error(err);
  }
}


// ================================
// Load login-specific JS (particles, toggle password, loader)
// ================================

function showLogin() {
  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");

  // Hide main app
  if (appView) appView.style.display = "none";

  // Show login view
  if (loginView) loginView.style.display = "flex"; 

  // Load login HTML partial
  loadPartial("front-login", "pages/login.html").then(() => {
    loadLoginAssets();
  });
}



function loadLoginAssets() {
  // ===== Load CSS =====
  if (!document.getElementById("login-css")) {
    const link = document.createElement("link");
    link.id = "login-css";
    link.rel = "stylesheet";
    link.href = "css/login.css?v=007";
    document.head.appendChild(link);
  }

  // ===== Load JS =====
  if (!document.getElementById("login-scripts")) {
    const script = document.createElement("script");
    script.id = "login-scripts";
    script.src = "js/login-scripts.js";
    document.body.appendChild(script);
  }
}

// ===== Remove login CSS & JS after login =====
function removeLoginAssets() {
  const loginCss = document.getElementById("login-css");
  if (loginCss) loginCss.remove();

  const loginScript = document.getElementById("login-scripts");
  if (loginScript) loginScript.remove();
}


// ================================
// Show main app view (nav + content + footer)
// ================================
function showApp() {
  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");

  // Hide login
  if (loginView) loginView.style.display = "none";

  // Show main app
  if (appView) appView.style.display = "block";

  // Load shared partials
  loadPartial("nav", "partials/nav.html");
  loadPartial("footer", "partials/footer.html");
  loadPartial("faq", "pages/faq.html");

  // Remove login CSS/JS to avoid conflicts
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

  document.addEventListener("click", (e) => {
    // Login
    if (e.target.id === "loginBtn") {
      localStorage.setItem("isLoggedIn", "true");
      showApp();
    }

    // Logout
    if (e.target.id === "logoutBtn") {
      localStorage.removeItem("isLoggedIn");
      showLogin();
    }
  });
});


