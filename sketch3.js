var song
var fft
var particles = []
let panels
//let input;
//let analyzer;

function preload(){
    song = loadSound ('omw.mp3')
    img = loadImage('blues.jpg')
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)
    fft = new p5.FFT()
    //input = new p5.AudioIn();
    //input.start();
    panels = new Panels(20)
    //img.filter(BLUR, 12)
    //noLoop()
}

function draw(){
    background(0)
    angleMode(RADIANS)
    translate(width/2, height/2) 
    push()


    fft.analyze()
    amp = fft.getEnergy(20,200)
    var wave = fft.waveform()

    if (amp > 230) {
        panels.setColors()
    }
    panels.run()
    pop()

    var alpha = map (amp, 0, 255, 180, 150)
    fill(0, alpha)
    noStroke()
    rect(0,0, width, height)

    stroke (255)
    strokeWeight(3)
    noFill()
    //let volume = input.getLevel()
    //let threshold = 0.1
    //if (volume > threshold){
    for (var t = -1; t<=1; t += 2){
        beginShape()
        for (var i=0; i <= PI; i+= PI/360){
            var index = floor(map(i, 0, PI, 0, wave.length - 1))
            var r = map(wave[index],-1, 1, 150, 350)
            var x = r * sin(i) * t
            var y = r * cos(i)
            vertex(x,y)   
        }
        endShape()
    }
    var p = new Particle()
    particles.push(p)

    for (var i = particles.length - 1; i>= 0; i--){
        if (!particles[i].edges()) {
            particles[i].update( amp > 230)
            particles[i].show()
        } else {
            particles.splice(i,1)
        }
    }
}

function mouseClicked() {
    if (song.isPlaying()){
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

class Panels {
    constructor(n) {
      this.n = n;
      this.lifemax = 300;
      this.life = 0;
      this.colors = [];
      this.setColors(n);
    }
    setColors() {
      this.n = Math.floor(random(5, 9));
      let colors = [];
      for (let i = 0; i < this.n; i++) {
        colors.push(random(['#836f88', '#e37a8b', '#f7a695', '#d1ead7', '#92a49d', '#92a49d', '#4aa2ef', '#ef476f', '#ffd166', '#06d6a0']));
      }
      this.colors = colors;
      this.life = this.lifemax;
    }
    run() {
      this.update();
      this.display();
    }
    update() {
      this.alph = ('0' + Math.floor(map(this.life, this.lifemax, 0, 255, 100)).toString(16)).slice(-2);
      this.life = max(this.life - 4, 0);
    }
    display() {
      push();
      rotate(frameCount * 0.01);
      for (let i = 0; i < this.n; i++) {
        stroke(255);
        strokeWeight(2);
        fill(this.colors[i % this.colors.length] + this.alph);
        arc(0, 0, width + height, width + height, ((2 * PI) / this.n) * i, ((2 * PI) / this.n) * (i + 1), PIE);
      }
      pop();
    }
  }

class Particle {
    constructor(){
        this.pos = p5.Vector.random2D().mult(250)
        this.vel = createVector (0,0)
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
        this.w = random(3,5)

        this.color = [random(100,255), random(100,255), random(100,255),]
    }
    update(cond){
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if (cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }
    edges() {
        if (this.pos.x < -width / 2 || this.pos.x > width/2 ||
        this.pos.y < -height / 2 || this.pos.y > height / 2) {
           return true 
        } else {
            return false
        }
    }
    show(){
        noStroke()
        fill(this.color)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}


function degreesToRadians(angleInDegrees) {
    return (Math.PI * angleInDegrees) / 180;
  }