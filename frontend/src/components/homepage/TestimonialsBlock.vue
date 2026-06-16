<template>
  <section class="bg-charcoal-50 py-24 sm:py-28 lg:py-36" data-reveal>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="title || subtitle" class="max-w-xl mb-12">
        <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
        <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div v-for="t in items" :key="t.name" class="bg-white rounded-2xl p-7 sm:p-8 shadow-sm shadow-charcoal-900/5">
          <div class="flex gap-0.5 mb-4">
            <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="n <= (t.rating || 5) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" class="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="text-sm text-charcoal-700 leading-relaxed">"{{ t.text }}"</p>
          <div class="mt-5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-charcoal-200 flex items-center justify-center text-xs font-semibold text-charcoal-600">{{ (t.name || '?').split(' ').map(s => s[0]).join('') }}</div>
            <div>
              <p class="text-sm font-medium text-charcoal-900">{{ t.name }}</p>
              <p v-if="t.title" class="text-xs text-charcoal-400">{{ t.title }}</p>
            </div>
          </div>
        </div>
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
const items = props.content?.testimonials || []
</script>
