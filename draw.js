(function() {
  const svg = document.querySelector('svg');
  const arms = Array.from(document.getElementsByTagName('line'));
  const canvas = document.getElementsByTagName('canvas')[0];
  const hideBtn = document.getElementById('hide_btn');
  const stopBtn = document.getElementById('stop_btn');
  canvas.width = 3200;
  canvas.height = 3200;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = '1';
  // ctx.strokeStyle = 'rgba(162,163,218,1)';
  // ctx.fillStyle = 'rgba(162,163,218,1)';

  const harmonograph = new Harmonograph(arms, canvas);
  const controls = new Controls(harmonograph);
  let isHidden = false;
  let isStopped = false;
  let drawRef;

  init();

  function addListeners() {
    document.getElementById('reset_btn').addEventListener('click', e => {
      e.preventDefault();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    hideBtn.addEventListener('click', toggleHideStatus);
    stopBtn.addEventListener('click', toggleStoppedStatus);
  }

  function toggleHideStatus(e) {
    e.preventDefault();
    if (isHidden) {
      svg.style.display = 'block';
      hideBtn.innerText = 'Hide Controls';
    } else {
      svg.style.display = 'none';
      hideBtn.innerText = 'Show Controls';
    }
    isHidden = !isHidden;
  }

  function toggleStoppedStatus(e) {
    e.preventDefault();
    if (isStopped) {
      startGraph();
      stopBtn.innerText = 'Stop Drawing';
    } else {
      cancelAnimationFrame(drawRef);
      stopBtn.innerText = 'Start New Drawing';
    }
    isStopped = !isStopped;
  }

  function startGraph() {
    controls.startTimer();
    harmonograph.reset();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }

  function draw() {
    harmonograph.advance(controls.currentTime + 1);
    drawPoint(harmonograph.xy);
    drawRef = requestAnimationFrame(draw);
  }

  function drawPoint(pt) {
    // ctx.strokeStyle = 'rgba(162,163,218,0.6)';
    // ctx.fillStyle = 'rgba(162,163,218,0.6)';
    // const colorCorrection = Math.pow((pt.x + pt.y) / 1200, 2);

    const correctionX = Math.abs(400 - pt.x) / 300;
    const correctionY = Math.abs(400 - pt.y) / 300;
    const correction = (correctionX + correctionY) / 2;


    // const red = parseInt((pt.x / 800) * 255);
    const color = 255 - parseInt(correction * 255);
    ctx.strokeStyle = `rgba(${color},0,0,0.8)`;
    ctx.fillStyle = `rgba(${color},0,255,0.8)`;


    ctx.beginPath();
    ctx.arc(pt.x * 4, pt.y * 4, 40 * correction, 0, Math.PI * 2, false);
    ctx.fill();
    // ctx.rect(pt.x * 4, pt.y * 4, 40 * correction, 40 * correction);
    ctx.stroke();
    ctx.closePath();
  }

  function init() {
    addListeners();
    startGraph();
  }
})();
