class PerlinCreator {
  constructor() {}
  createNoiseMatrix(width, height) {
    let noiseMatrix = [];
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < height; j++) {
        let noise = 0;
        row.push({ i, j, noise });
      }
      noiseMatrix.push(row);
    }
    return noiseMatrix;
  }
  applyNoise(noiseMatrix) {
    let perlinG = new PerlinGenerator("black", "purple", 1, 1);
    for (let i = 0; i < noiseMatrix.length; i++) {
      for (let j = 0; j < noiseMatrix[i].length; j++) {
        noiseMatrix[i][j].noise = perlinG.perlinNoise(j / 10, i / 10);
      }
    }
  }
  createParticles(numPoints) {
    const particles = [];
    for (let i = 0; i < numPoints; i++) {
      let particleX = Math.floor(Math.random() * 2000);
      let particleY = Math.floor(Math.random() * 2000);

      let particle = new Particle(particleX, particleY);
      particles.push(particle);
    }
    return particles;
  }
  updateParticles(particles) {
    let perlinG = new PerlinGenerator("black", "purple", 1, 1);
    for (let i = 0; i < particles.length; i++) {
      let noise = perlinG.perlinNoise(particles[i].y / 10, particles[i].x / 10);
      particles[i].xv = Math.abs(Math.cos(noise * Math.PI * 2));

      particles[i].xy = -Math.sin(noise * Math.PI * 2);
      particles[i].x += particles[i].xv;
      particles[i].y += particles[i].xy;
      if (particles[i].x > lvlCanvas.width) {
        particles[i].x = 0;
      }
      if (particles[i].x < 0) {
        particles[i].x = lvlCanvas.width;
      }
      if (particles[i].y > lvlCanvas.height) {
        particles[i].y = 0;
      }
      if (particles[i].y < 0) {
        particles[i].y = lvlCanvas.height;
      }
    }
  }
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xv = 0;
    this.yv = 0;
  }
  update() {}
}
