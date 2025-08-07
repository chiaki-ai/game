const deathCountEl = document.getElementById('death-count');
const dialogueEl = document.getElementById('dialogue');

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

let player;
let platforms = [];
let traps = [];
let gravity = 0.6;
let deathCount = 0;
const spawnPoint = { x: 100, y: 550 };

function setup() {
  const canvas = createCanvas(1600, 600);
  canvas.parent('canvas-container');
  
  player = new Player(spawnPoint.x, spawnPoint.y);
  
  // Stage setup
  platforms.push(new Platform(0, 580, 1600, 20)); // Ground
  platforms.push(new Platform(200, 500, 150, 20));
  platforms.push(new Platform(450, 420, 150, 20));
  platforms.push(new Platform(650, 350, 100, 20));
  platforms.push(new Platform(800, 300, 150, 20));
  platforms.push(new Platform(1000, 250, 200, 20));
  platforms.push(new Platform(1250, 400, 100, 20));
  platforms.push(new Platform(1400, 350, 150, 20));
  
  // Trap setup
  traps.push(new Trap(350, 560, 100, 20)); // Spike on the ground
  traps.push(new Trap(500, 400, 20, 20)); // Floating spike
  traps.push(new Trap(700, 330, 50, 20));
  traps.push(new Trap(900, 280, 80, 20));
  traps.push(new Trap(1100, 230, 100, 20));
  traps.push(new Trap(1300, 380, 50, 20));
}

function draw() {
  background(135, 206, 235);
  
  player.update();
  player.display();
  
  for (let p of platforms) {
    p.display();
  }
  
  for (let t of traps) {
    t.display();
  }
}

function respawn() {
  deathCount++;
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.vel.y = 0;
  
  deathCountEl.textContent = `Death Count: ${deathCount}`;
  const deathCountEl = document.getElementById('death-count');
const dialogueEl = document.getElementById('dialogue');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const jumpBtn = document.getElementById('jump-btn');

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

let player;
let platforms = [];
let traps = [];
let gravity = 0.6;
let deathCount = 0;
const spawnPoint = { x: 100, y: 350 };
let moveLeft = false;
let moveRight = false;

function setup() {
  const canvas = createCanvas(800, 400);
  canvas.parent('canvas-container');
  
  player = new Player(spawnPoint.x, spawnPoint.y);
  
  // Stage setup
  platforms.push(new Platform(0, 380, 800, 20)); // Ground
  platforms.push(new Platform(200, 300, 150, 20));
  platforms.push(new Platform(450, 220, 150, 20));
  
  // Trap setup
  traps.push(new Trap(350, 360, 100, 20)); // Spike on the ground
  traps.push(new Trap(500, 200, 20, 20)); // Floating spike

  // Button event listeners
  leftBtn.addEventListener('mousedown', () => moveLeft = true);
  leftBtn.addEventListener('mouseup', () => moveLeft = false);
  leftBtn.addEventListener('mouseleave', () => moveLeft = false); // Handle mouse leaving button
  leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft = true; });
  leftBtn.addEventListener('touchend', () => moveLeft = false);

  rightBtn.addEventListener('mousedown', () => moveRight = true);
  rightBtn.addEventListener('mouseup', () => moveRight = false);
  rightBtn.addEventListener('mouseleave', () => moveRight = false); // Handle mouse leaving button
  rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight = true; });
  rightBtn.addEventListener('touchend', () => moveRight = false);

  jumpBtn.addEventListener('mousedown', () => player.jump());
  jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.jump(); });
}

function draw() {
  background(30);
  
  player.update();
  player.display();
  
  for (let p of platforms) {
    p.display();
  }
  
  for (let t of traps) {
    t.display();
  }
}

function respawn() {
  deathCount++;
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.vel.y = 0;
  
  deathCountEl.textContent = `Death Count: ${deathCount}`;
  dialogueEl.textContent = dialogues[deathCount % dialogues.length];
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 40;
    this.vel = createVector(0, 0);
    this.onGround = false;
  }
  
  update() {
    // Horizontal movement
    if (keyIsDown(LEFT_ARROW) || moveLeft) {
      this.vel.x = -5;
    } else if (keyIsDown(RIGHT_ARROW) || moveRight) {
      this.vel.x = 5;
    } else {
      this.vel.x = 0;
    }
    
    // Apply gravity
    this.vel.y += gravity;
    this.y += this.vel.y;
    this.x += this.vel.x;
    
    this.onGround = false;
    // Platform collision
    for (let p of platforms) {
      if (this.collidesWith(p)) {
        if (this.vel.y > 0) {
          this.y = p.y - this.h;
          this.vel.y = 0;
          this.onGround = true;
        }
      }
    }
    
    // Trap collision
    for (let t of traps) {
      if (this.collidesWith(t)) {
        respawn();
      }
    }
    
    // Out of bounds
    if (this.y > height) {
      respawn();
    }
  }
  
  display() {
    // Simple rectangle for the player for now
    fill(255, 200, 0);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
  
  jump() {
    if (this.onGround) {
      this.vel.y = -12;
    }
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
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  display() {
    fill(150);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class Trap {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  display() {
    fill(255, 0, 0);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 40;
    this.vel = createVector(0, 0);
    this.onGround = false;
  }
  
  update() {
    // Horizontal movement
    if (keyIsDown(LEFT_ARROW)) {
      this.vel.x = -5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.vel.x = 5;
    } else {
      this.vel.x = 0;
    }
    
    // Apply gravity
    this.vel.y += gravity;
    this.y += this.vel.y;
    this.x += this.vel.x;
    
    this.onGround = false;
    // Platform collision
    for (let p of platforms) {
      if (this.collidesWith(p)) {
        if (this.vel.y > 0) {
          this.y = p.y - this.h;
          this.vel.y = 0;
          this.onGround = true;
        }
      }
    }
    
    // Trap collision
    for (let t of traps) {
      if (this.collidesWith(t)) {
        respawn();
      }
    }
    
    // Out of bounds
    if (this.y > height) {
      respawn();
    }
  }
  
  display() {
    // Simple rectangle for the player for now
    fill(255, 200, 0);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
  
  jump() {
    if (this.onGround) {
      this.vel.y = -12;
    }
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
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  display() {
    fill(150);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class Trap {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  display() {
    fill(255, 0, 0);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}