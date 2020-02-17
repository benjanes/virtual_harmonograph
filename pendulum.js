class Pendulum {
  constructor(x, y, angle, periodInput, amplitudeInput, frictionInput, offsetInput, side, ref) {
    this.x;
    this.y;
    this.angle = angle;
    this.side = side;
    this.ref = ref;
    this.centerX = parseInt(x);
    this.centerY = parseInt(y);
    this.period = parseFloat(periodInput.value);
    this.friction = parseFloat(frictionInput.value);
    this.amplitude = parseFloat(amplitudeInput.value);
    this.offset = parseFloat(offsetInput.value);
    this.currentAmplitude = this.amplitude;

    this.updatePeriod = this.updatePeriod.bind(this);
    this.updateAmplitude = this.updateAmplitude.bind(this);
    this.updateFriction = this.updateFriction.bind(this);
    this.updateOffset = this.updateOffset.bind(this);
    this.resetAmplitude = this.resetAmplitude(amplitudeInput);

    periodInput.addEventListener('change', this.updatePeriod);
    amplitudeInput.addEventListener('change', this.updateAmplitude);
    frictionInput.addEventListener('change', this.updateFriction);
    offsetInput.addEventListener('change', this.updateOffset);
  }

  updatePeriod(e) {
    this.period = parseFloat(e.target.value);
  }

  updateAmplitude(e) {
    const newAmplitude = parseFloat(e.target.value);
    this.currentAmplitude = (this.currentAmplitude / this.amplitude) * newAmplitude;
    this.amplitude = newAmplitude;
  }

  resetAmplitude(ref) {
    return () => {
      this.currentAmplitude = parseFloat(ref.value);
    }
  }

  updateFriction(e) {
    this.friction = parseFloat(e.target.value);
  }

  updateOffset(e) {
    this.offset = parseFloat(e.target.value);
  }

  getCurrentCoords(time) {
    const adjustedTime = time / 600;
    const adjustedPeriod = this.side ? this.period + (this.period * this.offset) : this.period;
    this.currentAmplitude = ((1 - this.friction) * this.currentAmplitude);

    // the sine fn will just give a y value
    const hypotenuse = this.currentAmplitude * Math.sin(adjustedTime * adjustedPeriod);
    const deltaX = (Math.abs(hypotenuse) / Math.sin(90)) * Math.sin(this.angle);
    const deltaY = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(deltaX, 2));

    if (this.side && hypotenuse > 0) {
      return { x: this.centerX + deltaX, y: this.centerY - deltaY };
    } else if (this.side && hypotenuse <= 0) {
      return { x: this.centerX - deltaX, y: this.centerY + deltaY };
    } else if (!this.side && hypotenuse > 0) {
      return { x: this.centerX + deltaX, y: this.centerY + deltaY };
    } else {
      return { x: this.centerX - deltaX, y: this.centerY - deltaY };
    }
  }

  updatePosition(x, y, angle) {
    this.centerX = x;
    this.centerY = y;
    this.angle = angle;
  }

  swing(time) {
    const { x, y } = this.getCurrentCoords(time);
    this.x = x;
    this.y = y;
    this.ref.setAttribute('cx', x);
    this.ref.setAttribute('cy', y);
  }

  get coords() {
    return { x: this.x, y: this.y };
  }
}
