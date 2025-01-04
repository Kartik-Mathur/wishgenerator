# Creating a Fireworks Animation with JavaScript and GIF.js

In this blog, we will walk through a JavaScript script that creates a fireworks animation, records the animation, and converts it into a downloadable GIF using the **GIF.js** library.  Let's dive into this project!

Glimse of project: <br>
<img src="fireworks_animation.gif" height="250px" width="450px">

---

## Introduction
Creating animations and exporting them as GIFs can be done with JavaScript's canvas API and the power of libraries like GIF.js, it becomes easy and fun. This project allows users to:

- View fireworks animations on a canvas.
- Customize their experience by entering their name.
- Download the animation as a high-quality GIF.

---

## The Code Breakdown

### Setting Up the Canvas
```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```
#### Purpose:
- **`document.createElement('canvas')`**: Dynamically creates a `<canvas>` element to render the animation.
- **`canvas.getContext('2d')`**: Gets the 2D rendering context to draw shapes and text.
- **Styling**:
  - `margin: '0'` Remove margin around the canvas.
  - `overflow: 'hidden'` hide content overflowing the viewport.
- **`appendChild(canvas)`**: Adds the canvas to the HTML document.
- **Canvas Dimensions**:
  - Sets the canvas width and height to match the browser window size.

---

### Capturing User Input
```javascript
let userName = prompt("Enter your name:", "Guest");
```
#### Purpose:
- Prompts the user to enter their name.
- Defaults is set to "Guest."

---

### Initializing GIF.js
```javascript
const gif = new GIF({
  workers: 2,
  quality: 10,
  workerScript: './gifworker.js',
});
```
#### Purpose:
- **`GIF.js` Configuration**:
  - `workers: 2`: Uses two workers to optimize the GIF creation process.
  - `quality: 10`: Sets the quality level (lower value means better quality).
  - `workerScript`: Points to the local `gifworker.js` file required for GIF.js to function properly.

GIF.js library captures frames from the canvas and compiles them into a GIF.

---

### Animation Timing
```javascript
const captureDuration = 2 * 1000; // 2 seconds
const startTime = Date.now();
```
#### Purpose:
- **`captureDuration`**: Sets the animation duration to 2 seconds.
- **`startTime`**: Records the animation's start time to calculate when it should stop.

---

### Firework Class
```javascript
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
```
#### Purpose:
- Represents a single firework made up of multiple particles.
- **Constructor**:
  - Accepts `x`, `y` (position) and `colors` as arguments.
  - Creates 150 particles for each firework.
- **`update`**:
  - Updates the position and opacity of all particles.
  - Removes particles that are no longer visible.
- **`draw`**: Renders the particles on the canvas.

---

### Particle Class
```javascript
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
```
#### Purpose:
- Represents individual particles within a firework.
- **Properties**:
  - `angle`, `speed`, and `friction` control the particle's movement.
  - `gravity` ensures particles fall realistically.
  - `alpha` and `decay` control opacity over time.
- **Methods**:
  - `update`: Updates the particle's position and appearance.
  - `draw`: Renders the particle on the canvas.

---

### Generating Fireworks
```javascript
function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2;
  const colors = [
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
  ];
  fireworks.push(new Firework(x, y, colors));
}
```
#### Purpose:
- Randomly generates a firework at a random position with random colors.
- Adds the firework to the `fireworks` array for rendering and updating.

---

### Drawing the Text
```javascript
function drawText() {
  ctx.globalAlpha = 1;
  ctx.font = '48px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(`Happy New Year, ${userName}!`, canvas.width / 2, canvas.height / 2);
}
```
#### Purpose:
- Displays a personalized "Happy New Year" message centered on the canvas.

---

### Animation Loop
```javascript
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
```
#### Purpose:
- **Canvas Clearing**: Adds a fading effect with `rgba(0, 0, 0, 0.2)`.
- **Fireworks Rendering**:
  - Updates and draws all active fireworks.
  - Removes fireworks that are complete.
- **Text Rendering**: Displays the personalized message.
- **Frame Capture**: Captures the canvas frame for the GIF.
- **Animation Stop**: Stops the animation after the specified duration.

---

### Downloading the GIF
```javascript
gif.on('finished', (blob) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fireworks_animation.gif';
  a.click();
  alert('Your GIF is ready and downloaded.');
});
```


# wishgenerator
# wishgenerator
# wishgenerator
# wishgenerator
# wishgenerator
# wishgenerator
