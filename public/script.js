const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
let userName = prompt("Enter your name:", "Guest");

const gif = new GIF({
  workers: 2,
  quality: 10, 
  workerScript: './gifworker.js',
});

const captureDuration = 2 * 1000; // 2 seconds
const startTime = Date.now();

class Firework {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
    this.particles = [];
    for (let i = 0; i < 150; i++) {
      this.particles.push(new Particle(this.x, this.y, this.colors));
    }
  }

  update() {
    this.particles = this.particles.filter((p) => p.alpha > 0);
    this.particles.forEach((p) => p.update());
  }

  draw() {
    this.particles.forEach((p) => p.draw());
  }
}

class Particle {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 4 + 4;
    this.size = Math.random() * 3 + 1;
    this.gravity = 0.1;
    this.friction = 0.95;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.02;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2;
  const colors = [
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
  ];
  fireworks.push(new Firework(x, y, colors));
}

function drawText() {
  ctx.globalAlpha = 1;
  ctx.font = '48px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(`Happy New Year, ${userName}!`, canvas.width / 2, canvas.height / 2);
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  if (Math.random() < 0.1) {
    createFirework();
  }

  drawText();

  gif.addFrame(canvas, { copy: true, delay: 1000 / 60 }); 

  if (Date.now() - startTime < captureDuration) {
    requestAnimationFrame(animate);
  } else {
    gif.render();
  }
}

gif.on('finished', (blob) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fireworks_animation.gif';
  a.click();
  alert('Your GIF is ready and downloaded.');
});

animate();
