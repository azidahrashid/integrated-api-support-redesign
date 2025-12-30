const loginView = document.getElementById("login-view");
const appView = document.getElementById("app-view");

// Load login UI
loadPartial("front-login", "pages/login.html");

// Check login state
if (localStorage.getItem("isLoggedIn")) {
  showApp();
} else {
  showLogin();
}

function showLogin() {
  loginView.style.display = "block";
  appView.style.display = "none";
}

function showApp() {
  loginView.style.display = "none";
  appView.style.display = "block";

// index.html
loadPartial("background-particles", "partials/background.html");
loadPartial("front-login", "pages/faq.html");
loadPartial("nav", "partials/nav.html");
loadPartial("footer", "partials/footer.html");
}
// Handle login click
document.addEventListener("click", e => {
  if (e.target.id === "loginBtn") {
    localStorage.setItem("isLoggedIn", "true");
    showApp();
  }
});


