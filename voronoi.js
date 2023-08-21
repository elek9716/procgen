class Voronoi {
  matrix = [];
  centerPoints = [];
  id;
  sideCount;
  color0;
  color1;
  constructor(ctx, sideCount) {
    this.ctx = ctx;
    this.sideCount = sideCount;
  }
  initialPoints() {
    for (let i = 0; i < this.sideCount; i++) {
      let x = Math.floor(Math.random() * 50);
      let y = Math.floor(Math.random() * 50);

      let point = new Point();
      point.x = x;
      point.y = y;
      point.id = i;
      this.centerPoints.push(point);
    }
  }
  calculateDistance(x1, y1, x2, y2) {
    return Math.abs(Math.hypot(x1 - x2, y1 - y2));
  }
  createMatrix() {
    for (let i = 0; i < 50; i++) {
      let row = [];
      for (let j = 0; j < 50; j++) {
        let point = new Point();
        point.x = j;
        point.y = i;
        point.id = 0;
        row.push(point);
      }
      this.matrix.push(row);
    }
  }
  initialPointAssignment() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        let distance = -1;
        let newId = this.centerPoints[0].id;

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
          }
        }
        this.matrix[i][j].id = newId;
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
      this.centerPoints[i].x = totalX / numPixelsInCell;
      this.centerPoints[i].y = totalY / numPixelsInCell;
    }
    this.initialPointAssignment();
  }
  lloyd() {
    for (let i = 0; i < 5; i++) {
      this.calculateCentroid();
    }
  }
  checkEdgeCorner(row, col) {
    return (
      row === 0 ||
      row === 49 ||
      col === 0 ||
      col === 49 ||
      (row === 0 && col === 0) ||
      (row === 0 && col === 49) ||
      (row === 49 && col === 0) ||
      (row === 49 && col === 49)
    );
  }
  borders() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.checkEdgeCorner(i, j) === false) {
          if (
            this.matrix[i][j].id !== this.matrix[i + 1][j].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j].id ||
            this.matrix[i][j].id !== this.matrix[i][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i][j - 1].id ||
            this.matrix[i][j].id !== this.matrix[i + 1][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i + 1][j - 1].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j + 1].id ||
            this.matrix[i][j].id !== this.matrix[i - 1][j - 1].id
          ) {
            this.matrix[i][j].borderPoint = true;
          } else {
            this.matrix[i][j].borderPoint = false;
          }
        }
      }
    }
  }
  draw(x, y, c1, c2) {
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (
          this.matrix[i][j].borderPoint === true ||
          this.checkEdgeCorner(i, j) === true
        ) {
          this.ctx.strokeStyle = c1;
        } else {
          this.ctx.strokeStyle = c2;
        }
        this.ctx.strokeRect(i + x, j + y, 1, 1);
      }
    }
  }
  slaaneshDraw(x, y) {
    const colors = [
      "#e458f1",
      "#abf5ed",
      "#7defe3",
      "#50104a",
      "#eeb0e8",
      "#d8b0ee",
      "#a51eef",
      "#ef1ee2",
      "#000000",
      "#f77af5",
    ];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (
          this.matrix[i][j].borderPoint === true ||
          this.checkEdgeCorner(i, j) === true
        ) {
          this.ctx.strokeStyle = "black";
        } else {
          let clr = colors[this.matrix[i][j].id];
          this.ctx.strokeStyle = clr;
        }
        this.ctx.strokeRect(i + x, j + y, 1, 1);
      }
    }
  }
}

class Point {
  x;
  y;
  id;
  borderPoint;
  wallPoint;
  constructor() {
    this.wallPoint = false;
  }
}
