const container = document.querySelector(".container");
const blobContainer = document.querySelector(".blob-container");
const numBlobs = 5;
let blobs = [];

function createBlob() {
  const blob = document.createElement("div");
  blob.classList.add("blob");

  const containerRect = container.getBoundingClientRect();

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

for (let i = 0; i < numBlobs; i++) {
  createBlob();
}

animateBlobs();

window.addEventListener("resize", () => {
  const containerRect = container.getBoundingClientRect();
  blobs.forEach((blob) => {
    blob.x = Math.random() * (containerRect.width - 150);
    blob.y = Math.random() * (containerRect.height - 150);
  });
});
