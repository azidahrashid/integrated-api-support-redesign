async function loadPartial(id, path) {
  const res = await fetch(path);
  if (!res.ok) {
    console.error(`Failed to load ${path}`);
    return;
  }
  document.getElementById(id).innerHTML = await res.text();
}

// index.html
loadPartial("background-particles", "partials/background.html");
loadPartial("front-login", "pages/login.html");
loadPartial("nav", "partials/nav.html");
loadPartial("footer", "partials/footer.html");
