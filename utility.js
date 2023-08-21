class Util {
  static create2DArray(width, height) {
    const matrix = new Array(width).fill().map(() => new Array(height));
    return matrix;
  }
}
