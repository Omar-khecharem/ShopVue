<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24" data-reveal>
    <div v-if="title || subtitle" class="max-w-xl mb-12">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
      <div v-for="brand in items" :key="brand.name" class="flex items-center justify-center p-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
        <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" class="max-h-10 object-contain" />
        <span v-else class="text-sm font-semibold text-charcoal-400">{{ brand.name }}</span>
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
const items = props.content?.brands || []
</script>
