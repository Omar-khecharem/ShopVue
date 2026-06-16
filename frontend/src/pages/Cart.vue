<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
    <div v-if="step < 3" class="max-w-2xl mx-auto mb-12 sm:mb-16">
      <div class="flex items-center justify-between">
        <div v-for="(s, i) in steps" :key="s.label" class="flex items-center gap-2 sm:gap-3" :class="{ 'flex-1': i < steps.length - 1 }">
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-500"
            :class="i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-charcoal-900 text-white shadow-lg shadow-charcoal-900/20' : 'bg-charcoal-100 text-charcoal-400'"
          >
            <svg v-if="i < step" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="hidden sm:block text-xs font-medium" :class="i === step ? 'text-charcoal-900' : 'text-charcoal-400'">{{ s.label }}</span>
          <div v-if="i < steps.length - 1" class="flex-1 h-px mx-2 sm:mx-4 transition-colors duration-500" :class="i < step ? 'bg-emerald-500' : 'bg-charcoal-200'" />
        </div>
      </div>
    </div>

    <!-- Step: Empty -->
    <div v-if="cart.items.length === 0 && step < 3" class="text-center py-24">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-charcoal-200 mb-4"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      <p class="text-charcoal-400 mb-6">Your cart is empty.</p>
      <router-link to="/" class="inline-flex bg-charcoal-900 text-white rounded-full px-8 py-3.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Continue Shopping</router-link>
    </div>

    <!-- Step 0: Cart Review + Checkout -->
    <div v-if="step === 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div class="lg:col-span-2 space-y-4" v-motion="{ initial: { opacity: 0, y: 20 }, visibleOnce: { opacity: 1, y: 0 } }">
        <div v-for="item in cart.items" :key="item._id" class="bg-white rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 shadow-sm shadow-charcoal-900/5">
          <img :src="item.images?.[0] || placeholderImg" :alt="item.name" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0" />
          <div class="flex-1 min-w-0">
            <router-link :to="`/products/${item._id}`" class="text-sm font-medium text-charcoal-900 truncate block hover:underline">{{ item.name }}</router-link>
            <p class="text-sm text-charcoal-500 mt-0.5">${{ item.price.toFixed(2) }} each</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="updateQuantity(item._id, item.quantity - 1)" class="w-8 h-8 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:bg-charcoal-100 transition-colors text-sm" :disabled="submitting">&minus;</button>
            <span class="w-6 text-center text-sm font-medium tabular-nums">{{ item.quantity }}</span>
            <button @click="updateQuantity(item._id, item.quantity + 1)" class="w-8 h-8 rounded-full border border-charcoal-200 flex items-center justify-center text-charcoal-600 hover:bg-charcoal-100 transition-colors text-sm" :disabled="submitting">+</button>
          </div>
          <p class="text-sm font-semibold text-charcoal-900 w-20 text-right tabular-nums">${{ (item.price * item.quantity).toFixed(2) }}</p>
          <button @click="removeFromCart(item._id)" class="text-charcoal-400 hover:text-red-500 transition-colors p-1" aria-label="Remove">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div class="lg:col-span-1" v-motion="{ initial: { opacity: 0, y: 30 }, visibleOnce: { opacity: 1, y: 0 }, delay: 100 }">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm shadow-charcoal-900/5 sticky top-24 lg:top-28">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-charcoal-400 mb-6">Order Summary</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-charcoal-600"><span>Items ({{ cart.totalItems }})</span><span class="tabular-nums">${{ cart.totalPrice.toFixed(2) }}</span></div>
            <div class="flex justify-between text-charcoal-600"><span>Shipping</span><span class="text-emerald-600 text-xs font-medium">Free</span></div>
            <div class="flex justify-between text-charcoal-600 text-xs pt-2 border-t border-charcoal-100"><span>Est. delivery</span><span class="tabular-nums">{{ deliveryDate }}</span></div>
          </div>
          <div class="mt-5 pt-5 border-t border-charcoal-200 flex justify-between items-baseline">
            <span class="text-sm font-semibold text-charcoal-900">Total</span>
            <span class="text-2xl font-semibold text-charcoal-900 tabular-nums">${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
          <button @click="goToStep1" class="mt-6 w-full bg-charcoal-900 text-white rounded-full py-4 text-sm font-semibold hover:bg-charcoal-700 transition-all active:scale-[0.98]">Continue to Shipping</button>

          <div class="mt-6 space-y-3">
            <div class="flex items-center gap-2 text-[11px] text-charcoal-400"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>Free shipping on all orders</div>
            <div class="flex items-center gap-2 text-[11px] text-charcoal-400"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>30-day hassle-free returns</div>
            <div class="flex items-center gap-2 text-[11px] text-charcoal-400"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>Secure SSL checkout</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Shipping Information -->
    <Transition name="step" mode="out-in">
      <div v-if="step === 1" key="shipping" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm shadow-charcoal-900/5">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">Shipping Information</h2>
          <form @submit.prevent="goToStep2" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">First Name</label><input v-model="form.firstName" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Last Name</label><input v-model="form.lastName" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            </div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Email</label><input v-model="form.email" type="email" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Phone</label><input v-model="form.phone" type="tel" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Address</label><input v-model="form.address" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">City</label><input v-model="form.city" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">State</label><input v-model="form.state" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">ZIP Code</label><input v-model="form.zip" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            </div>
            <div class="flex items-center justify-between pt-4">
              <button type="button" @click="step = 0" class="text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors">&larr; Back to cart</button>
              <button type="submit" class="bg-charcoal-900 text-white rounded-full px-10 py-3.5 text-sm font-semibold hover:bg-charcoal-700 transition-all active:scale-[0.98]">Continue to Payment</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Step 2: Review & Pay -->
    <Transition name="step" mode="out-in">
      <div v-if="step === 2" key="payment" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm shadow-charcoal-900/5">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">Review & Place Order</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">Shipping To</h3>
              <div class="bg-charcoal-50 rounded-xl p-4 text-sm text-charcoal-700 space-y-1">
                <p>{{ form.firstName }} {{ form.lastName }}</p>
                <p>{{ form.address }}</p>
                <p>{{ form.city }}{{ form.state ? ', ' + form.state : '' }} {{ form.zip }}</p>
                <p>{{ form.email }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">Items ({{ cart.totalItems }})</h3>
              <div class="space-y-3">
                <div v-for="item in cart.items" :key="item._id" class="flex items-center gap-3 text-sm">
                  <img :src="item.images?.[0] || placeholderImg" class="w-10 h-10 rounded-lg object-cover" />
                  <span class="flex-1 text-charcoal-700 truncate">{{ item.name }} × {{ item.quantity }}</span>
                  <span class="font-medium text-charcoal-900 tabular-nums">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">Payment</h3>
              <p class="text-sm text-charcoal-500 mb-3">This is a demo — no real payment will be processed.</p>
              <div class="bg-charcoal-50 rounded-xl p-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal-400"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span class="text-sm text-charcoal-600">Demo Card **** 4242</span>
              </div>
            </div>

            <div class="border-t border-charcoal-200 pt-5 space-y-2 text-sm">
              <div class="flex justify-between text-charcoal-600"><span>Subtotal</span><span class="tabular-nums">${{ cart.totalPrice.toFixed(2) }}</span></div>
              <div class="flex justify-between text-charcoal-600"><span>Shipping</span><span class="text-emerald-600">Free</span></div>
              <div class="flex justify-between text-base font-semibold text-charcoal-900 pt-2 border-t border-charcoal-200"><span>Total</span><span class="tabular-nums">${{ cart.totalPrice.toFixed(2) }}</span></div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-2 text-xs text-charcoal-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Your payment info is secure. Encrypted with SSL.
          </div>

          <div class="mt-5 flex flex-col sm:flex-row gap-3">
            <button @click="step = 1" class="flex-1 text-sm font-medium text-charcoal-500 hover:text-charcoal-900 py-3.5 rounded-full border border-charcoal-200 transition-colors">&larr; Edit Shipping</button>
            <button @click="placeOrder" :disabled="submitting" class="flex-1 bg-charcoal-900 text-white rounded-full py-3.5 text-sm font-semibold hover:bg-charcoal-700 disabled:opacity-50 transition-all active:scale-[0.98]">
              <span v-if="!submitting">Place Order — ${{ cart.totalPrice.toFixed(2) }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Processing…
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Step 3: Confirmation -->
    <Transition name="step" mode="out-in">
      <div v-if="step === 3" key="confirmation" class="max-w-lg mx-auto text-center py-12">
        <div v-motion="{ initial: { scale: 0 }, visibleOnce: { scale: 1 } }" :transition="{ type: 'spring', stiffness: 200, damping: 15 }" class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="text-3xl font-semibold text-charcoal-900">Order Confirmed!</h2>
        <p class="mt-3 text-charcoal-500">Thank you, {{ form.firstName }}! Your order has been placed successfully.</p>
        <p class="mt-2 text-sm text-charcoal-400">A confirmation email will be sent to {{ form.email }}</p>
        <div class="mt-3 text-sm text-charcoal-500 bg-charcoal-50 rounded-xl p-4 inline-block">
          Order #<span class="font-mono font-medium text-charcoal-900">{{ orderId }}</span>
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <router-link to="/" class="bg-charcoal-900 text-white rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-charcoal-700 transition-all">Continue Shopping</router-link>
          <router-link to="/" class="text-sm font-medium text-charcoal-500 hover:text-charcoal-900 py-3.5 px-8 transition-colors">View Order</router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import cart, { updateQuantity, removeFromCart, clearCart } from '../store/cart.js'
import auth from '../store/auth.js'
import api from '../services/api.js'
import { useToast } from '../store/toast.js'

const router = useRouter()
const { show } = useToast()
const step = ref(0)
const submitting = ref(false)
const orderId = ref('')

const placeholderImg = 'https://placehold.co/120x120/e2e5e9/6b7280?text=N'

const steps = [
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Done' },
]

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
})

const deliveryDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 3 + Math.floor(Math.random() * 4))
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

function goToStep1() {
  if (!auth.isLoggedIn) return router.push('/login')
  step.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToStep2() {
  step.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function placeOrder() {
  submitting.value = true
  try {
    const { data } = await api.post('/orders', { products: cart.items.map(i => ({ product: i._id, quantity: i.quantity })) })
    orderId.value = data.data?._id?.slice(-10).toUpperCase() || 'ORD' + Date.now().toString(36).toUpperCase()
    clearCart()
    step.value = 3
    window.scrollTo({ top: 0, behavior: 'smooth' })
    show('Order placed successfully!')
  } catch (err) {
    show(err.response?.data?.message || 'Checkout failed', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
