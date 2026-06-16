<template>
  <section class="py-24 sm:py-28 lg:py-32" :class="{ 'bg-charcoal-50': altBg }" data-reveal>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p v-if="label" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ label }}</p>
          <h2 v-if="title" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ title }}</h2>
          <p v-if="subtitle" class="mt-2 text-sm text-charcoal-500 max-w-md">{{ subtitle }}</p>
        </div>
        <router-link v-if="link" :to="link" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 flex-shrink-0 transition-colors">
          View all
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </router-link>
      </div>
      <div v-if="!products || products.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div v-for="n in 4" :key="n" class="rounded-2xl overflow-hidden"><div class="aspect-[4/3] skeleton-pulse" /><div class="p-5 space-y-3"><div class="h-4 skeleton-pulse w-3/4" /><div class="h-6 skeleton-pulse w-1/4" /></div></div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div v-for="p in products" :key="p._id" class="relative">
          <div v-if="p.stock > 0 && p.stock < 5" class="absolute -top-1.5 -right-1.5 z-10 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg">Only {{ p.stock }} left</div>
          <ProductCard :product="p" @add-to-cart="handleAdd" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from '../ProductCard.vue'
import { addToCart } from '../../store/cart.js'
import { useToast } from '../../store/toast.js'

const { show } = useToast()
const props = defineProps({
  content: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  type: { type: String, default: 'featured' },
})

const label = props.type === 'featured' ? 'Featured' : props.type === 'best_sellers' ? 'Best Sellers' : props.type === 'trending' ? 'Trending Now' : ''
const altBg = props.type === 'best_sellers'
const products = props.content?.products || []
const link = '/products'

function handleAdd(product) {
  addToCart(product)
  show(`${product.name} added to cart`)
}
</script>

<style scoped>
[data-reveal] {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}
</style>
