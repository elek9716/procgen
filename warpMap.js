class WarpMap {
  voroDiagram;
  constructor() {
    this.generateMap();
  }
  generateMap() {
    let voro = new Voronoi(lvlCtx, 4);
    voro.initialPoints();
    voro.createMatrix();
    voro.initialPointAssignment();

    voro.lloyd();
    voro.borders();
    this.voroDiagram = voro;
  }
}
