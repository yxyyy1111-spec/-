const form = document.querySelector('#review-form');
const input = document.querySelector('#review-input');
const canteenInput = document.querySelector('#review-canteen');
const dishInput = document.querySelector('#review-dish');
const filter = document.querySelector('#review-filter');
const list = document.querySelector('#review-list');
const emptyState = document.querySelector('#empty-state');
const count = document.querySelector('#review-count');
const charCount = document.querySelector('#char-count');
const status = document.querySelector('#review-status');
const LOCAL_REVIEWS_KEY = 'wenli-food-reviews-v1';
let sessionReviews = [];

function getLocalReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_REVIEWS_KEY) || '[]');
    return Array.isArray(saved) && saved.length ? saved : sessionReviews;
  } catch {
    return sessionReviews;
  }
}

function saveLocalReview(review) {
  const reviews = getLocalReviews();
  const updated = [{ ...review, id: `local-${Date.now()}`, created_at: new Date().toISOString() }, ...reviews].slice(0, 100);
  sessionReviews = updated;
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(updated));
  } catch {
    // Some browsers restrict storage for file:// pages; keep reviews for this tab session.
  }
}

async function renderReviews() {
  list.replaceChildren();
  emptyState.hidden = false;
  emptyState.textContent = '正在加载评价…';

  const params = new URLSearchParams();
  if (filter.value !== 'all') params.set('canteen', filter.value);

  try {
    let reviews;
    if (location.protocol === 'file:') throw new Error('Local file preview');
    const response = await fetch(`/api/reviews?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Review request failed');
    ({ reviews } = await response.json());
    renderList(reviews);
    return;
  } catch {
    const reviews = getLocalReviews().filter(review => filter.value === 'all' || review.canteen === filter.value);
    renderList(reviews);
    status.textContent = '当前为本地预览：评价只保存在这台设备的浏览器中。';
  }
}

function renderList(reviews) {
    count.textContent = `${reviews.length} 条`;
    emptyState.hidden = reviews.length > 0;
    emptyState.textContent = '还没有评价，来分享第一条吧 ✨';

    for (const review of reviews) {
      const article = document.createElement('article');
      article.className = 'review-item';

      const heading = document.createElement('div');
      heading.className = 'review-item-heading';
      const place = document.createElement('strong');
      place.textContent = review.canteen;
      heading.append(place);
      if (review.dish) {
        const dish = document.createElement('span');
        dish.textContent = review.dish;
        heading.append(dish);
      }

      const text = document.createElement('p');
      text.textContent = review.body;
      const time = document.createElement('time');
      time.dateTime = review.created_at;
      time.textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' })
        .format(new Date(review.created_at));

      article.append(heading, text, time);
      list.append(article);
    }
}

input.addEventListener('input', () => {
  charCount.textContent = `${input.value.length} / 240`;
});

filter.addEventListener('change', renderReviews);

form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.textContent = '正在提交…';

  try {
    if (location.protocol === 'file:') throw new Error('Local file preview');
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        canteen: canteenInput.value,
        dish: dishInput.value.trim(),
        body: input.value.trim()
      })
    });
    if (!response.ok) throw new Error('Review submission failed');

    form.reset();
    charCount.textContent = '0 / 240';
    status.textContent = '已提交，审核通过后会显示给所有人。';
    await renderReviews();
  } catch {
    try {
      saveLocalReview({
        canteen: canteenInput.value,
        dish: dishInput.value.trim(),
        body: input.value.trim()
      });
      form.reset();
      charCount.textContent = '0 / 240';
      status.textContent = '已保存在本机浏览器，只有这台设备能看到。';
      await renderReviews();
    } catch {
      status.textContent = '保存失败，请检查浏览器存储空间或设置。';
    }
  } finally {
    button.disabled = false;
  }
});

renderReviews();
