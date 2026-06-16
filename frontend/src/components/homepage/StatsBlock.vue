<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36" data-reveal>
    <div v-if="title || subtitle" class="max-w-xl mx-auto text-center mb-16">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-16">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <p class="text-4xl sm:text-5xl font-semibold text-charcoal-900 tabular-nums tracking-tight">{{ stat.value }}</p>
        <p class="mt-2 text-sm text-charcoal-500">{{ stat.label }}</p>
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
const stats = props.content?.stats || [
  { value: '10K+', label: 'Happy Customers' },
  { value: '4.8', label: 'Average Rating' },
  { value: '500+', label: 'Products' },
  { value: '99%', label: 'Satisfaction' },
]
</script>
