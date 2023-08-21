class EnemyGenerator {
  constructor() {
    if (this.constructor === EnemyGenerator) {
      throw new Error("Cannot create object from abstract class!");
    }
  }
}
class EnemyGeneratorKhorne extends EnemyGenerator {
  constructor() {
    super();
  }
}
class Enemy {
  x;
  y;
  health;
  constructor() {}
}
