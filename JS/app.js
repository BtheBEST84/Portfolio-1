const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Function to resize the canvas properly for high-DPI screens
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1; // Get device pixel ratio (Retina, OLED, etc.)
  canvas.style.width = window.innerWidth + "px"; // Ensure it visually fills the screen
  canvas.style.height = window.innerHeight + "px";

  canvas.width = window.innerWidth * dpr; // Set actual resolution
  canvas.height = window.innerHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale correctly to avoid distortion
}

resizeCanvas(); // Apply on page load

// Predefined colors for the balls (instead of background)
const ballColors = ["DeepPink", "DodgerBlue", "LimeGreen", "Gold"];
let currentColorIndex = 0; // Tracks the current color index

function updateBallColors() {
  let scrollY = window.scrollY;
  let section = Math.floor(scrollY / window.innerHeight); // Determine current viewport section

  let newColorIndex = section % ballColors.length; // Loop through colors
  if (newColorIndex !== currentColorIndex) {
    currentColorIndex = newColorIndex;

    // Update the color of all balls dynamically
    effect.metaballsArray.forEach((ball) => {
      ball.color = ballColors[currentColorIndex];
    });
  }
}

class Ball {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.random() * this.effect.width; // Random start position
    this.y = Math.random() * this.effect.height;
    this.radius = Math.random() * 100 + 80;

    // Slower movement with better containment
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;

    this.angle = Math.random() * Math.PI * 2;
    this.va = (Math.random() - 0.5) * 0.01; // Very subtle angular rotation
    this.range = Math.random() * 1.5 + 0.5; // Keeps movement small

    this.centerForce = Math.random() * 0.01 + 0.002; // Stronger pull towards center

    // Assign the first color dynamically
    this.color = ballColors[currentColorIndex];
  }

  update() {
    this.angle += this.va;
    this.x += this.speedX + Math.cos(this.angle) * this.range;
    this.y += this.speedY + Math.sin(this.angle) * this.range;

    // Centering force to keep blobs contained
    let dx = this.effect.width / 2 - this.x;
    let dy = this.effect.height / 2 - this.y;
    this.x += dx * this.centerForce;
    this.y += dy * this.centerForce;

    // Prevent escaping the screen
    if (this.x < this.radius || this.x > this.effect.width - this.radius)
      this.speedX *= -1;
    if (this.y < this.radius || this.y > this.effect.height - this.radius)
      this.speedY *= -1;
  }

  draw(context) {
    context.fillStyle = this.color; // Each ball uses its assigned color
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  reset() {
    this.x = Math.random() * this.effect.width; // Reset position correctly
    this.y = Math.random() * this.effect.height;
  }
}

class MetaballsEffect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.metaballsArray = [];
  }

  init(numberOfBalls) {
    for (let i = 0; i < numberOfBalls; i++) {
      this.metaballsArray.push(new Ball(this));
    }
  }

  update() {
    this.metaballsArray.forEach((metaball) => metaball.update());
  }

  draw() {
    this.metaballsArray.forEach((metaball) => metaball.draw(ctx));
  }

  reset(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;
    this.metaballsArray.forEach((metaball) => metaball.reset());
  }
}

const effect = new MetaballsEffect(canvas.width, canvas.height);
effect.init(20);

function animate() {
  updateBallColors(); // Change ball colors dynamically on scroll

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.update();
  effect.draw(ctx);

  requestAnimationFrame(animate);
}

animate();

// Resize event to handle high-DPI screens dynamically
window.addEventListener("resize", function () {
  resizeCanvas();
  effect.reset(canvas.width, canvas.height);
});

window.addEventListener("scroll", updateBallColors);
