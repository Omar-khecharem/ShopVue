<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36" data-reveal>
    <div class="relative rounded-3xl overflow-hidden" :class="{ 'bg-charcoal-900 text-white': dark, 'bg-charcoal-50': !dark }">
      <img v-if="content.backgroundImage" :src="content.backgroundImage" class="absolute inset-0 w-full h-full object-cover" />
      <div v-if="content.backgroundImage" class="absolute inset-0 bg-charcoal-900/60" />
      <div class="relative z-10 p-8 sm:p-12 lg:p-16 text-center" :class="{ 'text-white': dark }">
        <h2 v-if="content.title" class="text-3xl sm:text-4xl font-semibold tracking-tight">{{ content.title }}</h2>
        <p v-if="content.text" class="mt-3 text-sm sm:text-base max-w-lg mx-auto" :class="dark ? 'text-white/60' : 'text-charcoal-500'">{{ content.text }}</p>
        <a v-if="content.link" :href="content.link" class="mt-6 inline-flex items-center gap-2 bg-white text-charcoal-900 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all active:scale-[0.97]">
          {{ content.buttonText || 'Learn More' }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <div v-if="content.html" class="mt-4" v-html="content.html" />
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({}) },
})
const dark = props.content?.darkMode !== false
</script>
