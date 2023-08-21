class GameOfLife {
  constructor(width, height, cycleCount) {
    this.matrix = Util.create2DArray(width, height);
    this.cycleCount = cycleCount;
    this.generateBase();
    this.mirrorMatrix();
    this.assignNeighbors();
  }
  generateBase() {
    const width = this.matrix.length;
    const height = this.matrix[0].length;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let rnd = Math.round(Math.random() * 10);
        let cell = new Cell(i, j);
        /*
       
        } else {
          cell.neighbors = [
            [i, j + 1],
            [i, j - 1],
            [i + 1, j - 1],
            [i + 1, j + 1],
            [i - 1, j + 1],
            [i - 1, j - 1],
            [i + 1, j],
            [i - 1, j],
          ];
        }*/
        if (rnd < 3) {
          cell.alive = true;
        } else {
          cell.alive = false;
        }
        this.matrix[i][j] = cell;
      }
    }
  }
  assignNeighbors() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (i === 0 && j === 0) {
          this.matrix[i][j].neighbors = [
            this.matrix[i + 1][j],
            this.matrix[i][j + 1],
            this.matrix[i + 1][j + 1],
          ];
        } else if (
          i === this.matrix.length - 1 &&
          j === this.matrix[i].length - 1
        ) {
          this.matrix[i][j].neighbors = [
            this.matrix[i - 1][j],
            this.matrix[i][j - 1],
            this.matrix[i - 1][j - 1],
          ];
        } else if (i === this.matrix.length - 1 && j === 0) {
          this.matrix[i][j].neighbors = [
            this.matrix[i - 1][j],
            this.matrix[i][j + 1],
            this.matrix[i - 1][j + 1],
          ];
        } else if (i === 0 && j === this.matrix[i].length - 1) {
          this.matrix[i][j].neighbors = [
            this.matrix[i + 1][j],
            this.matrix[i][j - 1],
            this.matrix[i + 1][j - 1],
          ];
        } else if (i === 0) {
          this.matrix[i][j].neighbors = [
            this.matrix[i][j + 1],
            this.matrix[i + 1][j + 1],
            this.matrix[i + 1][j],
            this.matrix[i + 1][j - 1],
            this.matrix[i][j - 1],
          ];
        } else if (i === this.matrix.length - 1) {
          this.matrix[i][j].neighbors = [
            this.matrix[i][j + 1],
            this.matrix[i][j - 1],
            this.matrix[i - 1][j],
            this.matrix[i - 1][j + 1],
            this.matrix[i - 1][j - 1],
          ];
        } else if (j === 0) {
          this.matrix[i][j].neighbors = [
            this.matrix[i][j + 1],
            this.matrix[i + 1][j + 1],
            this.matrix[i - 1][j + 1],
            this.matrix[i + 1][j],
            this.matrix[i - 1][j],
          ];
        } else if (j === this.matrix[i].length - 1) {
          this.matrix[i][j].neighbors = [
            this.matrix[i][j - 1],
            this.matrix[i + 1][j - 1],
            this.matrix[i - 1][j - 1],
            this.matrix[i + 1][j],
            this.matrix[i - 1][j],
          ];
        } else {
          this.matrix[i][j].neighbors = [
            this.matrix[i][j + 1],
            this.matrix[i][j - 1],
            this.matrix[i + 1][j - 1],
            this.matrix[i + 1][j + 1],
            this.matrix[i - 1][j + 1],
            this.matrix[i - 1][j - 1],
            this.matrix[i + 1][j],
            this.matrix[i - 1][j],
          ];
        }
      }
    }
    console.log(this.matrix);
  }
  mirrorMatrix() {
    let half = this.matrix;
    const width = this.matrix.length;
    const height = this.matrix[0].length;
    let otherHalf = Util.create2DArray(width, height);

    for (let i = 0; i < half.length; i++) {
      for (let j = half[i].length - 1; j >= 0; j--) {
        let cellCopy = new Cell(half[i][j].x, half[i][j].y);
        cellCopy.alive = half[i][j].alive;
        cellCopy.neighbors = half[i][j].neighbors;
        otherHalf[i][j] = cellCopy;
      }
    }

    let fullForm = Util.create2DArray(width, height * 2);

    for (let i = 0; i < half.length; i++) {
      for (let j = 0; j < half[i].length; j++) {
        fullForm[i][j] = half[i][j];
        fullForm[i][j + height] = half[i][j];
      }
    }
    for (let i = 0; i < fullForm.length; i++) {
      let helper = width - 1;
      for (let j = 0; j < half[i].length; j++) {
        fullForm[i][helper] = fullForm[i][j];
        helper--;
      }
    }

    this.matrix = fullForm;
  }
  startGame() {
    let counter = 0;
    while (counter < this.cycleCount) {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          let aliveCounter = this.matrix[i][j].neighbors.filter(
            (x) => x.alive === true
          ).length;
          if (this.matrix[i][j].alive === false) {
            if (aliveCounter === 3) {
              this.matrix[i][j].alive = true;
            }
          } else {
            if (
              (this.matrix[i][j].alive === true && aliveCounter > 3) ||
              aliveCounter < 2
            ) {
              this.matrix[i][j].alive = false;
            }
          }
        }
      }
      counter++;
    }
  }
}
class Cell {
  neighbors;
  x;
  y;
  alive;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.neighbors = [];
  }
}
