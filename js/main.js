// UTF-8

// 站内文章数据（不再用 fetch，本地 file:// 也能正常显示）
const ARTICLES = [
  {
    id: 1,
    title: "占いでわかる今日の運勢",
    subtitle: "一日のスタートに、運勢をチェックして心を整える。",
    author: "管理人",
    date: "2025-11-23",
    image: "images/article1.jpg",
    summary: "今日の運勢の流れと、気をつけたいポイントをコンパクトにまとめました。",
    content: `
      <p>今日は全体的に「整える」ことがテーマの日。部屋やデスクを片づけることで、
      運気の流れもスムーズになりやすいタイミングです。</p>
      <p>恋愛面では、ささいな一言が相手の心に強く残る日。感謝の言葉をいつもより
      少し多めに伝えてみましょう。</p>
    `
  },
  {
    id: 2,
    title: "管理人が選ぶ・本当に当たった占い師",
    subtitle: "実際に受けて「当たった」と感じた先生だけを紹介。",
    author: "管理人",
    date: "2025-11-15",
    image: "images/article2.jpg",
    summary: "管理人がこれまで受けてきた鑑定の中から、本当に心に残った先生をピックアップ。",
    content: `
      <p>占いに通い始めてから、気づけば数十人の先生に鑑定してもらいました。
      その中でも特に印象に残っている先生を3名ご紹介します。</p>
      <p>「当たる・当たらない」だけではなく、話しやすさやフォローの丁寧さも
      基準に入れています。</p>
    `
  },
  {
    id: 3,
    title: "ITエンジニアが占いにハマった理由",
    subtitle: "ロジック脳だからこそ感じた「占い」の面白さ。",
    author: "管理人",
    date: "2025-10-30",
    image: "images/article3.jpg",
    summary: "数字やコードの世界で生きてきた管理人が、なぜ占いに魅力を感じたのかを書きました。",
    content: `
      <p>普段はJavaやSQLに向き合っている僕が、なぜ占いにハマったのか。
      きっかけは、仕事と私生活の両方がうまく回らなくなった時期でした。</p>
      <p>「答え」はもらえなくても、「考え方のヒント」をくれるのが占いだと
      感じています。その体験談を、等身大で書いてみました。</p>
    `
  }
];

// 占位图（1x1 GIF）用于延迟设置真实 src
const LAZY_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// 返回按钮
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

// 首页：生成最新記事卡片（恢复为统一风格：图片在上，文字在下）
function createArticleCard(article) {
  const col = document.createElement('div');
  col.className = 'col-md-4';
  col.innerHTML = `
    <article class="card card-astro h-100 shadow-lg">
      <img src="${LAZY_PLACEHOLDER}"
           data-src="${article.image}"
           class="card-img-top astro-thumb lazy"
           alt="${article.title}"
           loading="lazy">
      <div class="card-body">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text text-astro-muted">
          ${article.summary}
        </p>
        <p class="small text-astro-muted mb-2">by ${article.author}</p>
        <a href="article.html?id=${article.id}" class="btn btn-astro-primary btn-sm">続きを読む</a>
      </div>
    </article>
  `;
  return col;
}

// 观察并加载带有 data-src 的图片（使用 IntersectionObserver，兼容回退）
function observeLazyImages() {
  const lazyImages = document.querySelectorAll('img.lazy[data-src]');
  if (!lazyImages || lazyImages.length === 0) return;

  if ('IntersectionObserver' in window) {
    if (!window._lazyObserver) {
      window._lazyObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.remove('lazy');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });
    }

    lazyImages.forEach(img => {
      window._lazyObserver.observe(img);
    });
  } else {
    // 不支持 IntersectionObserver 时直接加载
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.remove('lazy');
    });
  }
}

// 加载共享导航栏组件（components/navbar.html）并插入到所有占位元素
async function loadNavbar() {
  const placeholders = document.querySelectorAll('.site-navbar');
  if (!placeholders || placeholders.length === 0) return;
  try {
    const resp = await fetch('components/navbar.html');
    if (!resp.ok) return;
    const html = await resp.text();
    placeholders.forEach(el => {
      el.innerHTML = html;
    });
  } catch (err) {
    console.error('loadNavbar error', err);
    // 回退：在无法 fetch（例如 file:// 或服务器未启动）时，使用内置的 navbar HTML
    const fallback = `
      <nav class="navbar navbar-expand-lg navbar-dark astro-nav shadow-sm">
        <div class="container">
          <a class="navbar-brand fw-bold" href="index.html">
            <img src="components/logo.svg" alt="群馬占卜 ロゴ" class="site-logo me-2">
            <span class="brand-text">群馬占卜</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item"><a class="nav-link" href="index.html">ホーム</a></li>
              <li class="nav-item"><a class="nav-link" href="articles.html">記事一覧</a></li>
              <li class="nav-item"><a class="nav-link" href="company.html">占卜师情报</a></li>
              <li class="nav-item"><a class="nav-link" href="contact.html">料金・お問い合わせ</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;
    placeholders.forEach(el => el.innerHTML = fallback);
  }
}

// 处理导航锚点的平滑滚动（考虑固定导航高度），并在目标处短暂高亮
function setupAnchorScrolling() {
  function scrollToId(id, smooth = true) {
    const target = document.getElementById(id);
    if (!target) return;
    const nav = document.querySelector('.astro-nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8; // 少量间距
    window.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
    // 高亮目标，短暂展示
    target.classList.add('scroll-highlight');
    setTimeout(() => target.classList.remove('scroll-highlight'), 1400);
  }

  // 委托点击事件，拦截以 # 开头的 nav 链接
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a.nav-link[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return; // 若目标不存在，保留默认行为
    e.preventDefault();
    scrollToId(id, true);
    // 更新地址栏的 hash（不会触发默认跳转行为）
    history.replaceState(null, '', '#' + id);
  });

  // 页面载入时若有 hash，则滚动到带偏移的位置（非平滑以避免延迟）
  if (location.hash) {
    const id = location.hash.replace('#', '');
    // 延迟执行，确保 DOM & navbar 已加载完毕
    setTimeout(() => scrollToId(id, false), 50);
  }
}

function initIndex() {
  const latestContainer = document.getElementById('latest-articles');
  if (!latestContainer) return;
  ARTICLES.slice(0, 3).forEach(a => {
    latestContainer.appendChild(createArticleCard(a));
  });
  // 在生成后开始观察懒加载图片
  observeLazyImages();
}

// 文章列表页
function initArticleList() {
  const list = document.getElementById('article-list');
  if (!list) return;
  let html = '<ul class="mb-0">';
  ARTICLES.forEach(a => {
    html += `
      <li class="mb-2">
        <a href="article.html?id=${a.id}" class="link-light">${a.title}</a>
        <span class="small text-astro-muted">（by ${a.author}）</span>
      </li>`;
  });
  html += '</ul>';
  list.innerHTML = html;
}

// 文章详情页，不同布局：1=上图下文，2=左图右文，3=右图左文
function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id') || '0');
}

function initArticleDetail() {
  const container = document.getElementById('article-detail');
  if (!container) return;
  const id = getQueryId();
  const article = ARTICLES.find(a => a.id === id) || ARTICLES[0];

  let html = "";

  if (article.id === 1) {
    // 图片在上，文章在下
    html = `
      <div class="article-layout-top">
        <h1 class="mb-2">${article.title}</h1>
        <p class="text-astro-muted small mb-3">
          by ${article.author} ／ ${article.date}
        </p>
        <img src="${LAZY_PLACEHOLDER}"
          data-src="${article.image}"
          class="img-fluid rounded mb-4 lazy"
          alt="${article.title}"
          loading="lazy">
        <h5 class="mb-3">${article.subtitle}</h5>
        <div class="article-body">${article.content}</div>
      </div>
    `;
  } else if (article.id === 2) {
    // 图片在左上四分之一区域，其余为文章
    html = `
      <div class="article-layout-left">
        <div class="article-image-wrap">
          <img src="${LAZY_PLACEHOLDER}"
              data-src="${article.image}"
              class="lazy"
              alt="${article.title}"
              loading="lazy">
        </div>
        <div class="article-text-wrap">
          <h1 class="mb-2">${article.title}</h1>
          <p class="text-astro-muted small mb-3">
            by ${article.author} ／ ${article.date}
          </p>
          <h5 class="mb-3">${article.subtitle}</h5>
          <div class="article-body">${article.content}</div>
        </div>
      </div>
    `;
  } else if (article.id === 3) {
    // 图片在右侧，文字在左侧
    html = `
      <div class="article-layout-right">
        <div class="article-image-wrap">
          <img src="${LAZY_PLACEHOLDER}"
              data-src="${article.image}"
              class="lazy"
              alt="${article.title}"
              loading="lazy">
        </div>
        <div class="article-text-wrap">
          <h1 class="mb-2">${article.title}</h1>
          <p class="text-astro-muted small mb-3">
            by ${article.author} ／ ${article.date}
          </p>
          <h5 class="mb-3">${article.subtitle}</h5>
          <div class="article-body">${article.content}</div>
        </div>
      </div>
    `;
  } else {
    // 兜底：上图下文
    html = `
      <div class="article-layout-top">
        <h1 class="mb-2">${article.title}</h1>
        <p class="text-astro-muted small mb-3">
          by ${article.author} ／ ${article.date}
        </p>
        <img src="${article.image}"
            class="img-fluid rounded mb-4"
            alt="${article.title}"
            loading="lazy">
        <h5 class="mb-3">${article.subtitle}</h5>
        <div class="article-body">${article.content}</div>
      </div>
    `;
  }

  container.innerHTML = html;
  // 文章详情生成后，观察并加载懒图片
  observeLazyImages();
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();
  // 设置锚点平滑滚动/高亮（需要在 navbar 存在后设置）
  setupAnchorScrolling();
  initIndex();
  initArticleList();
  initArticleDetail();
  // 确保固定的头部/底部不会遮挡页面内容：根据实际高度设置 body 的 padding
  function fixNavbarSpacing() {
    // 导航栏（顶部）
    const nav = document.querySelector('.astro-nav');
    if (nav) {
      const style = window.getComputedStyle(nav);
      const h = nav.offsetHeight;
      // 只有在导航被设置为 fixed 时，才需要为 body 添加等高内边距
      if (style.position === 'fixed') {
        document.body.style.paddingTop = h + 'px';
      } else {
        document.body.style.paddingTop = '';
      }
    }

    // 页脚（底部）——当页面需要固定 footer 时，在 body 上添加 `footer-fixed` 类
    const footer = document.querySelector('.astro-footer');
    if (footer) {
      const footerStyle = window.getComputedStyle(footer);
      const shouldFixFooter = document.body.classList.contains('footer-fixed') || footerStyle.position === 'fixed';
      if (shouldFixFooter) {
        const fh = footer.offsetHeight;
        document.body.style.paddingBottom = fh + 'px';
        // 更新 CSS 变量作为备用显示值
        document.documentElement.style.setProperty('--astro-footer-height', fh + 'px');
      } else {
        document.body.style.paddingBottom = '';
        document.documentElement.style.removeProperty('--astro-footer-height');
      }
    }
  }

  // 初次设置
  fixNavbarSpacing();
  // 在窗口调整大小时重新设置（防抖）
  let _resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimeout);
    _resizeTimeout = setTimeout(fixNavbarSpacing, 150);
  });
});
