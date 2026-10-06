const STORAGE_KEY = 'wenli-food-reviews-v1';
const form = document.querySelector('#review-form');
const input = document.querySelector('#review-input');
const canteenInput = document.querySelector('#review-canteen');
const dishInput = document.querySelector('#review-dish');
const filter = document.querySelector('#review-filter');
const list = document.querySelector('#review-list');
const emptyState = document.querySelector('#empty-state');
const count = document.querySelector('#review-count');
const charCount = document.querySelector('#char-count');

function loadReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.text === 'string') : [];
  } catch {
    return [];
  }
}

let reviews = loadReviews();

function renderReviews() {
  list.replaceChildren();
  const visibleReviews = filter.value === 'all'
    ? reviews
    : reviews.filter(review => review.canteen === filter.value);
  emptyState.hidden = visibleReviews.length > 0;
  emptyState.textContent = reviews.length === 0
    ? '第一条食堂推荐，等你来写 ✨'
    : `还没有「${filter.value}」的评价，来分享第一条吧 ✨`;
  count.textContent = filter.value === 'all' ? `${reviews.length} 条` : `${visibleReviews.length} / ${reviews.length} 条`;
  for (const review of visibleReviews) {
    const article = document.createElement('article');
    article.className = 'review-item';
    const heading = document.createElement('div');
    heading.className = 'review-item-heading';
    const place = document.createElement('strong');
    place.textContent = review.canteen || '未分类';
    heading.append(place);
    if (review.dish) {
      const dish = document.createElement('span');
      dish.textContent = review.dish;
      heading.append(dish);
    }
    const text = document.createElement('p');
    text.textContent = review.text;
    const time = document.createElement('time');
    time.textContent = review.date || '刚刚';
    article.append(heading, text, time);
    list.append(article);
  }
}

input.addEventListener('input', () => {
  charCount.textContent = `${input.value.length} / 240`;
});

filter.addEventListener('change', renderReviews);

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  reviews.unshift({
    text,
    canteen: canteenInput.value,
    dish: dishInput.value.trim(),
    date: new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(new Date())
  });
  reviews = reviews.slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // The current session still shows the review if browser storage is unavailable.
  }
  form.reset();
  charCount.textContent = '0 / 240';
  renderReviews();
});

renderReviews();

