class Controls {
  constructor(harmonograph) {
    this.controls = document.getElementById('controls');
    this.pivots = [document.getElementById('pivot1'), document.getElementById('pivot2')];
    this.drawingCenter = document.getElementById('drawing_center');
    this.minY = 20;
    this.maxY = 580;
    this.x;
    this.y;
    this.startTime;

    this.updateHarmonograph = harmonograph.updatePositioning;
    const { pivot1, pivot2, center } = this.centerPoints;
    harmonograph.setPendulums(pivot1, pivot2, center, document.querySelectorAll('.period'), document.querySelectorAll('.amplitude'), document.querySelector('#friction'), document.querySelector('#offset'));
    this.updateHarmonograph(this.centerPoints);

    this.centerMouseMoveHandler = this.centerMouseMoveHandler.bind(this);
    this.startTimer = this.startTimer.bind(this);

    this.mouseMoveHandlers = [0, 1].map(i => this.createMouseMoveHandler(i)).concat([this.centerMouseMoveHandler]);
    this.mouseDownHandlers = [0, 1, 2].map(i => this.createMouseDownHandler(i));
    this.pivots.forEach((p, i) => p.addEventListener('mousedown', this.mouseDownHandlers[i]));
    this.drawingCenter.addEventListener('mousedown', this.mouseDownHandlers[2]);
  }

  createMouseDownHandler(i) {
    return e => {
      this.x = e.x;
      this.y = e.y;
      document.addEventListener('mousemove', this.mouseMoveHandlers[i]);
      document.addEventListener('mouseup', (e) => document.removeEventListener('mousemove', this.mouseMoveHandlers[i]));
    }
  }

  createMouseMoveHandler(i) {
    return e => {
      const deltaY = e.y - this.y;
      const deltaX = e.x - this.x;

      this.pivots.forEach((p, j) => {
        const minX = j ? 400 : 20;
        const maxX = j ? 780 : 400;
        const currY = parseInt(p.getAttribute('cy'));
        const currX = parseInt(p.getAttribute('cx'));
        const nextY = currY + deltaY > this.maxY ? this.maxY : currY + deltaY < this.minY ? this.minY : currY + deltaY;

        p.setAttribute('cy', nextY);

        if (i && j || !i && !j) {
          p.setAttribute('cx', currX + deltaX > this.maxX ? this.maxX : currX + deltaX < this.minX ? this.minX : currX + deltaX);
        } else {
          p.setAttribute('cx', currX - deltaX > this.maxX ? this.maxX : currX - deltaX < this.minX ? this.minX : currX - deltaX);
        }
      });

      this.y = e.y;
      this.x = e.x;
      this.updateHarmonograph(this.centerPoints);
    };
  }

  centerMouseMoveHandler(e) {
    const deltaY = e.y - this.y;
    const currY = parseInt(this.drawingCenter.getAttribute('cy'));
    const nextY = currY + deltaY > this.maxY ? this.maxY : currY + deltaY < this.minY ? this.minY : currY + deltaY;
    this.drawingCenter.setAttribute('cy', nextY);
    this.y = e.y;
    this.updateHarmonograph(this.centerPoints);
  }

  startTimer() {
    this.startTime = Date.now();
  }

  get centerPoints() {
    return {
      pivot1: { x: parseInt(this.pivots[0].getAttribute('cx')), y: parseInt(this.pivots[0].getAttribute('cy')) },
      pivot2: { x: parseInt(this.pivots[1].getAttribute('cx')), y: parseInt(this.pivots[1].getAttribute('cy')) },
      center: { x: parseInt(this.drawingCenter.getAttribute('cx')), y: parseInt(this.drawingCenter.getAttribute('cy')) },
    }
  }

  get currentTime() {
    return Date.now() - this.startTime;
  }
}
