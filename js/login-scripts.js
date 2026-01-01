// Wait a tiny bit to ensure HTML exists
document.addEventListener("DOMContentLoaded", () => {


  // ===== Password toggle =====
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }

  // ===== Login form =====
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      loginBtn.disabled = true;
      btnText.classList.add("hidden");
      btnLoader.classList.remove("hidden");

      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      loginBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoader.classList.add("hidden");

      alert("Login successful! (Demo)");
    });
  }
});

