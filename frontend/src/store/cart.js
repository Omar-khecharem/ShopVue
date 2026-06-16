import { reactive, computed } from 'vue';

const cart = reactive({
  items: [],
  get totalItems() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },
  get totalPrice() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
});

export function addToCart(product, quantity = 1) {
  const existing = cart.items.find((i) => i._id === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ ...product, quantity });
  }
}

export function removeFromCart(productId) {
  cart.items = cart.items.filter((i) => i._id !== productId);
}

export function updateQuantity(productId, quantity) {
  const item = cart.items.find((i) => i._id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
    }
  }
}

export function clearCart() {
  cart.items = [];
}

export default cart;
