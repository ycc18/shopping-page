const products = [
  {
    id: "mug",
    name: "手作陶瓷马克杯",
    category: "家居",
    price: 89,
    tag: "热卖",
    description: "厚釉手感，适合咖啡、热茶和清晨的第一口水。",
    image: "images/11.jpg"
  },
  {
    id: "keyboard",
    name: "低噪机械键盘",
    category: "数码",
    price: 329,
    tag: "新品",
    description: "紧凑布局，柔和背光，打字声音更安静。",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bag",
    name: "通勤轻量双肩包",
    category: "穿搭",
    price: 259,
    tag: "耐用",
    description: "多隔层设计，可放 14 寸电脑和随身小物。",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lamp",
    name: "可调光阅读台灯",
    category: "家居",
    price: 179,
    tag: "护眼",
    description: "三档色温，夜读、办公和床头都刚刚好。",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "watch",
    name: "智能运动手表",
    category: "数码",
    price: 499,
    tag: "折扣",
    description: "运动记录、睡眠监测和日程提醒一屏掌握。",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "beans",
    name: "浅烘咖啡豆",
    category: "咖啡",
    price: 118,
    tag: "新鲜烘焙",
    description: "莓果酸甜调性，适合手冲和冰咖啡。",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sneaker",
    name: "城市漫步休闲鞋",
    category: "穿搭",
    price: 399,
    tag: "轻便",
    description: "柔软鞋垫与防滑外底，适合长时间步行。",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kettle",
    name: "细口温控手冲壶",
    category: "咖啡",
    price: 269,
    tag: "精准",
    description: "稳定水流与实时控温，让萃取更容易复现。",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  category: "全部",
  search: "",
  cart: new Map()
};

const productGrid = document.querySelector("[data-products]");
const categoryRow = document.querySelector("[data-categories]");
const searchInput = document.querySelector("[data-search]");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const subtotalEl = document.querySelector("[data-subtotal]");
const shippingEl = document.querySelector("[data-shipping]");
const totalEl = document.querySelector("[data-total]");

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0
});

function getFilteredProducts() {
  const keyword = state.search.trim().toLowerCase();
  return products.filter((product) => {
    const categoryMatch = state.category === "全部" || product.category === state.category;
    const searchMatch = !keyword || `${product.name}${product.category}${product.description}`.toLowerCase().includes(keyword);
    return categoryMatch && searchMatch;
  });
}

function renderCategories() {
  const categories = ["全部", ...new Set(products.map((product) => product.category))];
  categoryRow.innerHTML = categories.map((category) => `
    <button type="button" class="${category === state.category ? "is-active" : ""}" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = filtered.length ? filtered.map((product) => `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="tag">${product.tag}</span>
      </div>
      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-meta">${product.description}</p>
        <div class="product-footer">
          <span class="price">${money.format(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}">加入购物车</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-cart">没有找到匹配的商品</div>`;
}

function getCartEntries() {
  return Array.from(state.cart.entries()).map(([id, quantity]) => ({
    ...products.find((product) => product.id === id),
    quantity
  }));
}

function renderCart() {
  const entries = getCartEntries();
  const subtotal = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 199 ? 0 : 18;

  cartCount.textContent = entries.reduce((sum, item) => sum + item.quantity, 0);
  subtotalEl.textContent = money.format(subtotal);
  shippingEl.textContent = money.format(shipping);
  totalEl.textContent = money.format(subtotal + shipping);

  cartItems.innerHTML = entries.length ? entries.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${money.format(item.price)}</p>
        <div class="quantity-row">
          <div class="stepper" aria-label="${item.name} 数量">
            <button type="button" data-decrease="${item.id}" aria-label="减少数量">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-increase="${item.id}" aria-label="增加数量">+</button>
          </div>
          <button class="remove-button" type="button" data-remove="${item.id}">移除</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-cart">购物车还是空的<br>去挑几件喜欢的吧</div>`;
}

function addToCart(id) {
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderCart();
  openCart();
}

function updateQuantity(id, delta) {
  const nextQuantity = (state.cart.get(id) || 0) + delta;
  if (nextQuantity <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, nextQuantity);
  }
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

categoryRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");
  if (increase) updateQuantity(increase.dataset.increase, 1);
  if (decrease) updateQuantity(decrease.dataset.decrease, -1);
  if (remove) {
    state.cart.delete(remove.dataset.remove);
    renderCart();
  }
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderCategories();
renderProducts();
renderCart();
