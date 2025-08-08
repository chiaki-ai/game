// Get DOM elements
const deathCountEl = document.getElementById('death-count');
const dialogueEl = document.getElementById('dialogue');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const jumpBtn = document.getElementById('jump-btn');

// Game dialogues
const dialogues = [
  "「また死んだか。だが、それがどうした」", // 0
  "「上官の評価ばかり気にしていたな」",
  "「誰かのための勝利は、本当に自分のものか？」",
  "「戦果という物差しが、お前を縛っている」",
  "「昨日までの自分は、もういない」",
  "「見ろ、身体が軽くなっていく」", // 5
  "「守るべき正義とは、誰の正義だ？」",
  "「理想に燃えていた頃を思い出す」",
  "「この痛みは、無意味じゃない」",
  "「なぜ戦う？その問いが、今のお前の武器だ」",
  "「若返るたび、世界が違って見える」", // 10
  "「恐怖も、怒りも、かつてほど感じない」",
  "「ただ、空が青いと感じる」",
  "「ここは戦場だったはずだ」",
  "「死ぬのが、怖くなくなってきた」",
  "「これは罰か？それとも…」", // 15
  "「もう、何も考えなくていいのかもしれない」",
  "「ただ、動く。それだけだ」",
  "「雑音が消えていく」",
  "「静かだ…」",
  "「……」", // 20
];

// Game state variables
let player;
let platforms = [];
let enemyMissiles = [];
let playerMissiles = [];
let spikes = [];
let springs = [];
let movingPlatforms = []; // New: Moving Platforms array

let gravity = 0.6;
let deathCount = 0;
const spawnPoint = { x: 100, y: 540 }; // Adjusted spawn point for new ground level
let moveLeft = false;
let moveRight = false;
let missileSpawnRate = 120;
let bgImg;
let playerImg;

function preload() {
  bgImg = loadImage('yungshaa.png');
  playerImg = loadImage('shaa.png');
}

function setup() {
  const canvas = createCanvas(2400, 600); // Stage extended: Wider and Taller
  canvas.parent('canvas-container');
  
  player = new Player(spawnPoint.x, spawnPoint.y);
  
  // --- Stage Setup (New, Wider, Taller, Harder) ---
  platforms = [];
  spikes = [];
  springs = [];
  movingPlatforms = []; // Initialize moving platforms array

  // Ground
  platforms.push(new Platform(0, 580, 800, 20)); // Starting ground
  platforms.push(new Platform(850, 580, 1550, 20)); // Extended ground

  // Section 1: Vertical challenge with spikes
  platforms.push(new Platform(200, 500, 100, 20));
  spikes.push(new Spike(220, 480, 60, 20)); // Spike on platform
  platforms.push(new Platform(350, 420, 100, 20));
  movingPlatforms.push(new MovingPlatform(400, 340, 100, 20, 350, 550, 1.5)); // Moving platform 1
  spikes.push(new Spike(520, 320, 60, 20));

  // Section 2: Spring jump challenge
  platforms.push(new Platform(700, 480, 80, 20));
  springs.push(new Spring(720, 460, 40, 20)); // Spring to jump high
  platforms.push(new Platform(850, 380, 120, 20)); // Landing platform after spring jump
  spikes.push(new Spike(870, 360, 80, 20)); // Spikes on landing platform

  // Section 3: Gaps and more spikes
  platforms.push(new Platform(1000, 500, 100, 20));
  movingPlatforms.push(new MovingPlatform(1150, 420, 100, 20, 1100, 1250, 2)); // Moving platform 2
  spikes.push(new Spike(1170, 400, 60, 20));
  platforms.push(new Platform(1300, 340, 100, 20));
  platforms.push(new Platform(1450, 260, 100, 20));

  // Section 4: Long jump with spring and more spikes
  platforms.push(new Platform(1600, 500, 80, 20));
  springs.push(new Spring(1620, 480, 40, 20)); // Spring for long jump
  movingPlatforms.push(new MovingPlatform(1800, 400, 150, 20, 1700, 1900, 1)); // Moving platform 3
  spikes.push(new Spike(1820, 380, 100, 20));

  // Section 5: Final challenge
  platforms.push(new Platform(2000, 300, 100, 20));
  spikes.push(new Spike(2020, 280, 60, 20));
  platforms.push(new Platform(2150, 200, 100, 20)); // High platform
  springs.push(new Spring(2170, 180, 40, 20)); // Spring to reach even higher or for a secret?

  // --- Touch/Mouse Controls ---
  setupControls();
}

function draw() {
  // --- Background ---
  // Draw background image tiled across the entire 2400x600 world
  // This ensures it's not stretched and covers the whole area
  for (let x = 0; x < 2400; x += bgImg.width) {
    for (let y = 0; y < 600; y += bgImg.height) {
      image(bgImg, x, y);
    }
  }

  // --- Camera ---
  let cameraX = player.x - width / 4;
  cameraX = constrain(cameraX, 0, 2400 - 800);
  translate(-cameraX, 0);

  // --- Update and Display Game Objects ---
  player.update();
  player.display();
  
  for (let p of platforms) p.display();
  for (let s of spikes) s.display();
  for (let s of springs) s.display();
  for (let mp of movingPlatforms) { // New: Update and display moving platforms
    mp.update();
    mp.display();
  }

  // --- Enemy Missile Logic ---
  handleEnemyMissiles();

  // --- Player Missile Logic ---
  handlePlayerMissiles();
}

function respawn() {
  deathCount++;
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.vel.y = 0;
  
  deathCountEl.textContent = `Death Count: ${deathCount}`;
  dialogueEl.textContent = dialogues[deathCount % dialogues.length];
  enemyMissiles = []; // Clear all missiles
}

// --- Classes ---

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 40;
    this.vel = createVector(0, 0);
    this.onGround = false;
    this.direction = 1; // 1 for right, -1 for left
  }
  
  update() {
    // Horizontal movement
    if (keyIsDown(LEFT_ARROW) || moveLeft) {
      this.vel.x = -5;
      this.direction = -1;
    } else if (keyIsDown(RIGHT_ARROW) || moveRight) {
      this.vel.x = 5;
      this.direction = 1;
    } else {
      this.vel.x = 0;
    }

    // --- Collision Detection ---
    // 1. Horizontal
    this.x += this.vel.x;
    
    // Check collision with static platforms
    for (let p of platforms) {
        if (this.collidesWith(p)) {
            this.x = (this.vel.x > 0) ? p.x - this.w : p.x + p.w;
        }
    }
    // Check collision with moving platforms horizontally
    for (let mp of movingPlatforms) {
        if (this.collidesWith(mp)) {
            this.x = (this.vel.x > 0) ? mp.x - this.w : mp.x + mp.w;
        }
    }

    // 2. Vertical
    this.vel.y += gravity;
    this.y += this.vel.y;
    this.onGround = false;

    // Check collision with static platforms vertically
    for (let p of platforms) {
        if (this.collidesWith(p)) {
            if (this.vel.y > 0) {
                this.y = p.y - this.h;
                this.vel.y = 0;
                this.onGround = true;
            } else if (this.vel.y < 0) {
                this.y = p.y + p.h;
                this.vel.y = 0;
            }
        }
    }
    // Check collision with moving platforms vertically
    for (let mp of movingPlatforms) {
        if (this.collidesWith(mp)) {
            if (this.vel.y > 0) { // Moving down (landing)
                this.y = mp.y - this.h;
                this.vel.y = 0;
                this.onGround = true;
                this.x += mp.vel.x; // Move player with the platform
            } else if (this.vel.y < 0) { // Moving up (hitting ceiling)
                this.y = mp.y + mp.h;
                this.vel.y = 0;
            }
        }
    }
    
    // Spike Collision
    for (let s of spikes) {
        if (this.collidesWith(s)) {
            respawn();
        }
    }

    // Spring Collision
    for (let s of springs) {
        // Check for landing on top of the spring
        if (this.collidesWith(s) && this.vel.y > 0 && (this.y + this.h - this.vel.y) <= s.y) {
            this.y = s.y - this.h;
            this.vel.y = s.bounceForce; // Use the spring's bounce force
            this.onGround = true;
        }
    }

    // Out of bounds check
    if (this.y > height) {
      respawn();
    }
  }
  
  display() {
    image(playerImg, this.x, this.y, this.w, this.h);
  }
  
  jump() {
    if (this.onGround) {
      this.vel.y = -12;
    }
  }

  fire() {
      playerMissiles.push(new PlayerMissile(this.x + this.w / 2, this.y + this.h / 2, this.direction));
  }
  
  collidesWith(other) {
    return this.x < other.x + other.w &&
           this.x + this.w > other.x &&
           this.y < other.y + other.h &&
           this.y + this.h > other.y;
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || key === ' ') {
    player.jump();
  } else if (key === 'x' || key === 'X') {
    player.fire();
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  display() {
    fill(100, 80, 70); noStroke(); rect(this.x, this.y, this.w, this.h);
    fill(120, 100, 90);
    for (let i = 0; i < this.w; i += 20) rect(this.x + i, this.y, 10, this.h);
  }
}

class MovingPlatform {
  constructor(x, y, w, h, startX, endX, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.startX = startX;
    this.endX = endX;
    this.speed = speed;
    this.direction = 1; // 1 for right, -1 for left
    this.vel = createVector(this.speed, 0); // Current velocity
  }

  update() {
    this.x += this.vel.x;

    if (this.direction === 1) { // Moving right
      if (this.x + this.w > this.endX) {
        this.x = this.endX - this.w; // Correct position
        this.direction = -1;
        this.vel.x = -this.speed;
      }
    } else { // Moving left
      if (this.x < this.startX) {
        this.x = this.startX; // Correct position
        this.direction = 1;
        this.vel.x = this.speed;
      }
    }
  }

  display() {
    fill(50, 150, 100); // Different color for moving platforms
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class Spike {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }
    display() {
        fill(150, 150, 150); noStroke();
        for (let i = 0; i < this.w; i += 10) {
            triangle(this.x + i, this.y + this.h, this.x + i + 5, this.y, this.x + i + 10, this.y + this.h);
        }
    }
}

class Spring {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.bounceForce = -20; // A strong upward force
    }
    display() {
        fill(200, 200, 0); noStroke();
        rect(this.x, this.y, this.w, this.h);
        fill(150, 150, 0);
        rect(this.x, this.y - 10, this.w, 10); // Top plate
    }
}

class EnemyMissile {
  constructor(x, y, target) {
    this.x = x; this.y = y; this.w = 8; this.h = 16; this.speed = 3;
    let direction = createVector(target.x - this.x, target.y - this.y);
    direction.normalize();
    this.velocity = direction.mult(this.speed);
  }
  update() { this.x += this.velocity.x; this.y += this.velocity.y; }
  display() {
    fill(255, 100, 100); noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.velocity.heading() + PI / 2);
    beginShape(); vertex(0, -this.h / 2); vertex(-this.w / 2, this.h / 2); vertex(this.w / 2, this.h / 2); endShape(CLOSE);
    pop();
  }
  isOffScreen(cameraX) {
    return (this.y > height || this.y < -this.h || this.x < cameraX - this.w || this.x > cameraX + width);
  }
}

class PlayerMissile {
    constructor(x, y, direction) {
        this.x = x; this.y = y; this.w = 10; this.h = 5;
        this.speed = 8;
        this.velocity = createVector(this.speed * direction, 0);
    }
    update() { this.x += this.velocity.x; }
    display() { fill(0, 200, 255); noStroke(); rect(this.x, this.y, this.w, this.h); }
    isOffScreen(cameraX) {
        return (this.x < cameraX - this.w || this.x > cameraX + width);
    }
}

// --- Helper Functions for draw() loop ---

function handleEnemyMissiles() {
    let cameraX = player.x - width / 4;
    cameraX = constrain(cameraX, 0, 2400 - 800);

    if (frameCount % missileSpawnRate === 0) {
        let spawnX = cameraX + random(width);
        enemyMissiles.push(new EnemyMissile(spawnX, -20, player));
    }

    for (let i = enemyMissiles.length - 1; i >= 0; i--) {
        let m = enemyMissiles[i];
        m.update();
        m.display();
        if (player.collidesWith(m)) {
            respawn();
            enemyMissiles.splice(i, 1);
            continue;
        }
        if (m.isOffScreen(cameraX)) {
            enemyMissiles.splice(i, 1);
        }
    }
}

function handlePlayerMissiles() {
    let cameraX = player.x - width / 4;
    cameraX = constrain(cameraX, 0, 2400 - 800);

    for (let i = playerMissiles.length - 1; i >= 0; i--) {
        let m = playerMissiles[i];
        m.update();
        m.display();
        if (m.isOffScreen(cameraX)) {
            playerMissiles.splice(i, 1);
        }
    }
}

function setupControls() {
    leftBtn.addEventListener('mousedown', () => moveLeft = true);
    leftBtn.addEventListener('mouseup', () => moveLeft = false);
    leftBtn.addEventListener('mouseleave', () => moveLeft = false);
    leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft = true; });
    leftBtn.addEventListener('touchend', () => moveLeft = false);

    rightBtn.addEventListener('mousedown', () => moveRight = true);
    rightBtn.addEventListener('mouseup', () => moveRight = false);
    rightBtn.addEventListener('mouseleave', () => moveRight = false);
    rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight = true; });
    rightBtn.addEventListener('touchend', () => moveRight = false);

    jumpBtn.addEventListener('mousedown', () => player.jump());
    jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.jump(); });
}