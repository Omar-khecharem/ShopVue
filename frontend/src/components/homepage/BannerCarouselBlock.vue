<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-reveal>
    <div v-if="title || subtitle" class="max-w-xl mb-8">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
    </div>
    <div class="relative overflow-hidden rounded-2xl">
      <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(b, i) in banners" :key="i" class="min-w-full relative aspect-[2/1] sm:aspect-[3/1] bg-charcoal-900 overflow-hidden">
          <img :src="b.desktopImage || b.image" :alt="b.title" class="w-full h-full object-cover hidden sm:block" />
          <img :src="b.mobileImage || b.desktopImage || b.image" :alt="b.title" class="w-full h-full object-cover sm:hidden" />
          <div class="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 to-transparent flex items-center">
            <div class="p-6 sm:p-12 max-w-md">
              <h3 v-if="b.title" class="text-xl sm:text-3xl font-semibold text-white">{{ b.title }}</h3>
              <p v-if="b.subtitle" class="mt-2 text-sm text-white/60">{{ b.subtitle }}</p>
              <a v-if="b.link" :href="b.link" class="mt-4 inline-flex items-center gap-2 bg-white text-charcoal-900 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/90 transition-all">
                {{ b.buttonText || 'Shop Now' }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="banners.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button v-for="(b, i) in banners" :key="i" class="w-2 h-2 rounded-full transition-all" :class="i === currentIndex ? 'bg-white w-6' : 'bg-white/40'" @click="currentIndex = i" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const banners = props.content?.banners || []
const currentIndex = ref(0)
let interval = null

onMounted(() => {
  if (banners.length > 1) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % banners.length
    }, 5000)
  }
})
onUnmounted(() => { if (interval) clearInterval(interval) })
</script>
