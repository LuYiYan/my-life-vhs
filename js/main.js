/**
 * 主逻辑 — 芬兰夜空星空 + 流星
 */

// ===== 时间码 =====
function updateTimecode() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const el = document.getElementById('timecode');
  if (el) el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ===== 芬兰夜空 Canvas =====
function initFinnishSky() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let mouseX = 0.5, mouseY = 0.5;
  let targetMouseX = 0.5, targetMouseY = 0.5;

  const layers = [
    { count: 120, speed: 0.015, size: [0.4, 1.2], opacity: [0.3, 0.6] },
    { count: 80, speed: 0.03, size: [0.8, 1.8], opacity: [0.5, 0.85] },
    { count: 35, speed: 0.05, size: [1.2, 2.5], opacity: [0.7, 1] },
  ];

  let stars = [];
  let meteors = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = layers.flatMap((layer, li) =>
      Array.from({ length: layer.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.85,
        size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        opacity: layer.opacity[0] + Math.random() * (layer.opacity[1] - layer.opacity[0]),
        layer: li,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
      }))
    );
  }

  function spawnMeteor() {
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 6 + Math.random() * 8;
    meteors.push({
      x: Math.random() * w * 1.2,
      y: -20 - Math.random() * h * 0.3,
      len: 60 + Math.random() * 100,
      speed,
      angle,
      opacity: 0.7 + Math.random() * 0.3,
      width: 1 + Math.random() * 1.5,
    });
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(0.4, '#0f1f3d');
    grad.addColorStop(0.75, '#152a4a');
    grad.addColorStop(1, '#1a3055');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const horizon = ctx.createRadialGradient(w * 0.5, h * 1.1, 0, w * 0.5, h * 0.6, h * 0.7);
    horizon.addColorStop(0, 'rgba(30, 58, 95, 0.4)');
    horizon.addColorStop(1, 'transparent');
    ctx.fillStyle = horizon;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars(time) {
    stars.forEach(star => {
      const layer = layers[star.layer];
      const parallaxX = (mouseX - 0.5) * layer.speed * w * 40;
      const parallaxY = (mouseY - 0.5) * layer.speed * h * 20;
      const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkle);
      const alpha = star.opacity * twinkle;

      let sx = ((star.x + parallaxX) % w + w) % w;
      let sy = ((star.y + parallaxY) % h + h) % h;

      ctx.beginPath();
      ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 245, ${alpha})`;
      ctx.fill();

      if (star.size > 1.8 && twinkle > 0.85) {
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 200, 232, ${alpha * 0.15})`;
        ctx.fill();
      }
    });
  }

  function drawMeteors() {
    meteors = meteors.filter(m => {
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;

      if (m.y > h + 50 || m.x < -100) return false;

      const tailX = m.x - Math.cos(m.angle) * m.len;
      const tailY = m.y - Math.sin(m.angle) * m.len;

      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(200, 224, 255, 0)');
      grad.addColorStop(0.6, `rgba(200, 224, 255, ${m.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.width * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
      ctx.fill();

      return true;
    });
  }

  let lastMeteor = 0;
  function animate(time) {
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    drawBackground();
    drawStars(time);
    drawMeteors();

    if (time - lastMeteor > 2000 + Math.random() * 4000) {
      spawnMeteor();
      lastMeteor = time;
      if (Math.random() > 0.6) spawnMeteor();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX / w;
    targetMouseY = e.clientY / h;
  });

  resize();
  for (let i = 0; i < 3; i++) spawnMeteor();
  requestAnimationFrame(animate);
}

// ===== 渲染文章列表 =====
function renderPosts() {
  const grid = document.getElementById('posts-grid');
  if (!grid || typeof POSTS === 'undefined') return;

  grid.innerHTML = POSTS.map((post, i) => `
    <article class="post-card" data-id="${post.id}" style="animation-delay: ${i * 0.1}s">
      <time class="post-date">${post.date}</time>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-excerpt">${post.excerpt}</p>
      <div class="post-tags">
        ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', () => openPost(Number(card.dataset.id)));
  });

  observeElements(grid.querySelectorAll('.post-card'));
}

function openPost(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;

  document.getElementById('modal-date').textContent = post.date;
  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-tags').innerHTML = post.tags
    .map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('modal-body').innerHTML = post.content;

  const modal = document.getElementById('post-modal');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('post-modal');
  modal.hidden = true;
  document.body.style.overflow = '';
}

function observeElements(elements) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initFinnishSky();
  renderPosts();
  updateTimecode();
  setInterval(updateTimecode, 1000);

  observeElements(document.querySelectorAll('.fade-in'));

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
