const LevelTypes = {
  Nurgle: "Nurgle",
  Slaanesh: "Slaanesh",
  Khorne: "Khorne",
  Tzeentch: "Tzeentch",
};
class LevelGenerator {
  constructor(levelType) {
    if (levelType === LevelTypes.Nurgle) {
      for (let i = 0; i < 3; i++) {
        let lvl = new NurgleLevel();
        levels.push(lvl);
      }
    } else if (levelType === LevelTypes.Slaanesh) {
      for (let i = 0; i < 3; i++) {
        let lvl = new SlaaneshLevel();
        levels.push(lvl);
      }
    } else if (levelType === LevelTypes.Khorne) {
      for (let i = 0; i < 3; i++) {
        let lvl = new KhorneLevel();
        levels.push(lvl);
      }
    } else if (levelType === LevelTypes.Tzeentch) {
      for (let i = 0; i < 3; i++) {
        let lvl = new TzeentchLevel();
        levels.push(lvl);
      }
    } else {
      return;
    }
  }
}
class Level {
  wallTiles = [];
  matrix = [];

  constructor() {
    if (this.constructor === Level) {
      throw new Error("Cannot create object from an abstract class!");
    }
  }

  reassignLonelyTile() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (
          this.matrix[i][j].wallTile === true &&
          i != 0 &&
          i != this.matrix.length - 1 &&
          j != 0 &&
          j != this.matrix.length - 1 &&
          this.matrix[i + 1][j].wallTile != true &&
          this.matrix[i - 1][j].wallTile != true &&
          this.matrix[i][j + 1].wallTile != true &&
          this.matrix[i][j - 1].wallTile != true
        ) {
          this.matrix[i][j].wallTile = false;
          this.matrix[i][j].pathTile = true;
          this.matrix[i][j].enemyTile = true;
        }
      }
    }
  }
  drawHelper(voro) {
    for (let i = 0; i < voro.matrix.length; i++) {
      for (let j = 0; j < voro.matrix[i].length; j++) {}
    }
  }
}
class NurgleLevel extends Level {
  layout = new PerlinGenerator("yellow", "green", 40, 8);
  roadTile = new PerlinGenerator("green", "yellow", 40, 8);
  drawLevel() {
    this.matrix = this.layout.createMatrix();
    this.roadMatrix = this.roadTile.createMatrixForTile();
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (this.roadMatrix[i][j].wallTile === true) {
          testCtx.strokeStyle = "rgb(165,190,68)";
        } else {
          testCtx.strokeStyle = "rgb(190,131,68)";
        }
        testCtx.strokeRect(i, j, 1, 1);
      }
    }
    const url = testCanvas.toDataURL("tili/png");
    const img = new Image();
    img.src = url;
    this.reassignLonelyTile();
    let disgMatrix = RandomWalk.generateLeft();
    let disgMatrix1 = RandomWalk.generate();
    let disgMatrix2 = RandomWalk.generateRight();
    let fullDisgM = [];
    for (let i = 0; i < 50; i++) {
      let row = [];
      for (let j = 0; j < 50; j++) {
        row.push(false);
      }
      fullDisgM.push(row);
    }

    let lastPoint0 = [];
    let lastPoint1 = [];
    let lastPoint2 = [];
    img.onload = () => {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          if (this.matrix[i][j].pathTile === true) {
            //lvlCtx.fillStyle = "red";
            //lvlCtx.fillRect(i * 50, j * 50, 50, 50);
            lvlCtx.drawImage(img, i * 50, j * 50);
          } else if (this.matrix[i][j].wallTile === true) {
            // voro.draw(i * 50, j * 50, "black", "rgb(133,89,80)");
            lvlCtx.drawImage(img, i * 50, j * 50);
            for (let a = 0; a < 50; a++) {
              for (let b = 0; b < 50; b++) {
                if (a < 16 && disgMatrix[a][b] === true) {
                  lvlCtx.strokeStyle = "rgb(133,89,80)";
                  lvlCtx.strokeRect(a + i * 50 + 12, b + j * 50 - 5, 1, 1);
                  lastPoint0 = [a + i * 50 + 12, b + j * 50 - 5];
                }
                if (a > 16 && a < 32 && disgMatrix1[a - 16][b] === true) {
                  lvlCtx.strokeStyle = "rgb(133,89,80)";
                  lvlCtx.strokeRect(a + i * 50, b + j * 50, 1, 1);
                  lastPoint1 = [a + i * 50, b + j * 50];
                }
                if (a > 32 && a < 48 && disgMatrix2[a - 32][b] === true) {
                  lvlCtx.strokeStyle = "rgb(133,89,80)";
                  lvlCtx.strokeRect(a + i * 50 - 12, b + j * 50 - 5, 1, 1);
                  lastPoint2 = [a + i * 50 - 12, b + j * 50 - 5];
                }
              }
            }
            let centerX = lastPoint0[0] - 5;
            let centerY = lastPoint0[1] - 5;
            this.drawDisgusting(centerX, centerY);
            this.drawDisgusting(lastPoint1[0], lastPoint1[1]);
            this.drawDisgusting(lastPoint2[0], lastPoint2[1]);
            //lvlCtx.stroke();
          }
        }
      }
    };
  }
  drawDisgusting(centerX, centerY) {
    const radius = 4;
    for (let i = centerX - radius; i < centerX + radius; i++) {
      for (let j = centerY - radius; j < centerY + radius; j++) {
        const di = i - centerX;
        const dj = j - centerY;
        const distance = Math.sqrt(di * di + dj * dj);
        if (distance < radius) {
          const clr = (i + j) % 2 === 0 ? "rgb(223,184,91)" : "rgb(218,81,36)";
          lvlCtx.fillStyle = clr;
          lvlCtx.fillRect(i, j, 1, 1);
        }
      }
    }
    lvlCtx.beginPath();
    lvlCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    lvlCtx.strokeStyle = "black";
    lvlCtx.lineWidth = 0.5;
    lvlCtx.stroke();

    /*lvlCtx.beginPath();
    lvlCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    lvlCtx.fillStyle = "yellow";
    lvlCtx.fill();
    lvlCtx.lineWidth = 1;
    lvlCtx.strokeStyle = "black";
    lvlCtx.stroke();*/
  }
  constructor() {
    super();
    this.wallTiles.push("Great Unclean One");
  }
}
class SlaaneshLevel extends Level {
  layout = new PerlinGenerator("pink", "purple", 40, 8);
  roadTile = new PerlinGenerator("green", "yellow", 40, 8);
  constructor() {
    super();
    this.wallTiles.push("Maiden of Pain");
    this.matrix.push("deinemutti");
  }
  drawLevel() {
    this.matrix = this.layout.createMatrix();
    this.roadMatrix = this.roadTile.createMatrixForTile();
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (this.roadMatrix[i][j].wallTile === true) {
          testCtx.strokeStyle = "purple";
        } else {
          testCtx.strokeStyle = "blue";
        }
        testCtx.strokeRect(i, j, 1, 1);
      }
    }
    const url = testCanvas.toDataURL("tili/png");
    const img = new Image();
    img.src = url;

    this.reassignLonelyTile();
    let voro = new Voronoi(lvlCtx, 10);
    voro.initialPoints();
    voro.createMatrix();
    voro.initialPointAssignment();

    voro.borders();
    img.onload = () => {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          if (this.matrix[i][j].pathTile === true) {
            //lvlCtx.fillStyle = "red";
            //lvlCtx.fillRect(i * 50, j * 50, 50, 50);
            lvlCtx.drawImage(img, i * 50, j * 50);
          } else if (this.matrix[i][j].wallTile === true) {
            voro.slaaneshDraw(i * 50, j * 50);
          }
        }
      }
    };
  }
  /*drawLevel() {
    this.matrix = this.layout.createMatrix();
    console.log(this.matrix);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix.length; j++) {
        lvlCtx.fillStyle = this.matrix[i][j].color;
        lvlCtx.fillRect(
          this.matrix[i][j].pixelX,
          this.matrix[i][j].pixelY,
          this.matrix[i][j].pixelSize,
          this.matrix[i][j].pixelSize
        );
      }
    }
  }*/
}
class KhorneLevel extends Level {
  layout = new VoronoiDiagram(10, 50);
  roadTile = new PerlinGenerator("gray", "red", 40, 8);

  constructor() {
    super();
    this.wallTiles.push("Champion of Khorne");
  }
  createFireTexture() {
    let perGen = new PerlinGenerator("black", "red", 50, 10);
    let perlinMatrix = perGen.createMatrixGood(50, 50);

    return perlinMatrix;
  }
  createSkull() {
    const skull = Util.create2DArray(40, 40);
    for (let i = 0; i < skull.length; i++) {
      for (let j = 0; j < skull[i].length; j++) {
        if (j <= 25 && j >= 14 && (i === 7 || i === 6)) {
          skull[j][i] = "black";
        } else if (
          (i === 9 || i === 8) &&
          ((j <= 13 && j >= 10) || (j <= 29 && j >= 26))
        ) {
          skull[j][i] = "black";
        } else if (
          i >= 10 &&
          i <= 12 &&
          (j === 8 || j === 9 || j === 30 || j === 31)
        ) {
          skull[j][i] = "black";
        } else if (
          i >= 13 &&
          i <= 23 &&
          (j === 6 || j === 7 || j === 32 || j === 33)
        ) {
          skull[j][i] = "black";
        } else if (
          (i === 24 || i === 25) &&
          (j === 8 || j === 9 || j === 30 || j === 31)
        ) {
          skull[j][i] = "black";
        } else if (
          i >= 26 &&
          i <= 28 &&
          (j === 10 || j === 11 || j === 28 || j === 29)
        ) {
          skull[j][i] = "black";
        } else if (
          (i === 29 || i === 30 || i === 31 || i === 32) &&
          (j === 12 || j === 13 || j === 26 || j === 27)
        ) {
          skull[j][i] = "black";
        } else if ((i === 33 || i === 34) && j >= 14 && j <= 26) {
          skull[j][i] = "black";
        } else if (
          (i === 13 || i === 14) &&
          ((j >= 12 && j <= 17) || (j >= 22 && j <= 27))
        ) {
          skull[j][i] = "black";
        } else if (
          i >= 15 &&
          i <= 19 &&
          ((j >= 10 && j <= 18) || (j >= 21 && j <= 29))
        ) {
          skull[j][i] = "black";
        } else if (i === 19 && ((j >= 10 && j <= 16) || (j >= 23 && j <= 28))) {
          skull[j][i] = "black";
        } else if (i === 20 && ((j >= 12 && j <= 16) || (j >= 23 && j <= 27))) {
          skull[j][i] = "black";
        } else if (
          (i === 24 || i === 25 || i === 22 || i === 23) &&
          j >= 18 &&
          j <= 22
        ) {
          skull[j][i] = "black";
        } else if (
          (i === 28 || i === 29 || i === 30 || i === 31 || i === 32) &&
          (j === 17 || j === 18 || j === 22 || j === 23)
        ) {
          skull[j][i] = "black";
        } else {
          skull[j][i] = "white";
        }
      }
    }
    for (let i = 0; i < skull.length; i++) {
      for (let j = 0; j < skull[i].length; j++) {
        if (skull[j][i] === "black") {
          break;
        } else {
          skull[j][i] = "rgba(50,0,0,1)";
        }
      }
    }
    for (let i = 0; i < skull.length; i++) {
      for (let j = skull[i].length - 1; j > 0; j--) {
        if (skull[j][i] === "black") {
          break;
        } else {
          skull[j][i] = "rgba(50,0,0,1)";
        }
      }
    }
    this.applyPerlinToSkull(skull);
    return skull;
  }
  applyPerlinToSkull(skull) {
    let perlinMatrix = this.createFireTexture();
    for (let i = 0; i < skull.length; i++) {
      for (let j = 0; j < skull[i].length; j++) {
        if (perlinMatrix[i][j].perlinValue > 0.15) {
          skull[i][j] = "rgb(150,0,0)";
        }
      }
    }
  }
  drawSkull() {
    let perlinG = new PerlinGenerator("black", "red", 40, 8);
    let perlinM = perlinG.createMatrixGood(8, 8);

    const skull = this.createSkull();
    /*for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j].wallPoint === true) {
          for (let x = 0; x < perlinM.length; x++) {
            for (let y = 0; y < perlinM[x].length; y++) {
              if (perlinM[x][y].perlinValue < -0.1) {
                for (let a = 0; a < skull.length; a++) {
                  for (let b = 0; b < skull[a].length; b++) {
                    lvlCtx.strokeStyle = skull[a][b];
                    lvlCtx.strokeRect(
                      i * 40 + b + x * 5,
                      j * 40 + a + y * 5,
                      1,
                      1
                    );
                  }
                }
              }
            }
          }
        }
      }
    }*/
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j].wallPoint === true) {
          for (let a = 0; a < skull.length; a++) {
            for (let b = 0; b < skull[a].length; b++) {
              if (
                a === 0 ||
                b === 0 ||
                a === skull.length - 1 ||
                b === skull[a].length - 1
              ) {
                lvlCtx.strokeStyle = "rgb(50,50,50)";
              } else {
                lvlCtx.strokeStyle = skull[a][b];
              }

              lvlCtx.strokeRect(i * 40 + a, j * 40 + b, 1, 1);
            }
          }
        }
      }
    }
  }
  drawFireTexture() {}
  drawLevel() {
    let fire = this.createFireTexture();

    let perGen = new PerlinGenerator("black", "red", 40, 8);
    let voronoi = new VoronoiDiagram(5, 50);
    let perlinMatrix = perGen.createMatrixGood(50, 50);
    console.log(perlinMatrix);

    let tileVoronoi = new VoronoiDiagram(10, 40);
    tileVoronoi.createBaseMatrix();
    tileVoronoi.chooseCenterPoints();
    tileVoronoi.assignPoints();
    tileVoronoi.lloydAlgorithm(10);
    tileVoronoi.borders();

    voronoi.createBaseMatrix();
    voronoi.chooseCenterPoints();
    voronoi.assignPoints();
    voronoi.lloydAlgorithm(2);
    voronoi.borders();
    voronoi.centerPoints.sort((a, b) => {
      if (a.x < b.x) {
        return -1;
      }
      if (a.x > b.x) {
        return 1;
      }

      if (a.y < b.y) {
        return -1;
      }
      if (a.y > b.y) {
        return 1;
      }
      return 0;
    });
    console.log(voronoi.centerPoints);

    this.matrix = voronoi.matrix;
    const paths = [];

    for (let i = 0; i < voronoi.centerPoints.length; i++) {
      let x = voronoi.centerPoints[i].x;
      let y = voronoi.centerPoints[i].y;
      this.matrix[x][y].centerPoint = true;
    }
    /*for (let i = 0; i < path.length; i++) {
      let x = path[i][0];
      let y = path[i][1];
      this.matrix[x][y].wallPoint = false;
      this.matrix[x][y].borderPoint = false;
      this.matrix[x][y].pathPoint = true;
    }*/
    for (let i = 0; i < voronoi.centerPoints.length - 1; i++) {
      let path = this.createPath(
        this.matrix,
        voronoi.centerPoints[i],
        voronoi.centerPoints[i + 1]
      );
      paths.push(path);
    }
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      for (let j = 0; j < path.length; j++) {
        let x = path[j][0];
        let y = path[j][1];
        this.matrix[x][y].wallPoint = false;
        this.matrix[x][y].borderPoint = false;
        this.matrix[x][y].pathPoint = true;
      }
    }
    console.log(paths);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (
          this.matrix[i][j].borderPoint === false &&
          perlinMatrix[i][j].perlinValue > 0.13 &&
          this.matrix[i][j].centerPoint === false &&
          this.matrix[i][j].pathPoint === false
        ) {
          this.matrix[i][j].wallPoint = true;
        }
      }
    }
    for (let i = 1; i < this.matrix.length - 1; i++) {
      for (let j = 1; j < this.matrix[i].length - 1; j++) {
        if (
          this.matrix[i][j].wallPoint === true &&
          this.matrix[i + 1][j].wallPoint === false &&
          this.matrix[i - 1][j].wallPoint === false &&
          this.matrix[i][j + 1].wallPoint === false &&
          this.matrix[i][j - 1].wallPoint === false
        ) {
          this.matrix[i][j].wallPoint = false;
        }
      }
    }

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j].borderPoint === true) {
          for (let a = 0; a < fire.length; a++) {
            for (let b = 0; b < fire.length; b++) {
              const value = fire[a][b].perlinValue;
              if (value > 0.1 && value < 0.9) {
                //const shade = Math.floor((value - 0.5) * 255 * 2);
                let color = `rgb(150,0,0)`;
                lvlCtx.strokeStyle = color;
              } else {
                //const shade = Math.floor((0.5 - value) * 255 * 2);
                let color = `rgb(50,0,0)`;
                lvlCtx.strokeStyle = color;
              }
              lvlCtx.strokeRect(i * 40 + a, j * 40 + b, 1, 1);
            }
          }
        }
      }
    }
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j].borderPoint === false) {
          for (let a = 0; a < tileVoronoi.matrix.length; a++) {
            for (let b = 0; b < tileVoronoi.matrix[a].length; b++) {
              if (
                tileVoronoi.matrix[a][b].borderPoint === true ||
                a == 0 ||
                b == 0 ||
                a == tileVoronoi.matrix.length - 1 ||
                b == tileVoronoi.matrix[a].length - 1
              ) {
                lvlCtx.strokeStyle = "rgb(50,50,50)";
                lvlCtx.strokeRect(i * 40 + a, j * 40 + b, 1, 1);
              } else {
                lvlCtx.strokeStyle = "black";
                lvlCtx.strokeRect(i * 40 + a, j * 40 + b, 1, 1);
              }
            }
          }
        }
      }
    }
    this.drawSkull();
  }
  createPath(matrix, start, end) {
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;
    let coords = [];
    if (startY > endY) {
      for (let i = endX; i >= startX; i--) {
        coords.push([i, endY]);
      }
      for (let i = startY; i >= endY; i--) {
        coords.push([endX, i]);
      }
    } else {
      for (let i = startX; i <= endX; i++) {
        coords.push([i, startY]);
      }
      for (let i = startY; i <= endY; i++) {
        coords.push([startX, i]);
      }
    }
    return coords;
  }
  isValidMove(matrix, x, y, visited) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    return x >= 0 && x < numRows && y >= 0 && y < numCols && !visited[x][y];
  }
  dfs(matrix, startX, startY, endX, endY, visited, path) {
    if (!this.isValidMove(matrix, startX, startY, visited)) {
      return false;
    }
    visited[startX][startY] = true;
    path.push([startX, startY]);
    if (startX === endX && startY === endY) {
      return true;
    }
    const directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    for (const [dx, dy] of directions) {
      const newX = startX + dx;
      const newY = startY + dy;
      if (this.dfs(matrix, newX, newY, endX, endY, visited, path)) {
        return true;
      }
    }
    path.pop();
    return false;
  }
  findPath(matrix, startX, startY, endX, endY) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    if (
      startX < 0 ||
      startX > numRows ||
      startY < 0 ||
      startY >= numCols ||
      endX < 0 ||
      endX > numRows ||
      endY < 0 ||
      endY > numRows
    ) {
      return null;
    }
    const visited = Array.from({ length: numRows }, () =>
      Array(numCols).fill(false)
    );
    const path = [];
    this.dfs(matrix, startX, startY, endX, endY, visited, path);

    return path;
  }
  getPartOfMatrix(matrix, x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    let arr = Util.create2DArray(xDist + 1, Math.abs(yDist) + 1);
    let yA;
    let yB;
    /*if (yDist < 0) {
      yA = arr[0].length - 1;
      yB = 0;
    } else {
      yA = 0;
      yB = arr[0].length - 1;
    }*/
    if (yDist < 0) {
      for (let i = x1; i < x2 + 1; i++) {
        for (let j = y2; j < y1 + 1; j++) {
          arr[i - x1][j - y2] = matrix[i][j];
        }
      }
    } else {
      for (let i = x1; i < x2 + 1; i++) {
        for (let j = y1; j < y2 + 1; j++) {
          arr[i - x1][j - y1] = matrix[i][j];
        }
      }
    }

    /*arr[0][yA] = matrix[x1][y1];
    //arr[arr.length - 1][arr[0].length - 1] = matrix[x2][y2];
    arr[arr.length - 1][yB] = matrix[x2][y2];*/

    return arr;
  }
}
class TzeentchLevel extends Level {
  layout = new PerlinGenerator("teal", "purple", 40, 8);
  roadTile = new PerlinGenerator("green", "yellow", 40, 8);
  constructor() {
    super();
    this.wallTiles.push("Your mom");
  }
  drawLevel() {
    let tileC = new PerlinGenerator("teal", "purple");
    this.matrix = this.layout.createMatrix();
    this.roadMatrix = this.roadTile.createMatrixForTile();
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (this.roadMatrix[i][j].wallTile === true) {
          testCtx.strokeStyle = "cyan";
        } else {
          testCtx.strokeStyle = "blue";
        }
        testCtx.strokeRect(i, j, 1, 1);
      }
    }
    const url = testCanvas.toDataURL("tili/png");
    const img = new Image();
    img.src = url;

    this.reassignLonelyTile();
    let tzeentchDeco = this.roadTile.createTzeentchTile();

    img.onload = () => {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          if (this.matrix[i][j].pathTile === true) {
            lvlCtx.drawImage(img, i * 50, j * 50);
          } else if (this.matrix[i][j].wallTile === true) {
            for (let a = 0; a < 50; a++) {
              for (let b = 0; b < 50; b++) {
                if (tzeentchDeco[a][b].pathTile === true) {
                  lvlCtx.strokeStyle = "blue";
                } else if (tzeentchDeco[a][b].wallTile === true) {
                  lvlCtx.strokeStyle = "teal";
                }
                lvlCtx.strokeRect(a + i * 50, b + j * 50, 1, 1);
              }
            }
          }
        }
      }
    };
  }
  /*drawLevel() {
    this.matrix = this.layout.createMatrix();
    console.log(this.matrix);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix.length; j++) {
        lvlCtx.fillStyle = this.matrix[i][j].color;
        lvlCtx.fillRect(
          this.matrix[i][j].pixelX,
          this.matrix[i][j].pixelY,
          this.matrix[i][j].pixelSize,
          this.matrix[i][j].pixelSize
        );
      }
    }
  }*/
}
class Tile {
  wallTile;
  pathTile;
  enemyTile;
  perlinValue;
  pixelX;
  pixelY;
  pixelSize;
  color;
  adjacenyMatrix = [];
}
