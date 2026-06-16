<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36" data-reveal>
    <div v-if="title || subtitle" class="max-w-xl mb-12">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      <div v-for="b in items" :key="b.title" class="bg-charcoal-50 rounded-2xl p-7 sm:p-8">
        <div v-if="b.icon" class="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-white mb-5" v-html="b.icon" />
        <div v-else class="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-white mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 class="text-base font-semibold text-charcoal-900">{{ b.title }}</h3>
        <p class="mt-2 text-sm text-charcoal-500 leading-relaxed">{{ b.text }}</p>
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
const items = props.content?.benefits || []
</script>
