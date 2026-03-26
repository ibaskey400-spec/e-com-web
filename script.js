let allProducts = []; 
async function getProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    allProducts = data; // Save to our global array
    displayProducts(allProducts); // Send data to the UI function
    loadCategories(allProducts); // Fill the category dropdown
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getProducts();
function displayProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = ""; // Clear old content

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card"); // Style this in your CSS for the grid

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-img">
      <div class="product-info">
        <span class="category-tag">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="price">₹ ${product.price}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    `;
    const btn = card.querySelector(".add-to-cart-btn");
    btn.onclick = () => addToCart(product);

    container.appendChild(card);
  });
}
let cart = JSON.parse(localStorage.getItem("cart")) || []; 
updateCartCount();
function addToCart(product) { 
  const isExisting = cart.find(item => item.id === product.id);

  if (!isExisting) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart)); 
    updateCartCount();
    
    alert(`${product.title} added to cart!`);
  } else {
    alert("Item is already in your cart.");
  }
}
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.innerText = cart.length; // Shows total items 
  }
}
const addToCartBtn = card.querySelector(".add-btn");
addToCartBtn.onclick = () => {
  addToCart(product);
};
function displayCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = ""; // Clear previous list

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" width="50">
      <span>${item.title} - ₹${item.price}</span>
      <button class="remove-btn">Remove</button>
    `;

    // Attach removal logic to the button
    const removeBtn = cartItem.querySelector(".remove-btn");
    removeBtn.onclick = () => removeFromCart(index);

    cartContainer.appendChild(cartItem);
  });
}
function removeFromCart(index) {
  // Remove the item from the array using its index
  cart.splice(index, 1);

  // Update localStorage so the change is permanent 
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the count and the display
  updateCartCount();
  displayCart(); 
}
function goToCart() {
  document.getElementById("products").style.display = "none";
  document.getElementById("controls").style.display = "none";
  document.getElementById("cart-section").style.display = "block";
  displayCart();
}

function closeCart() {
  document.getElementById("products").style.display = "grid";
  document.getElementById("controls").style.display = "flex";
  document.getElementById("cart-section").style.display = "none";
}
document.getElementById("sort").addEventListener("change", (e) => {
  const sortType = e.target.value;
  
  // 1. Create a shallow copy of the array using the spread operator [...]
  // This is important because .sort() modifies the array in place.
  let sortedProducts = [...allProducts]; 

  // 2. Sorting Logic [cite: 25]
  if (sortType === "low") {
    // Low to High: (Smallest Price - Largest Price)
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === "high") {
    // High to Low: (Largest Price - Smallest Price)
    sortedProducts.sort((a, b) => b.price - a.price);
  } else {
    // If "Sort by Price" (default) is selected, show original order
    sortedProducts = allProducts;
  }

  // 3. Re-render the UI [cite: 8, 10]
  displayProducts(sortedProducts);
});