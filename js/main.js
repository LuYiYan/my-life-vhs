/**
 * 主逻辑 — 在这里自由添加你的动态效果
 */

// ===== 时间码 =====
function updateTimecode() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const f = pad(Math.floor(now.getMilliseconds() / 40)); // 模拟帧数
  const el = document.getElementById('timecode');
  if (el) el.textContent = `${h}:${m}:${s}:${f}`;
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

// ===== 打开文章弹窗 =====
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

// ===== 滚动进入视口动画 =====
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

// ===== 随机 VHS 噪点闪烁（可自行调整频率） =====
function vhsNoiseFlicker() {
  const overlay = document.querySelector('.vhs-overlay');
  if (!overlay) return;

  setInterval(() => {
    if (Math.random() > 0.92) {
      overlay.style.opacity = '0.85';
      setTimeout(() => { overlay.style.opacity = '1'; }, 50 + Math.random() * 80);
    }
  }, 200);
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  renderPosts();
  updateTimecode();
  setInterval(updateTimecode, 40);
  vhsNoiseFlicker();

  observeElements(document.querySelectorAll('.fade-in'));

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
