class SpriteGenerator {}
class Mask {
  constructor(data, width, height, mirrorX, mirrorY) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.mirrorX = typeof mirrorX !== "undefined" ? mirrorX : true;
    this.mirrorY = typeof mirrorY !== "undefined" ? mirrorY : true;
  }
}
class Sprite {
  constructor(mask, options) {
    this.width = mask.width * (mask.mirrorX ? 2 : 1);
    this.height = mask.height * (mask.mirrorY ? 2 : 1);
    this.mask = mask;
    this.data = new Array(this.width * this.height);
    this.options = {
      ...{
        colored: false,
        edgeBrightness: 0.3,
        colorVariations: 0.2,
        brightnessNoise: 0.3,
        saturation: 0.5,
      },
      ...options,
    };

    this.init();
  }
  init() {
    this.initData();

    this.applyMask();
    this.generateRandomSample();

    if (this.mask.mirrorX) {
      this.mirrorX();
    }

    if (this.mask.mirrorY) {
      this.mirrorY();
    }

    this.generateEdges();
    //this.renderPixelData();
  }
  getData(x, y) {
    return this.data[y * this.width + x];
  }
  setData(x, y, value) {
    this.data[y * this.width + x] = value;
  }
  initData() {
    let h = this.height;
    let w = this.width;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.setData(x, y, -1);
      }
    }
  }
  mirrorX() {
    let h = this.height;
    let w = this.width;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.setData(this.width - x - 1, y, this.getData(x, y));
      }
    }
  }
  mirrorY() {
    let h = this.height;
    let w = this.width;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.setData(x, this.height - y - 1, this.getData(x, y));
      }
    }
  }
  applyMask() {
    let h = this.height;
    let w = this.width;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.setData(x, y, this.mask.data[y * w + x]);
      }
    }
  }
  generateRandomSample() {
    let h = this.height;
    let w = this.width;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (val === 1) {
          val *= Math.round(Math.random());
        } else if (val === 2) {
          if (Math.random() > 0.5) {
            val = 1;
          } else {
            val = -1;
          }
        }
        this.setData(x, y, val);
      }
    }
  }
  generateEdges() {
    let h = this.height;
    let w = this.width;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (this.getData(x, y) > 0) {
          if (y - 1 > 0 && this.getData(x, y - 1) === 0) {
            this.setData(x, y - 1, -1);
          }
          if (y + 1 < this.height && this.getData(x, y + 1) === 0) {
            this.setData(x, y + 1, -1);
          }
          if (x - 1 >= 0 && this.getData(x - 1, y) === 0) {
            this.setData(x - 1, y, -1);
          }
          if (x + 1 < this.width && this.getData(x + 1, y) === 0) {
            this.setData(x + 1, y, -1);
          }
        }
      }
    }
  }
}
