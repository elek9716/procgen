class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, []);
    }
  }

  addEdge(from, to) {
    if (this.nodes.has(from) && this.nodes.has(to)) {
      this.nodes.get(from).push(to);
    }
  }

  getNeighbors(id) {
    if (this.nodes.has(id)) {
      return this.nodes.get(id);
    }
    return [];
  }
}
