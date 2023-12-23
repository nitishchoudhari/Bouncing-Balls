const para = document.querySelector('p');
document.querySelector('.congratsPara').style.display = 'none';
let count = 0;

// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random rgb
function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
};

// The Balls & the Evil circle will inherit properties from this constructor
function Shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
}

function Ball(x, y, velX, velY, color, size, exists) {

  Shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
  this.exists = exists;

  this.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // changing the polarity of position of balls to update its direction.
  this.update = function () {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  this.collisionDetect = function () {
    for (const ball of balls) {
      if (this !== ball && ball.exists) { // current ball not same as loop ball to avoid collided with itself scenario
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20);
  this.size = 10;
  this.color = '#fff';

  this.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  this.checkBounds = function () {
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  this.collisionDetect = function () {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = 'Ball count: ' + count;
          if (count === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // canvas = null
            // ctx = null
            document.querySelector('.congratsPara').style.display = 'flex';
            document.querySelector('.ballCount').style.display = 'none';
          }
        }
      }
    }
  }

  window.addEventListener("mousemove", (e) => {
    this.x = e.offsetX
    this.y = e.offsetY
  });

  if (window.width < 797) {
    window.addEventListener("touchmove", (e) => {
      e.preventDefault(); // Prevent default touch behavior, like scrolling
      let touchX = this.x;
      let touchY = this.y;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    })
  }
}

const evilBall = new EvilCircle(random(0, width), random(0, height));

const balls = [];

while (balls.length < 5) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
    true
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // draws a background canvas of transparent black for rgb balls.

  ctx.fillRect(0, 0, width, height); /* cavas filled in rectangular across the height width of screen. & 
  it cover up the previous frame's drawing before the next one is drawn */

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

loop();