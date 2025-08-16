const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const guessInput = document.getElementById("guess");
const checkBtn = document.getElementById("checkBtn");
const statusEl = document.getElementById("status");

let img = new Image();
let correctAnswer = "";
let pixelSize = 40; // start very pixelated

function startGame(imagePath, answer) {
  correctAnswer = answer.toLowerCase();
  img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    drawPixelated();
    statusEl.textContent = "Guess the image!";
  };
  img.src = imagePath;
}

function drawPixelated() {
  const w = img.width;
  const h = img.height;

  // Downscale
  ctx.drawImage(img, 0, 0, w / pixelSize, h / pixelSize);

  // Upscale
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w / pixelSize, h / pixelSize, 0, 0, w, h);
}

checkBtn.addEventListener("click", () => {
  const guess = guessInput.value.trim().toLowerCase();
  if (!guess) return;

  if (guess === correctAnswer) {
    ctx.drawImage(img, 0, 0); // show full image
    statusEl.textContent = "✅ Correct!";
  } else {
    statusEl.textContent = "❌ Wrong! Try again.";
    pixelSize = Math.max(2, pixelSize - 6); // reduce pixelation
    drawPixelated();
  }
  guessInput.value = "";
});

// Load config.json and start with first challenge
fetch("config.json")
  .then(res => res.json())
  .then(data => {
    const challenge = data.challenges[0]; // pick the first one
    startGame(challenge.image, challenge.answer);
  });
