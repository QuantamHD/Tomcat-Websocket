class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(otherVector) {
    this.x = otherVector.x;
    this.y = otherVector.y;
  }

  setValues(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  static zero() {
    return new Vector2D(0, 0);
  }
}

export { Vector2D };