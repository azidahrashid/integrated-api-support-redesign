// ================================
// Helper function to load HTML partials
// ================================
async function loadPartial(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    document.getElementById(id).innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

// ================================
// Load Tailwind CDN dynamically
// ================================
function loadTailwind() {
  if (document.getElementById("tailwind-cdn")) return;
  const script = document.createElement("script");
  script.id = "tailwind-cdn";
  script.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(script);
}

// ================================
// Load login-specific JS (particles, toggle password, loader)
// ================================
function loadLoginScripts() {
  if (document.getElementById("login-scripts")) return;

  const script = document.createElement("script");
  script.id = "login-scripts";
  script.src = "js/login-scripts.js"; // see below
  document.body.appendChild(script);
}

// ================================
// Show login view
// ================================
function showLogin() {
  loadTailwind();
  loadPartial("front-login", "src/sign-in.html").then(() => {
    loadLoginScripts();
  });

  // Hide main app, show login
  document.getElementById("app-view").style.display = "none";
  document.getElementById("login-view").style.display = "block";
}

// ================================
// Show main app view (nav + content + footer)
// ================================
function showApp() {
  // Hide login
  document.getElementById("login-view").style.display = "none";
  document.getElementById("app-view").style.display = "block";

  // Load shared partials
  loadPartial("nav", "partials/nav.html");
  loadPartial("footer", "partials/footer.html");
  loadPartial("faq", "pages/faq.html"); // main content
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

  // Handle login button click
  document.addEventListener("click", (e) => {
    if (e.target.id === "loginBtn") {
      // You can add actual login validation here
      localStorage.setItem("isLoggedIn", "true");
      showApp();
    }
  });

  // Optional: logout button
  document.addEventListener("click", (e) => {
    if (e.target.id === "logoutBtn") {
      localStorage.removeItem("isLoggedIn");
      showLogin();
    }
  });
});
