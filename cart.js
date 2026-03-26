let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.map(item => ({ ...item, qty: item.qty || 1 }));

function fmt(n) {
  return "₹ " + parseFloat(n).toFixed(2);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
function renderCart() {
  const list = document.getElementById("cart-items-list");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h3>Your cart is empty!</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/work.html" class="shop-btn">
          <i class="fa-solid fa-store"></i> Go Shopping
        </a>
      </div>
    `;
    document.getElementById("checkout-btn").disabled = true;
    updateSummary();
    updateCount();
    return;
  }

  document.getElementById("checkout-btn").disabled = false;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.dataset.index = index;

    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="item-details">
        <div class="item-category">${item.category}</div>
        <div class="item-title" title="${item.title}">${item.title}</div>
        <div class="item-price">${fmt(item.price * item.qty)}</div>
      </div>
      <div class="qty-wrap">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, +1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})" title="Remove item">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    list.appendChild(div);
  });

  updateSummary();
  updateCount();
}

function changeQty(index, delta) {
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    removeItem(index);
    return;
  }

  saveCart();
  renderCart();
}
function removeItem(index) {
  const card = document.querySelector(`.cart-item[data-index="${index}"]`);
  const name = cart[index].title.split(" ").slice(0, 3).join(" ");

  if (card) {
    card.classList.add("removing");
    card.addEventListener("animationend", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
      showToast(`"${name}..." removed from cart`);
    }, { once: true });
  }
}
function clearCart() {
  if (cart.length === 0) return;
  if (!confirm("Remove all items from your cart?")) return;
  cart = [];
  saveCart();
  renderCart();
  showToast("Cart cleared!");
}
function updateSummary() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById("sum-count").textContent    = totalQty;
  document.getElementById("sum-subtotal").textContent = fmt(subtotal);
  document.getElementById("sum-total").textContent    = fmt(subtotal);
}

function updateCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("item-count").textContent = total;
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function handleCheckout() {
  showToast("Order placed successfully!");
  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
  }, 1500);
}
renderCart();