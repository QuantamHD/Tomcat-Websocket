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

  add(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    return this;
  }

  subtract(otherVector) {
    return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
  }

  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag > 0) {
      return new Vector2D(this.x / mag, this.y / mag);
    }
    return new Vector2D(0, 0);
  }

    normalize_clamed_sign() {
    const mag = this.magnitude();
    if (mag > 0) {
      let x = 0.0;
      let y = 0.0;
      if (this.x > 0) {
        x = 1.0;
      } else {
        x = -1.0;
      }
      
      if (this.y > 0) {
        y = 1.0;
      } else {
        y = -1.0;
      }
      return new Vector2D(x,y);
    }
    return new Vector2D(0, 0);
  }

  distance(otherVector) {
    return this.subtract(otherVector).magnitude();
  }

  equals(otherVector) {
    if (!otherVector) return false;
    return this.x === otherVector.x && this.y === otherVector.y;
  }

  static zero() {
    return new Vector2D(0, 0);
  }
}

export { Vector2D };