"use strict";
const lvlCanvas = document.getElementById("lvlCanvas");
const testCanvas = document.getElementById("testCanvas");
let lvlCtx = lvlCanvas.getContext("2d", { colorSpace: "srgb" });
let testCtx = testCanvas.getContext("2d", { colorSpace: "srgb" });
let mapVoro = new WarpMap();
let voronidia = new VoronoiDiagram(4, 1000);
let perlinCreator = new PerlinCreator();
let mtrx = perlinCreator.createNoiseMatrix(500, 500);
let erlinGenerator = new PerlinGenerator("black", "white", 1, 1);
let value = 3;
let fullMatrix = [];
let lvlGen;
let levels;
let asd;
let rw;
let rw2;
let rw3;
let clrke;

/*for (let i = 0; i < khornegen.enemyMatrix.length; i++) {
  let string = "";
  for (let j = 0; j < khornegen.enemyMatrix[i].length; j++) {
    if (khornegen.enemyMatrix[i][j].alive === true) {
      string += "*";
    } else {
      string += "-";
    }
  }
  console.log(string);
}
console.log("---------");
for (let i = 0; i < khornegen.enemyMatrix.length; i++) {
  for (let j = 0; j < khornegen.enemyMatrix[i].length; j++) {
    if (khornegen.enemyMatrix[i][j].alive === true) {
      testCtx.strokeStyle = "black";
    } else {
      testCtx.strokeStyle = "white";
    }
    testCtx.strokeRect(j, i, 1, 1);
  }
}*/
voronidia.createBaseMatrix();
voronidia.chooseCenterPoints();
voronidia.assignPoints();
voronidia.lloyd();

perlinCreator.applyNoise(mtrx);

let parts = perlinCreator.createParticles(2000);

let animationRequestId; // Variable to hold the animation frame request ID
let shouldAnimate = true; // Flag to control animation
function updateAndDrawParticles() {
  if (!shouldAnimate) {
    return; // Stop animation if the flag is set to false
  }

  perlinCreator.updateParticles(parts);
  lvlCtx.clearRect(0, 0, lvlCanvas.width, lvlCanvas.height);
  for (const particle of parts) {
    lvlCtx.fillStyle = chooseClr(particle);
    lvlCtx.beginPath();
    lvlCtx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
    lvlCtx.fill();
  }

  animationRequestId = requestAnimationFrame(updateAndDrawParticles);
}

function chooseClr(particle) {
  let minDist = -1;
  let clr = "purple";
  let newcolor;
  if (
    particle.y > 1500 ||
    particle.y < 500 ||
    particle.x < 500 ||
    particle.x > 1500
  ) {
    clr = "purple";
  } else {
    for (let i = 0; i < voronidia.centerPoints.length; i++) {
      let dist = voronidia.calculateDistance(
        particle.x,
        particle.y,
        voronidia.centerPoints[i].x + 500,
        voronidia.centerPoints[i].y + 500
      );
      if (minDist === -1 || dist < minDist) {
        minDist = dist;

        newcolor = voronidia.centerPoints[i].color;
      }
    }
    clr = newcolor;
  }
  return clr;
}

updateAndDrawParticles();
lvlCanvas.addEventListener("click", assignButtons);
let pipo;
function assignButtons(event) {
  const array = new Array();
  for (let i = 0; i < voronidia.matrix.length; i++) {
    for (let j = 0; j < voronidia.matrix[i].length; j++) {
      array.push(voronidia.matrix[i][j]);
    }
  }

  const rect = lvlCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let clickedCell = null;
  let minDistance = Infinity;
  for (const point of array) {
    const centroidX = point.x;
    const centroidY = point.y;
    const dist = voronidia.calculateDistance(
      mouseX,
      mouseY,
      centroidX + 500,
      centroidY + 500
    );

    if (dist < minDistance && dist < 226) {
      minDistance = dist;
      clickedCell = point;
    }
  }

  if (clickedCell === null) {
    return;
    // Clicked outside the Voronoi region, do nothing
  }

  // Your existing logic for handling the click inside the Voronoi region
  if (clickedCell.color === "red") {
    shouldAnimate = false;
    clrke = "Khorne";
  } else if (clickedCell.color === "pink") {
    shouldAnimate = false;
    clrke = "Slaanesh";
  } else if (clickedCell.color === "green") {
    shouldAnimate = false;
    clrke = "Nurgle";
  } else if (clickedCell.color === "cyan") {
    clrke = "Tzeentch";
    shouldAnimate = false;
  } else {
    return;
  }
}
for (let i = 0; i < voronidia.matrix.length; i++) {
  for (let j = 0; j < voronidia.matrix[i].length; j++) {}
}
for (let i = 0; i < voronidia.matrix.length; i++) {
  for (let j = 0; j < voronidia.matrix[i].length; j++) {
    lvlCtx.strokeStyle = voronidia.matrix[i][j].color;
    lvlCtx.strokeRect(voronidia.matrix[i][j].x, voronidia.matrix[i][j].y, 1, 1);
  }
}
lvlCanvas.addEventListener("click", function () {
  if (shouldAnimate === true) {
    return;
  } else {
    cancelAnimationFrame(animationRequestId); // Cancel the animation frame
    lvlCanvas.removeEventListener("click", assignButtons); // Remove the click event listener
    afterClick();
  } // Set the flag to stop animation
});

function afterClick() {
  levels = [];
  lvlGen = new LevelGenerator(clrke);

  rw = RandomWalk.generate();
  rw2 = RandomWalk.generate();
  rw3 = RandomWalk.generate();

  levels[0].drawLevel();

  asd = levels[0];

  lvlCtx.strokeStyle = "purple";

  lvlCtx.strokeStyle = "yellow";
  lvlCanvas.removeEventListener("click", assignButtons);
}
