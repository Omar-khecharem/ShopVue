<template>
  <section v-motion="{ initial: { opacity: 0 }, visibleOnce: { opacity: 1 } }" :transition="{ duration: 0.8 }" class="relative min-h-[80vh] sm:min-h-[85vh] flex items-center bg-charcoal-900 overflow-hidden">
    <div class="absolute inset-0">
      <img :src="banner.desktopImage || placeholder" :alt="banner.title" class="w-full h-full object-cover hidden sm:block" />
      <img :src="banner.mobileImage || banner.desktopImage || placeholder" :alt="banner.title" class="w-full h-full object-cover sm:hidden" />
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/50 to-charcoal-900/20" />
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
      <div class="max-w-2xl">
        <span v-if="title" class="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">{{ title }}</span>
        <h1 v-if="banner.title" class="text-[clamp(2.2rem,6vw,4.5rem)] font-semibold tracking-tight text-white leading-[1.05]">{{ banner.title }}</h1>
        <p v-if="banner.subtitle" class="mt-4 text-lg sm:text-xl text-white/55 leading-relaxed max-w-lg">{{ banner.subtitle }}</p>
        <a v-if="banner.link" :href="banner.link" class="mt-8 inline-flex items-center gap-2 bg-white text-charcoal-900 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all active:scale-[0.97]">
          {{ banner.buttonText || 'Shop Now' }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
const placeholder = 'https://placehold.co/1600x900/111827/6b7280?text=Hero'
const banners = props.content?.banners || []
const banner = banners[0] || {}
</script>
