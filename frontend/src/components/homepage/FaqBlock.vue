<template>
  <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36" data-reveal>
    <div v-if="title || subtitle" class="text-center mb-14">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
    </div>
    <div class="space-y-3">
      <div v-for="(faq, i) in items" :key="i" class="bg-charcoal-50 rounded-2xl overflow-hidden">
        <button @click="open = open === i ? null : i" class="w-full flex items-center justify-between px-6 sm:px-8 py-5 text-left text-sm font-medium text-charcoal-900 hover:bg-charcoal-100/50 transition-colors">
          {{ faq.q || faq.question }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 ml-4 transition-transform duration-300" :class="open === i ? 'rotate-180' : ''"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <Transition name="faq">
          <div v-if="open === i" class="px-6 sm:px-8 pb-5 text-sm text-charcoal-500 leading-relaxed">{{ faq.a || faq.answer }}</div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const items = computed(() => props.content?.faqs || [])
const open = ref(null)
</script>

<style scoped>
.faq-enter-active, .faq-leave-active { transition: opacity 0.3s ease, max-height 0.3s ease; overflow: hidden; }
.faq-enter-from, .faq-leave-to { opacity: 0; max-height: 0; }
.faq-enter-to, .faq-leave-from { max-height: 200px; }
</style>
