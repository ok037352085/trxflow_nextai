const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// ❄️ 調整雪量
const SNOW_COUNT = 25;

const snowflakes = Array.from({ length: SNOW_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.5,   // 小顆
  speed: Math.random() * 0.6 + 0.3,
  angle: Math.random() * Math.PI * 2,
  sway: Math.random() * 0.6 + 0.2 // 左右擺動幅度
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';

  snowflakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();

    // 向下
    f.y += f.speed;

    // 左右自然飄
    f.x += Math.sin(f.angle) * f.sway;
    f.angle += 0.01;

    // 重置
    if (f.y > canvas.height) {
      f.y = -5;
      f.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(draw);
}

draw();