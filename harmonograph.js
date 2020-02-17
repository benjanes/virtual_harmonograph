class Harmonograph {
  constructor(arms) {
    this.armLeft = arms[0];
    this.armRight = arms[1];
    this.armLength;
    this.pendulumLeft;
    this.pendulumRight;
    this.x;
    this.y;

    this.updatePositioning = this.updatePositioning.bind(this);
  }

  reset() {
    [this.pendulumLeft, this.pendulumRight].forEach(p => p.resetAmplitude());
  }

  updatePositioning({ pivot1, pivot2, center }) {
    const angle = this.findAngle(pivot1, center);
    this.armLength = Math.sqrt(Math.pow(center.x - pivot1.x, 2) + Math.pow(center.y - pivot1.y, 2));
    this.pendulumLeft.updatePosition(pivot1.x, pivot1.y, angle);
    this.pendulumRight.updatePosition(pivot2.x, pivot2.y, angle);
  }

  setArms({ x: leftX, y: leftY }, { x: rightX, y: rightY }) {
    this.armLeft.setAttribute('x1', leftX);
    this.armLeft.setAttribute('y1', leftY);
    this.armLeft.setAttribute('x2', this.xy.x);
    this.armLeft.setAttribute('y2', this.xy.y);
    this.armRight.setAttribute('x1', rightX);
    this.armRight.setAttribute('y1', rightY);
    this.armRight.setAttribute('x2', this.xy.x);
    this.armRight.setAttribute('y2', this.xy.y);
  }

  findAngle(pivot1, center) {
    const x = Math.abs(pivot1.x - center.x);
    const y = Math.abs(pivot1.y - center.y);
    const arm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return Math.acos((Math.pow(y, 2) + Math.pow(arm, 2) - Math.pow(x, 2)) / (2 * y * arm));
  }

  findCenter(leftCoords, rightCoords) {
    const maxX = Math.max(rightCoords.x, leftCoords.x);
    const minX = Math.min(rightCoords.x, leftCoords.x);
    const maxY = Math.max(rightCoords.y, leftCoords.y);
    const minY = Math.min(rightCoords.y, leftCoords.y);
    const shortLength = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 2;
    const midPoint = { x: ((maxX - minX) / 2) + minX, y: ((maxY - minY) / 2) + minY };
    const longLength = Math.sqrt(Math.pow(this.armLength, 2) - Math.pow(shortLength, 2));

    // slope perpendicular to line from left pendulum to right pendulum
    let m = -1 * (midPoint.x - leftCoords.x) / (midPoint.y - leftCoords.y);

    if (m > 0) {
      this.x = (longLength * Math.cos(Math.atan(m))) + midPoint.x;
      this.y = (longLength * Math.sin(Math.atan(m))) + midPoint.y;
    } else {
      this.x = midPoint.x - (longLength * Math.cos(Math.atan(m)));
      this.y = midPoint.y - (longLength * Math.sin(Math.atan(m)));
    }
  }

  setPendulums(pivot1, pivot2, center, periodInputs, amplitudeInputs, frictionInput, offsetInput) {
    const angle = this.findAngle(pivot1, center);
    this.pendulumLeft = new Pendulum(pivot1.x, pivot1.y, angle, periodInputs[0], amplitudeInputs[0], frictionInput, offsetInput, 0, document.getElementById('pendulum1'));
    this.pendulumRight = new Pendulum(pivot2.x, pivot2.y, angle, periodInputs[1], amplitudeInputs[1], frictionInput, offsetInput, 1, document.getElementById('pendulum2'));
  }

  advance(time) {
    [this.pendulumLeft, this.pendulumRight].forEach(p => p.swing(time));
    this.findCenter(this.pendulumLeft.coords, this.pendulumRight.coords);
    this.setArms(this.pendulumLeft.coords, this.pendulumRight.coords);
  }

  get xy() {
    return { x: this.x, y: this.y };
  }
}
