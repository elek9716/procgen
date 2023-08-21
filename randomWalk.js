class RandomWalk {
  static walk(matrix) {
    let x = 8;
    let y = 25;
    matrix[x][y] = true;
    let directions = [
      [-1, 0],

      [1, 0],

      [0, -1],
      [0, -1],
      [0, -1],
      [0, -1],
      [0, 1],
    ];
    for (let i = 0; i < 100; i++) {
      let dir = directions[Math.floor(Math.random() * directions.length)];
      x += dir[0];
      y += dir[1];
      if (x < 0 || x >= 16 || y < 0 || y >= 50) {
        break;
      }
      matrix[x][y] = true;
    }
  }
  static walkLeft(matrix) {
    let x = 8;
    let y = 25;
    matrix[x][y] = true;
    let directions = [
      [-1, 0],
      [-1, 0],
      [-1, 0],
      [-1, 0],
      [1, 0],

      [0, -1],
      [0, -1],
      [0, -1],
      [0, -1],

      [0, 1],
    ];
    for (let i = 0; i < 100; i++) {
      let dir = directions[Math.floor(Math.random() * directions.length)];
      x += dir[0];
      y += dir[1];
      if (x < 0 || x >= 16 || y < 0 || y >= 50) {
        break;
      }
      matrix[x][y] = true;
    }
  }
  static walkRight(matrix) {
    let x = 8;
    let y = 25;
    matrix[x][y] = true;
    let directions = [
      [-1, 0],

      [1, 0],
      [1, 0],
      [1, 0],
      [1, 0],

      [0, -1],
      [0, -1],
      [0, -1],
      [0, -1],
      [0, 1],
    ];
    for (let i = 0; i < 100; i++) {
      let dir = directions[Math.floor(Math.random() * directions.length)];
      x += dir[0];
      y += dir[1];
      if (x < 0 || x >= 16 || y < 0 || y >= 50) {
        break;
      }
      matrix[x][y] = true;
    }
  }
  static generateLeft() {
    const matrix = [];
    for (let i = 0; i < 16; i++) {
      const row = [];
      for (let j = 0; j < 50; j++) {
        row.push(false);
      }
      matrix.push(row);
    }

    this.walkLeft(matrix);

    return matrix;
  }
  static generateRight() {
    const matrix = [];
    for (let i = 0; i < 16; i++) {
      const row = [];
      for (let j = 0; j < 50; j++) {
        row.push(false);
      }
      matrix.push(row);
    }

    this.walkRight(matrix);

    return matrix;
  }
  static generate() {
    const matrix = [];
    for (let i = 0; i < 16; i++) {
      const row = [];
      for (let j = 0; j < 50; j++) {
        row.push(false);
      }
      matrix.push(row);
    }

    this.walk(matrix);

    return matrix;
  }
}
