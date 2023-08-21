class PerlinGenerator {
  color0;
  color1;
  gridSize;
  resolution;
  constructor(color0, color1, gridSize, resolution) {
    this.color0 = color0;
    this.color1 = color1;
    this.gridSize = gridSize;
    this.resolution = resolution;
  }
  perlinNoise(x, y) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);

    // Get the corner values
    const topLeft = this.dotProductGradient(floorX, floorY, x, y);
    const topRight = this.dotProductGradient(floorX + 1, floorY, x, y);
    const bottomLeft = this.dotProductGradient(floorX, floorY + 1, x, y);
    const bottomRight = this.dotProductGradient(floorX + 1, floorY + 1, x, y);

    // Calculate the fractional parts
    const fracX = x - floorX;
    const fracY = y - floorY;

    // Round the fractional values to 0 or 1 for blocky effect
    const topInterpolation = fracY < 0.5 ? topLeft : bottomLeft;
    const bottomInterpolation = fracY < 0.5 ? topRight : bottomRight;

    return fracX < 0.5 ? topInterpolation : bottomInterpolation;
  }
  dotProductGradient(cellX, cellY, pointX, pointY) {
    const gradientVector = [this.randomGen(), this.randomGen()];
    const vectorToPoint = [pointX - cellX, pointY - cellY];
    return (
      gradientVector[0] * vectorToPoint[0] +
      gradientVector[1] * vectorToPoint[1]
    );
  }
  interpolate(a, b, t) {
    const weightFunc = (t) => 0.5 * (1 - Math.cos(t * Math.PI));
    const interpolatedValue = a * (1 - weightFunc(t)) + b * weightFunc(t);
    return interpolatedValue;
  }
  randomGen() {
    //return Math.random() * 2 - 1;
    return Math.random() * 2 - 1;
  }
  tzeentchGen() {
    return Math.sin(Math.random() * 2 - 1);
  }
  createTzeentchTile() {
    let matrix = [];
    const scale = 50 / (this.gridSize * this.resolution);
    for (let i = 0; i < 50; i++) {
      let arr = [];
      for (let j = 0; j < 50; j++) {
        let tile = new Tile();
        let perlinValue = this.tzeentchNoise(
          j / this.resolution,
          i / this.resolution
        );
        tile.perlinValue = perlinValue;

        const pixelX = i * this.resolution * scale;
        const pixelY = j * this.resolution * scale;
        const pixelSize = this.resolution * scale;
        tile.pixelX = pixelX;
        tile.pixelY = pixelY;
        tile.pixelSize = pixelSize;
        if (perlinValue >= 0) {
          tile.pathTile = true;
        } else {
          tile.wallTile = true;
        }

        //lvlCtx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        arr.push(tile);
      }
      matrix.push(arr);
    }

    return matrix;
  }
  tzeentchProductGradient(cellX, cellY, pointX, pointY) {
    const gradientVector = [this.tzeentchGen(), this.tzeentchGen()];
    const vectorToPoint = [pointX - cellX, pointY - cellY];
    return (
      gradientVector[0] * vectorToPoint[0] +
      gradientVector[1] * vectorToPoint[1]
    );
  }
  tzeentchNoise(x, y) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const topLeft = this.dotProductGradient(floorX, floorY, x, y);
    const topRight = this.dotProductGradient(floorX + 1, floorY, x, y);
    const bottomLeft = this.dotProductGradient(floorX, floorY + 1, x, y);
    const bottomRight = this.dotProductGradient(floorX + 1, floorY + 1, x, y);

    const fracX = x - floorX;
    const fracY = y - floorY;

    const topInterpolation = this.interpolate(topLeft, topRight, fracX);
    const bottomInterpolation = this.interpolate(
      bottomLeft,
      bottomRight,
      fracX
    );

    return this.interpolate(topInterpolation, bottomInterpolation, fracY);
  }
  createMatrixForTile() {
    let matrix = [];
    const scale = 50 / (this.gridSize * this.resolution);
    for (let i = 0; i < 50; i++) {
      let arr = [];
      for (let j = 0; j < 50; j++) {
        let tile = new Tile();
        let perlinValue = this.perlinNoise(
          j / this.resolution,
          i / this.resolution
        );
        tile.perlinValue = perlinValue;

        const pixelX = i * this.resolution * scale;
        const pixelY = j * this.resolution * scale;
        const pixelSize = this.resolution * scale;
        tile.pixelX = pixelX;
        tile.pixelY = pixelY;
        tile.pixelSize = pixelSize;
        if (perlinValue >= 0.1) {
          tile.pathTile = true;
        } else {
          tile.wallTile = true;
        }

        //lvlCtx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        arr.push(tile);
      }
      matrix.push(arr);
    }

    return matrix;
  }
  createMatrix() {
    let matrix = [];
    const scale = 2000 / (this.gridSize * this.resolution);
    for (let i = 0; i < 50; i++) {
      let arr = [];
      for (let j = 0; j < 50; j++) {
        let tile = new Tile();
        let perlinValue = this.perlinNoise(
          j / this.resolution,
          i / this.resolution
        );
        tile.perlinValue = perlinValue;

        const pixelX = i * this.resolution * scale;
        const pixelY = j * this.resolution * scale;
        const pixelSize = this.resolution * scale;
        tile.pixelX = pixelX;
        tile.pixelY = pixelY;
        tile.pixelSize = pixelSize;
        if (perlinValue >= -0.1 && perlinValue <= 0.4) {
          tile.pathTile = true;
        } else {
          tile.wallTile = true;
        }

        //lvlCtx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        arr.push(tile);
      }
      matrix.push(arr);
    }

    return matrix;
  }
  createPerlinMatrix() {
    let matrix = [];
    const scale = 40 / (this.gridSize * this.resolution);
    for (let i = 0; i < 40; i++) {
      let arr = [];
      for (let j = 0; j < 40; j++) {
        let tile = new Tile();
        let perlinValue = this.perlinNoise(
          j / this.resolution,
          i / this.resolution
        );
        tile.perlinValue = perlinValue;

        const pixelX = i * this.resolution * scale;
        const pixelY = j * this.resolution * scale;
        const pixelSize = this.resolution * scale;
        tile.pixelX = pixelX;
        tile.pixelY = pixelY;
        tile.pixelSize = pixelSize;
        if (perlinValue >= 0.1) {
          tile.pathTile = true;
        } else {
          tile.wallTile = true;
        }

        //lvlCtx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        arr.push(tile);
      }
      matrix.push(arr);
    }

    return matrix;
  }
  createMatrixGood(width, height) {
    let matrix = Util.create2DArray(width, height);
    const scale = width / (this.gridSize * this.resolution);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let tile = new Tile();
        let perlinValue = this.perlinNoise(
          j / this.resolution,
          i / this.resolution
        );
        tile.perlinValue = perlinValue;
        const pixelX = i * this.resolution * scale;
        const pixelY = j * this.resolution * scale;
        const pixelSize = this.resolution * scale;
        tile.pixelX = pixelX;
        tile.pixelY = pixelY;
        tile.pixelSize = pixelSize;
        if (perlinValue >= 0.1) {
          tile.pathTile = true;
        } else {
          tile.wallTile = true;
        }
        matrix[i][j] = tile;
      }
    }
    return matrix;
  }
  floodFill(x, y, matrix) {
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop();

      if (
        currentX >= 0 &&
        currentX < matrix[0].length &&
        currentY >= 0 &&
        currentY < matrix.length &&
        matrix[currentY][currentX].wallTile === false &&
        matrix[currentY][currentX].pathTile === true
      ) {
        matrix[currentY][currentX].wallTile = true;
        matrix[currentY][currentX].pathTile = false;

        // Add adjacent tiles to the stack
        stack.push([currentX - 1, currentY]);
        stack.push([currentX + 1, currentY]);
        stack.push([currentX, currentY - 1]);
        stack.push([currentX, currentY + 1]);
      }
    }
  }
}
