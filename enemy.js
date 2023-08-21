class Enemy {
  health;
  sprites = [];
  state;
  constructor() {
    if (this.constructor === Enemy) {
      throw new Error("Cannot create object from an abstract class!");
    }
  }
}
class KhorneEnemy extends Enemy {}
class SlaaneshEnemy extends Enemy {}
class NurgleEnemy extends Enemy {}
class TzeentchEnemy extends Enemy {}
