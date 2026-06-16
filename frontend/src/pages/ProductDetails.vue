<template>
  <div>
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="aspect-square skeleton-pulse rounded-2xl" />
        <div class="space-y-6 pt-4">
          <div class="h-8 skeleton-pulse w-3/4" />
          <div class="h-10 skeleton-pulse w-1/3" />
          <div class="h-4 skeleton-pulse w-1/4" />
          <div class="space-y-3"><div class="h-4 skeleton-pulse" /><div class="h-4 skeleton-pulse" /><div class="h-4 skeleton-pulse w-2/3" /></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchProduct" class="text-sm font-medium text-charcoal-900 underline underline-offset-4 hover:no-underline">Try again</button>
    </div>

    <template v-else-if="product">
      <!-- ===== HERO ===== -->
      <section class="relative min-h-screen flex items-center bg-charcoal-900 overflow-hidden">
        <div ref="heroImageWrap" class="absolute inset-0 scale-110 will-change-transform">
          <img :src="currentSrc" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        <div ref="heroOverlay" class="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/50 to-charcoal-900/20" />
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen flex items-center">
          <div class="max-w-2xl -mt-16 sm:-mt-20">
            <span ref="heroBadge" class="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">{{ product.category?.name || 'Premium' }}</span>
            <h1 ref="heroTitle" class="mt-4 text-[clamp(2.8rem,7vw,5rem)] font-semibold tracking-tight text-white leading-[1.05]">{{ product.name }}</h1>
            <p ref="heroDesc" class="mt-5 text-lg sm:text-xl text-white/55 leading-relaxed max-w-lg">{{ truncate(product.description, 160) }}</p>
            <div ref="heroCta" class="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div class="flex items-baseline gap-2">
                <span class="text-4xl sm:text-5xl font-semibold text-white tabular-nums">${{ product.price.toFixed(2) }}</span>
                <span class="text-sm text-white/40 line-through hidden sm:inline">${{ (product.price * 1.25).toFixed(2) }}</span>
              </div>
              <button
                @click="handleAdd"
                :disabled="product.stock === 0"
                class="group relative bg-white text-charcoal-900 px-10 py-4 rounded-full text-sm font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.97] overflow-hidden"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </span>
                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/20 transition-transform duration-500" />
              </button>
            </div>
            <div ref="heroTrust" class="mt-10 flex flex-wrap gap-6 text-white/30 text-xs">
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>Free shipping over $50</span>
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>30-day returns</span>
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>Secure checkout</span>
            </div>
          </div>
        </div>
        <div ref="scrollIndicator" class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
          <span>Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="animate-bounce"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        </div>
      </section>

      <!-- ===== STORY 1: Craftsmanship ===== -->
      <section class="min-h-screen flex items-center py-28 sm:py-36">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div v-motion="{ initial: { opacity: 0, x: -80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }">
              <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">Craftsmanship</span>
              <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal-900 leading-[1.1]">{{ stories[0].title }}</h2>
              <p class="mt-5 text-base sm:text-lg text-charcoal-500 leading-relaxed">{{ stories[0].text }}</p>
            </div>
            <div v-motion="{ initial: { opacity: 0, x: 80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }" class="aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-100 shadow-xl shadow-charcoal-900/5">
              <img :src="currentSrc" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      <!-- ===== STORY 2: Materials ===== -->
      <section class="min-h-screen flex items-center py-28 sm:py-36 bg-charcoal-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div v-motion="{ initial: { opacity: 0, x: -80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }" class="order-last lg:order-none aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-100 shadow-xl shadow-charcoal-900/5">
              <img :src="currentSrc" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div v-motion="{ initial: { opacity: 0, x: 80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }">
              <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">Materials</span>
              <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal-900 leading-[1.1]">{{ stories[1].title }}</h2>
              <p class="mt-5 text-base sm:text-lg text-charcoal-500 leading-relaxed">{{ stories[1].text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== STORY 3: Built to Last ===== -->
      <section class="min-h-screen flex items-center py-28 sm:py-36">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div v-motion="{ initial: { opacity: 0, x: -80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }">
              <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">Durability</span>
              <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal-900 leading-[1.1]">{{ stories[2].title }}</h2>
              <p class="mt-5 text-base sm:text-lg text-charcoal-500 leading-relaxed">{{ stories[2].text }}</p>
            </div>
            <div v-motion="{ initial: { opacity: 0, x: 80 }, visibleOnce: { opacity: 1, x: 0 } }" :transition="{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }" class="aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-100 shadow-xl shadow-charcoal-900/5">
              <img :src="currentSrc" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      <!-- ===== DETAILS GRID ===== -->
      <section class="py-28 sm:py-36 bg-charcoal-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-xl mb-16">
            <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">Features</span>
            <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal-900 leading-[1.1]">Designed in every detail</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div
              v-for="(d, i) in details"
              :key="d.title"
              v-motion="{ initial: { opacity: 0, y: 50 }, visibleOnce: { opacity: 1, y: 0 } }"
              :transition="{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }"
              class="bg-white rounded-2xl p-8 shadow-sm shadow-charcoal-900/5"
            >
              <div class="w-11 h-11 rounded-xl bg-charcoal-900 flex items-center justify-center text-white mb-6" v-html="d.icon" />
              <h3 class="text-lg font-semibold text-charcoal-900">{{ d.title }}</h3>
              <p class="mt-2 text-sm text-charcoal-500 leading-relaxed">{{ d.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SPECS ===== -->
      <section class="py-28 sm:py-36">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-xl mb-16">
            <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">Specifications</span>
            <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal-900 leading-[1.1]">The technical details</h2>
          </div>
          <div class="max-w-3xl">
            <div
              v-for="(spec, i) in specs"
              :key="spec.label"
              v-motion="{ initial: { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, visibleOnce: { opacity: 1, x: 0 } }"
              :transition="{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }"
              class="flex items-center justify-between py-4 border-b border-charcoal-100 last:border-0"
            >
              <span class="text-sm text-charcoal-500">{{ spec.label }}</span>
              <span class="text-sm font-medium text-charcoal-900 text-right max-w-[60%]">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== FINAL CTA ===== -->
      <section class="bg-charcoal-900 py-32 sm:py-40">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div v-motion="{ initial: { opacity: 0, scale: 0.92 }, visibleOnce: { opacity: 1, scale: 1 } }" :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }">
            <p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">{{ product.category?.name || 'Premium' }}</p>
            <h2 class="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05]">Make it yours</h2>
            <div class="mt-6 flex items-center justify-center gap-3 text-white/60 text-sm">
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>Free shipping</span>
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>30-day returns</span>
              <span class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>Secure checkout</span>
            </div>
            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <span class="text-3xl sm:text-4xl font-semibold text-white tabular-nums">${{ product.price.toFixed(2) }}</span>
              <button
                @click="handleAdd"
                :disabled="product.stock === 0"
                class="bg-white text-charcoal-900 px-10 py-4 rounded-full text-sm font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
              >
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
            <p v-if="product.stock > 0 && product.stock < 10" class="mt-4 text-sm text-amber-400 font-medium">Only {{ product.stock }} left in stock</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import api from '../services/api.js'
import { addToCart } from '../store/cart.js'
import { useToast } from '../store/toast.js'

const route = useRoute()
const { show } = useToast()
const product = ref(null)
const loading = ref(true)
const error = ref(null)
const imageError = ref(false)

const heroImageWrap = ref(null)
const heroOverlay = ref(null)
const heroBadge = ref(null)
const heroTitle = ref(null)
const heroDesc = ref(null)
const heroCta = ref(null)
const heroTrust = ref(null)
const scrollIndicator = ref(null)

let heroTl = null

const currentSrc = computed(() =>
  imageError.value || !product.value?.images?.length
    ? 'https://placehold.co/1200x1200/e2e5e9/6b7280?text=No+Image'
    : product.value.images[0]
)

const stories = [
  {
    title: 'Crafted with precision.',
    text: 'Every curve, every edge, every detail is intentional. Our design philosophy centers on the belief that the best products disappear in your hands — intuitive, natural, and effortless.'
  },
  {
    title: 'Materials that matter.',
    text: 'We source only the finest materials from around the world. Each component is tested for durability, feel, and beauty before it ever reaches your hands. Nothing is overlooked.'
  },
  {
    title: 'Built to last a lifetime.',
    text: 'This isn\'t disposable. It\'s designed to be repaired, not replaced. With proper care, it will serve you for decades — and look better with age.'
  }
]

const details = [
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', title: 'Premium Quality', text: 'Crafted from the highest-grade materials, ensuring durability and a premium feel that lasts for years.' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Ergonomic Design', text: 'Thoughtfully shaped to fit naturally. Every curve serves a purpose, every angle is considered for comfort.' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', title: 'Sustainable Packaging', text: '100% plastic-free, recyclable packaging. Every order ships in materials that are kind to the planet.' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: '24/7 Support', text: 'Our team is here whenever you need us. Expect a response within 2 hours, every day of the week.' },
]

const specs = computed(() => [
  { label: 'Material', value: 'Premium-grade materials' },
  { label: 'Weight', value: `${(Math.random() * 500 + 100).toFixed(0)} g` },
  { label: 'Dimensions', value: `${(Math.random() * 20 + 5).toFixed(1)} × ${(Math.random() * 10 + 2).toFixed(1)} × ${(Math.random() * 5 + 0.5).toFixed(1)} in` },
  { label: 'Category', value: product.value?.category?.name || 'General' },
  { label: 'Warranty', value: '1 year limited warranty' },
  { label: 'Origin', value: 'Designed with care' },
])

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

async function fetchProduct() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/products/${route.params.id}`)
    product.value = data.data
    await nextTick()
    animateHero()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load product.'
  } finally {
    loading.value = false
  }
}

function animateHero() {
  heroTl = gsap.timeline()
  heroTl
    .to(heroImageWrap.value, { scale: 1, duration: 2.2, ease: 'power3.out' })
    .fromTo(heroOverlay.value, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0)
    .fromTo([heroBadge.value, heroTitle.value, heroDesc.value, heroCta.value, heroTrust.value],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      0.3
    )
    .fromTo(scrollIndicator.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
}

function handleAdd() {
  addToCart(product.value)
  show(`${product.value.name} added to cart`)
}

onMounted(fetchProduct)

onUnmounted(() => {
  if (heroTl) heroTl.kill()
})
</script>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
