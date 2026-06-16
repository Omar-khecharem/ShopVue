<template>
  <div
    ref="cardEl"
    class="group bg-white rounded-2xl overflow-hidden transition-shadow duration-500 cursor-pointer select-none"
    :class="tiltActive ? 'shadow-2xl shadow-charcoal-900/10' : 'shadow-sm shadow-charcoal-900/5'"
    :style="cardStyle"
    @mousemove="onMouseMove"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="goToProduct"
  >
    <!-- Image Container -->
    <div class="aspect-[4/3] bg-charcoal-100 overflow-hidden relative">
      <img
        v-if="!imageError"
        :src="currentSrc"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 ease-out"
        :class="{ 'scale-110': hovered }"
        @load="imgLoaded = true"
        @error="imageError = true"
      />
      <div v-if="!imgLoaded && !imageError" class="absolute inset-0 skeleton-pulse" />

      <!-- Discount Badge -->
      <div v-if="discount" class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">{{ discount }}% OFF</div>

      <!-- Stock Scarcity -->
      <div v-if="product.stock > 0 && product.stock < 5" class="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">Only {{ product.stock }} left</div>
      <div v-if="product.stock === 0" class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20"><span class="bg-charcoal-900 text-white text-xs font-semibold px-4 py-2 rounded-full">Out of Stock</span></div>

      <!-- Quick Actions -->
      <div class="absolute top-3 right-3 flex flex-col gap-2 z-10" v-if="product.stock > 0">
        <button
          @click.stop="toggleWish"
          class="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
          :class="{ 'scale-110': wiggling }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :class="isWishlisted ? 'text-red-500' : 'text-charcoal-600'" class="transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
        <button
          @click.stop="openQuickPreview"
          class="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal-600"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      <!-- Quick Add Button (bottom center on hover) -->
      <button
        @click.stop="handleQuickAdd"
        :disabled="product.stock === 0"
        class="absolute bottom-0 left-0 right-0 bg-charcoal-900/90 backdrop-blur-sm text-white text-xs font-semibold py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-50 hover:bg-charcoal-900 z-10"
      >
        <span class="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Quick Add
        </span>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5">
      <!-- Rating -->
      <div class="flex items-center gap-1 mb-1.5">
        <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" :fill="n <= rating ? '#f59e0b' : 'none'" :stroke="n <= rating ? '#f59e0b' : '#d1d5db'" stroke-width="1.5" class="transition-colors"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span class="text-[10px] text-charcoal-400 ml-1">{{ rating.toFixed(1) }}</span>
      </div>

      <h3 class="text-sm font-medium text-charcoal-900 truncate leading-snug">{{ product.name }}</h3>

      <div class="mt-2 flex items-baseline gap-2">
        <p class="text-lg font-semibold text-charcoal-900 tabular-nums">${{ product.price.toFixed(2) }}</p>
        <p v-if="discount" class="text-xs text-charcoal-400 line-through">${{ originalPrice.toFixed(2) }}</p>
      </div>

      <p class="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        Free delivery {{ deliveryDate }}
      </p>
    </div>

    <!-- Quick Preview Modal -->
    <Teleport to="body">
      <Transition name="preview">
        <div v-if="showPreview" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="closePreview">
          <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div class="grid grid-cols-1 md:grid-cols-2">
              <div class="aspect-square bg-charcoal-100 overflow-hidden rounded-tl-3xl rounded-bl-3xl">
                <img :src="currentSrc" :alt="product.name" class="w-full h-full object-cover" />
              </div>
              <div class="p-6 sm:p-8 flex flex-col justify-center">
                <div class="flex items-center gap-1 mb-2">
                  <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" :fill="n <= rating ? '#f59e0b' : 'none'" :stroke="n <= rating ? '#f59e0b' : '#d1d5db'" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="text-xs text-charcoal-400 ml-1">{{ rating.toFixed(1) }} ({{ reviewCount }})</span>
                </div>
                <h3 class="text-xl font-semibold text-charcoal-900">{{ product.name }}</h3>
                <p class="mt-2 text-sm text-charcoal-500 leading-relaxed line-clamp-3">{{ product.description }}</p>
                <div class="mt-4 flex items-baseline gap-2">
                  <span class="text-2xl font-semibold text-charcoal-900">${{ product.price.toFixed(2) }}</span>
                  <span v-if="discount" class="text-sm text-charcoal-400 line-through">${{ originalPrice.toFixed(2) }}</span>
                  <span v-if="discount" class="text-xs font-semibold text-red-500">Save ${{ (originalPrice - product.price).toFixed(2) }}</span>
                </div>
                <div v-if="product.stock > 0 && product.stock < 10" class="mt-3 text-xs font-medium text-amber-600">Only {{ product.stock }} left — order soon</div>
                <button
                  @click="handleQuickAdd"
                  :disabled="product.stock === 0"
                  class="mt-5 w-full bg-charcoal-900 text-white rounded-full py-3.5 text-sm font-semibold hover:bg-charcoal-700 disabled:opacity-40 transition-all active:scale-[0.98]"
                >
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
                <div class="mt-4 flex items-center gap-4 text-[11px] text-charcoal-400">
                  <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Free shipping</span>
                  <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Free returns</span>
                </div>
                <button @click="closePreview" class="mt-3 text-xs text-charcoal-400 hover:text-charcoal-600 transition-colors">Close preview</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { addToCart } from '../store/cart.js'
import { useToast } from '../store/toast.js'
import wishlist, { toggleWishlist } from '../store/wishlist.js'

const props = defineProps({
  product: { type: Object, required: true },
})
defineEmits(['add-to-cart'])

const router = useRouter()
const { show } = useToast()
const cardEl = ref(null)
const hovered = ref(false)
const tiltActive = ref(false)
const imgLoaded = ref(false)
const imageError = ref(false)
const showPreview = ref(false)
const wiggling = ref(false)

const tilt = reactive({ x: 0, y: 0 })

const currentSrc = computed(() =>
  props.product.images?.length
    ? props.product.images[0]
    : 'https://placehold.co/600x400/e2e5e9/6b7280?text=No+Image'
)

const rating = computed(() => {
  const hash = hashStr(props.product._id || '')
  return 3.5 + (hash % 15) / 10
})

const reviewCount = computed(() => {
  const hash = hashStr(props.product._id || '')
  return 50 + (hash % 950)
})

const discount = computed(() => {
  const hash = hashStr(props.product._id || '')
  return hash % 4 === 0 ? 15 + (hash % 25) : null
})

const originalPrice = computed(() => discount.value ? props.product.price / (1 - discount.value / 100) : props.product.price)

const deliveryDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 3 + Math.floor(Math.random() * 4))
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

const isWishlisted = computed(() => wishlist.items.some(i => i._id === props.product._id))

const cardStyle = computed(() => {
  if (!tiltActive.value) return {}
  return {
    transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
    transition: 'box-shadow 0.5s ease',
  }
})

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

function onMouseEnter() {
  hovered.value = true
  tiltActive.value = true
}

function onMouseLeave() {
  hovered.value = false
  tiltActive.value = false
  tilt.x = 0
  tilt.y = 0
  if (cardEl.value) cardEl.value.style.transform = ''
}

function onMouseMove(e) {
  if (!cardEl.value) return
  const rect = cardEl.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  tilt.x = x * 8
  tilt.y = y * -8
}

function goToProduct() {
  router.push(`/products/${props.product._id}`)
}

function toggleWish() {
  toggleWishlist(props.product)
  wiggling.value = true
  setTimeout(() => { wiggling.value = false }, 300)
  show(isWishlisted.value ? 'Removed from wishlist' : 'Added to wishlist')
}

function openQuickPreview() {
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
}

function handleQuickAdd() {
  if (props.product.stock === 0) return
  addToCart(props.product)
  show(`Added ${props.product.name} to cart`)
}
</script>

<style scoped>
.preview-enter-active,
.preview-leave-active {
  transition: opacity 0.25s ease;
}
.preview-enter-from,
.preview-leave-to {
  opacity: 0;
}
</style>
