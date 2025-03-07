const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Function to resize canvas for high-DPI screens (Retina, OLED, etc.)
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr); // Scale the context to prevent pixelation
}

resizeCanvas(); // Call on load

// Predefined colors for the balls
const ballColors = [
  "DeepPink",
  "DodgerBlue",
  "LimeGreen",
  "Gold",
  "Purple",
  "Crimson",
];
let currentColorIndex = 0;
let nextColorIndex = 0;
let transitionFactor = 1;

function updateBallColors() {
  let scrollY = window.scrollY;
  let section = Math.floor(scrollY / window.innerHeight);

  let newColorIndex = section % ballColors.length;
  if (newColorIndex !== currentColorIndex) {
    currentColorIndex = newColorIndex;
    nextColorIndex = (currentColorIndex + 1) % ballColors.length;
    transitionFactor = 0;
  }
}

class Ball {
  constructor(effect) {
    this.effect = effect;
    this.x = this.effect.width * 0.5;
    this.y = this.effect.height * 0.5;
    this.radius = Math.random() * 100 + 80;

    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;

    this.angle = Math.random() * Math.PI * 2;
    this.va = (Math.random() - 0.5) * 0.01;
    this.range = Math.random() * 1.5 + 0.5;

    this.centerForce = Math.random() * 0.01 + 0.002;

    this.color = ballColors[currentColorIndex];
  }

  update() {
    this.angle += this.va;
    this.x += this.speedX + Math.cos(this.angle) * this.range;
    this.y += this.speedY + Math.sin(this.angle) * this.range;

    let dx = this.effect.width / 2 - this.x;
    let dy = this.effect.height / 2 - this.y;
    this.x += dx * this.centerForce;
    this.y += dy * this.centerForce;

    if (this.x < this.radius || this.x > this.effect.width - this.radius)
      this.speedX *= -1;
    if (this.y < this.radius || this.y > this.effect.height - this.radius)
      this.speedY *= -1;

    if (transitionFactor < 1) {
      transitionFactor += 0.05;
    }
  }

  draw(context) {
    context.fillStyle = fadeColor(
      ballColors[currentColorIndex],
      ballColors[nextColorIndex],
      transitionFactor
    );

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  reset() {
    this.x = this.effect.width * 0.5;
    this.y = this.effect.height * 0.5;
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

// Function to fade between two colors
function fadeColor(color1, color2, factor) {
  let c1 = getRGB(color1);
  let c2 = getRGB(color2);
  let r = Math.round(c1.r + (c2.r - c1.r) * factor);
  let g = Math.round(c1.g + (c2.g - c1.g) * factor);
  let b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return `rgb(${r},${g},${b})`;
}

// Convert color name to RGB values
function getRGB(color) {
  let tempCanvas = document.createElement("canvas");
  let tempCtx = tempCanvas.getContext("2d");
  tempCtx.fillStyle = color;
  tempCtx.fillRect(0, 0, 1, 1);
  let data = tempCtx.getImageData(0, 0, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2] };
}

const effect = new MetaballsEffect(canvas.width, canvas.height);
effect.init(20);

function animate() {
  updateBallColors();

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
