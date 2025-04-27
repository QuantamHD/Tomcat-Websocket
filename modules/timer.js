
// this could be changed to add the ability to autostart and also only run once later.
class Timer {
  constructor(time, callback) {
      this.time = time;
      this.currTime = time;
      this.callback = callback;
  }

  reset(newTime) {
      this.time = newTime;
      this.currTime = newTime;
  }

  update(deltaT) {
      this.currTime -= deltaT;
      if (this.currTime <= 0) {
          this.callback();
          this.currTime = this.time;
      }
  }
}

export { Timer };