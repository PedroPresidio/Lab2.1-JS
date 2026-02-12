let serial;
let lightLevel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize Serial
  serial = new p5.SerialPort();
  serial.open('COM8'); // <--- Change this to your port
  serial.on('data', serialEvent);
}

function draw() {
  background(20); // Dark background

  // 1. MAP SENSOR TO SIZE & COLOR
  // Maps light (0-1023) to Size (50-500) and Color (Blue to Red)
  let size = map(lightLevel, 0, 1023, 50, 500);
  let r = map(lightLevel, 0, 1023, 0, 255);
  let b = map(lightLevel, 0, 1023, 255, 0);

  // 2. CREATE NEW VISUALIZATION (Shape Morphing)
  translate(width / 2, height / 2); // Put the ball in the center
  noStroke();
  fill(r, 100, b);

  if (lightLevel < 340) {
    ellipse(0, 0, size, size); // Circle for low light
  } else if (lightLevel < 680) {
    rectMode(CENTER);
    rect(0, 0, size, size);    // Square for medium light
  } else {
    drawTriangle(size);        // Triangle for high light
  }

  // 3. DEBUGGING (Fault Detection)
  resetMatrix(); // Reset coordinates for text
  fill(255);
  text("Light Value: " + lightLevel, 20, 30);
  
  if (lightLevel === 0) {
    fill(255, 0, 0);
    text("⚠️ FAULT: Check sensor connection!", 20, 50);
  }
}
//AI asssit
// Simple triangle helper
function drawTriangle(s) {
  triangle(0, -s/2, -s/2, s/2, s/2, s/2);
}

function serialEvent() {
  let input = serial.readLine();
  if (input) {
    input = input.trim();
    if (input.length > 0) {
      let val = parseInt(input);
      if (!isNaN(val)) lightLevel = val;
    }
  }
}