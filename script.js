// CART STORAGE KEY
const CART_KEY = 'almesBakeryCart';

// Get cart from localStorage or empty array
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Save cart to localStorage and update badge
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartIndicator();
}

// Add item to cart
function addToCart(name, price, quantity) {
  if (quantity < 1) {
    alert("Quantity must be at least 1.");
    return;
  }

  let cart = getCart();
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  saveCart(cart);
  alert(`${quantity} x ${name} added to cart!`);
}

// Render cart items on cart.html
function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  const orderBtn = document.getElementById('orderNowBtn');

  if (!cartItemsDiv) return; // Only run if on cart.html

  const cart = getCart();
  cartItemsDiv.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalSpan.textContent = '0';
    if (orderBtn) orderBtn.disabled = true;
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'd-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white shadow-sm flex-wrap';

    itemDiv.innerHTML = `
      <div>
        <strong>${item.name}</strong><br/>
        R${item.price.toFixed(2)} each
      </div>
      <div>
        Qty: <input type="number" value="${item.quantity}" min="1" style="width:60px; display:inline-block;" />
        <button class="btn btn-danger btn-sm ms-2">Remove</button>
      </div>
      <div><strong>R${itemTotal.toFixed(2)}</strong></div>
    `;

    const qtyInput = itemDiv.querySelector('input[type=number]');
    qtyInput.addEventListener('change', (e) => {
      const newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) {
        e.target.value = item.quantity;
        alert('Quantity must be at least 1');
      } else {
        item.quantity = newQty;
        saveCart(cart);
        renderCart();
      }
    });

    const removeBtn = itemDiv.querySelector('button');
    removeBtn.addEventListener('click', () => {
      const updatedCart = cart.filter(i => i.name !== item.name);
      saveCart(updatedCart);
      renderCart();
    });

    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotalSpan.textContent = total.toFixed(2);

  if (orderBtn) {
    orderBtn.disabled = false;
    orderBtn.onclick = () => {
      const lines = cart.map(item =>
        `${item.quantity} x ${item.name} (R${item.price.toFixed(2)}) = R${(item.price * item.quantity).toFixed(2)}`
      );
      lines.push(`Total: R${total.toFixed(2)}`);
      const message = encodeURIComponent("Hello Almé's Bakery! I'd like to order:\n" + lines.join('\n'));
      window.open(`https://wa.me/27681651930?text=${message}`, '_blank');
    };
  }
}

// Update cart indicator badge in navbar
function updateCartIndicator() {
  const badge = document.getElementById('cartCountBadge');
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartIndicator();
  renderCart();
});
