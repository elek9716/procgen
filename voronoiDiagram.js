class VoronoiDiagram {
  matrix;
  centerPoints = [];
  width;
  sideCount;
  constructor(sideCount, width) {
    this.matrix = [];
    this.sideCount = sideCount;
    this.width = width;
    this.colors = ["red", "cyan", "pink", "green", "orange", "pink", "purple"];
  }
  createBaseMatrix() {
    for (let i = 0; i < this.width; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        let vP = new VoronoiPoint(i, j);
        row.push(vP);
      }
      this.matrix.push(row);
    }
  }
  chooseCenterPoints() {
    for (let i = 0; i < this.sideCount; i++) {
      let mainX = Math.floor(Math.random() * this.width);
      let mainY = Math.floor(Math.random() * this.width);
      this.matrix[mainX][mainY].centerPX = mainX;
      this.matrix[mainX][mainY].centerPY = mainY;
      this.matrix[mainX][mainY].id = i;
      this.matrix[mainX][mainY].color = this.colors[i];
      this.centerPoints.push(this.matrix[mainX][mainY]);
    }
  }
  calculateDistance(x1, y1, x2, y2) {
    return Math.abs(Math.hypot(x1 - x2, y1 - y2));
  }
  assignPoints() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        let distance = -1;
        let newId = this.centerPoints[0].id;
        let newColor = this.centerPoints[0].color;

        for (let a = 0; a < this.centerPoints.length; a++) {
          let dist = this.calculateDistance(
            this.centerPoints[a].x,
            this.centerPoints[a].y,
            this.matrix[i][j].x,
            this.matrix[i][j].y
          );
          if (distance === -1 || dist < distance) {
            distance = dist;

            newId = this.centerPoints[a].id;
            newColor = this.centerPoints[a].color;
          }
        }
        this.matrix[i][j].id = newId;
        this.matrix[i][j].color = newColor;
      }
    }
  }
  calculateCentroid() {
    for (let i = 0; i < this.centerPoints.length; i++) {
      let numPixelsInCell = 0;
      let totalX = 0;
      let totalY = 0;
      for (let a = 0; a < this.matrix.length; a++) {
        for (let b = 0; b < this.matrix[i].length; b++) {
          if (this.matrix[a][b].id === this.centerPoints[i].id) {
            numPixelsInCell++;
            totalX += this.matrix[a][b].x;
            totalY += this.matrix[a][b].y;
          }
        }
      }
      this.centerPoints[i].x = Math.floor(totalX / numPixelsInCell);
      this.centerPoints[i].y = Math.floor(totalY / numPixelsInCell);
    }
    this.assignPoints();
  }
  lloyd() {
    for (let i = 0; i < this.sideCount; i++) {
      this.calculateCentroid();
    }
  }
  lloydAlgorithm(times) {
    for (let i = 0; i < times; i++) {
      this.calculateCentroid();
    }
  }
  borders() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.checkEdgeCorner(i, j) === false) {
          if (
            this.matrix[i][j].id !== this.matrix[i + 1][j].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j].id ||
            this.matrix[i][j].id !== this.matrix[i][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i][j - 1].id
            /*this.matrix[i][j].id !== this.matrix[i + 1][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i + 1][j - 1].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j - 1].id*/
          ) {
            this.matrix[i][j].borderPoint = true;
          } else {
            this.matrix[i][j].borderPoint = false;
          }
        } else {
          this.matrix[i][j].wallPoint = true;
        }
      }
    }
  }
  walls() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (
          this.checkEdgeCorner(i, j) === false &&
          this.matrix[i][j].borderPoint === false
        ) {
          if (
            this.matrix[i + 1][j].borderPoint === true ||
            this.matrix[i - 1][j].borderPoint === true ||
            this.matrix[i][j + 1].borderPoint === true ||
            this.matrix[i][j - 1].borderPoint === true
            /*this.matrix[i + 1][j + 1].borderPoint === true ||
            this.matrix[i + 1][j - 1].borderPoint === true ||
            this.matrix[i - 1][j + 1].borderPoint === true ||
            this.matrix[i - 1][j - 1].borderPoint === true */
          ) {
            this.matrix[i][j].wallPoint = true;
          }
        }
      }
    }
  }
  checkEdgeCorner(row, col) {
    return (
      row === 0 ||
      row === this.matrix.length - 1 ||
      col === 0 ||
      col === this.matrix.length - 1 ||
      (row === 0 && col === 0) ||
      (row === 0 && col === this.matrix.length) ||
      (row === this.matrix.length - 1 && col === 0) ||
      (row === this.matrix.length - 1 && col === this.matrix.length - 1)
    );
  }
  /*assignButtons(event) {
    const array = new Array();
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        array.push(this.matrix[i][j]);
      }
    }
    console.log(array);
    const rect = lvlCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let clickedCell = null;
    let minDistance = Infinity;
    for (const point of array) {
      const centroidX = point.x;
      const centroidY = point.y;
      const dist = this.calculateDistance(mouseX, centroidX, mouseY, centroidY);

      if (dist < minDistance) {
        minDistance = dist;
        clickedCell = point;
      }
    }
    if (clickedCell) {
      console.log(clickedCell.color);
    }
  }*/
}
class VoronoiPoint {
  color;
  id;
  x;
  y;
  centerPoint;
  centerPX;
  centerPY;
  wallPoint;
  borderPoint;

  constructor(x, y) {
    this.wallPoint = false;
    this.borderPoint = false;
    this.centerPoint = false;
    this.pathPoint = false;
    this.x = x;
    this.y = y;
  }
}
