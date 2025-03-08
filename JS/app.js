// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// // Function to properly resize the canvas for high-resolution screens
// function resizeCanvas() {
//   const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
//   const width = window.innerWidth;
//   const height = window.innerHeight;

//   // Set canvas display size (CSS pixels)
//   canvas.style.width = width + "px";
//   canvas.style.height = height + "px";

//   // Set actual canvas resolution (higher for better quality)
//   canvas.width = width * dpr;
//   canvas.height = height * dpr;

//   // Scale the context so that drawing operations match CSS pixels
//   ctx.scale(dpr, dpr);
// }

// resizeCanvas(); // Apply on page load

// // Predefined colors for the balls
// const ballColors = ["DeepPink", "DodgerBlue", "LimeGreen", "Gold"];
// let currentColorIndex = 0; // Tracks the current color index

// function updateBallColors() {
//   let scrollY = window.scrollY;
//   let section = Math.floor(scrollY / window.innerHeight); // Determine current viewport section

//   let newColorIndex = section % ballColors.length; // Loop through colors
//   if (newColorIndex !== currentColorIndex) {
//     currentColorIndex = newColorIndex;

//     // Update the color of all balls dynamically
//     effect.metaballsArray.forEach((ball) => {
//       ball.color = ballColors[currentColorIndex];
//     });
//   }
// }

// class Ball {
//   constructor(effect) {
//     this.effect = effect;
//     this.x = Math.random() * this.effect.width; // Start within screen bounds
//     this.y = Math.random() * this.effect.height;
//     this.radius = Math.random() * 80 + 50; // Adjust size for better scaling

//     // Slower movement with better containment
//     this.speedX = (Math.random() - 0.5) * 0.3;
//     this.speedY = (Math.random() - 0.5) * 0.3;

//     this.angle = Math.random() * Math.PI * 2;
//     this.va = (Math.random() - 0.5) * 0.01;
//     this.range = Math.random() * 1.5 + 0.5;

//     this.centerForce = Math.random() * 0.01 + 0.002;

//     // Assign the first color dynamically
//     this.color = ballColors[currentColorIndex];
//   }

//   update() {
//     this.angle += this.va;
//     this.x += this.speedX + Math.cos(this.angle) * this.range;
//     this.y += this.speedY + Math.sin(this.angle) * this.range;

//     // Centering force to keep blobs contained
//     let dx = this.effect.width / 2 - this.x;
//     let dy = this.effect.height / 2 - this.y;
//     this.x += dx * this.centerForce;
//     this.y += dy * this.centerForce;

//     // Prevent escaping the screen
//     if (this.x < this.radius || this.x > this.effect.width - this.radius)
//       this.speedX *= -1;
//     if (this.y < this.radius || this.y > this.effect.height - this.radius)
//       this.speedY *= -1;
//   }

//   draw(context) {
//     context.fillStyle = this.color;
//     context.beginPath();
//     context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//     context.fill();
//   }

//   reset() {
//     this.x = Math.random() * this.effect.width;
//     this.y = Math.random() * this.effect.height;
//   }
// }

// class MetaballsEffect {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//     this.metaballsArray = [];
//   }

//   init(numberOfBalls) {
//     for (let i = 0; i < numberOfBalls; i++) {
//       this.metaballsArray.push(new Ball(this));
//     }
//   }

//   update() {
//     this.metaballsArray.forEach((metaball) => metaball.update());
//   }

//   draw() {
//     this.metaballsArray.forEach((metaball) => metaball.draw(ctx));
//   }

//   reset(newWidth, newHeight) {
//     this.width = newWidth;
//     this.height = newHeight;
//     this.metaballsArray.forEach((metaball) => metaball.reset());
//   }
// }

// const effect = new MetaballsEffect(canvas.width, canvas.height);
// effect.init(20);

// function animate() {
//   updateBallColors(); // Change ball colors dynamically on scroll

//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   effect.update();
//   effect.draw(ctx);

//   requestAnimationFrame(animate);
// }

// animate();

// // Resize event to handle high-resolution screens dynamically
// window.addEventListener("resize", function () {
//   resizeCanvas();
//   effect.reset(canvas.width, canvas.height);
// });

// window.addEventListener("scroll", updateBallColors);
const container = document.querySelector(".container");
const blobContainer = document.querySelector(".blob-container");
const numBlobs = 5;
let blobs = [];

function createBlob() {
  const blob = document.createElement("div");
  blob.classList.add("blob");

  const containerRect = container.getBoundingClientRect();

  // Random position inside the container
  let x = Math.random() * (containerRect.width - 150);
  let y = Math.random() * (containerRect.height - 150);

  blob.style.transform = `translate(${x}px, ${y}px)`;

  blobContainer.appendChild(blob);
  blobs.push({
    element: blob,
    x,
    y,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
  });

  return blob;
}

function animateBlobs() {
  const containerRect = container.getBoundingClientRect();

  blobs.forEach((blob) => {
    let { element, x, y, speedX, speedY } = blob;

    x += speedX;
    y += speedY;

    // Bounce off the container edges
    if (x <= 0 || x >= containerRect.width - 150) speedX *= -1;
    if (y <= 0 || y >= containerRect.height - 150) speedY *= -1;

    element.style.transform = `translate(${x}px, ${y}px)`;

    blob.x = x;
    blob.y = y;
    blob.speedX = speedX;
    blob.speedY = speedY;
  });

  requestAnimationFrame(animateBlobs);
}

// Create blobs
for (let i = 0; i < numBlobs; i++) {
  createBlob();
}

animateBlobs();

// Adjust blob positions when resizing
window.addEventListener("resize", () => {
  const containerRect = container.getBoundingClientRect();
  blobs.forEach((blob) => {
    blob.x = Math.random() * (containerRect.width - 150);
    blob.y = Math.random() * (containerRect.height - 150);
  });
});
