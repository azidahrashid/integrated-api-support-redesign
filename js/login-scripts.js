// Particle animation
// Particle animation (UI themed)
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();

const particles = [];
const particleCount = 60; // slightly reduced = cleaner UI
const connectDistance = 120;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 1.8 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.speedY = (Math.random() - 0.5) * 0.25;

    // UI color palette (cyan / blue)
    this.color =
      Math.random() > 0.5
        ? "rgba(6,182,212,0.6)"   // cyan
        : "rgba(59,130,246,0.5)"; // blue
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // wrap around
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

// create particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// subtle connecting lines (optional but very nice)
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

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', resizeCanvas);


// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeOff = document.getElementById('eyeOff');
const eye = document.getElementById('eye');

if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    eyeOff.classList.toggle('hidden');
    eye.classList.toggle('hidden');
  });
}

// Login form animation
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    btnLoader.classList.add('flex');

    await new Promise(resolve => setTimeout(resolve, 2000)); // simulate login

    loginBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    btnLoader.classList.remove('flex');

    alert('Login successful! (Demo)');
  });
}
