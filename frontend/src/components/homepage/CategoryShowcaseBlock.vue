<template>
  <section class="bg-charcoal-50 py-24 sm:py-28 lg:py-36" data-reveal>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="title || subtitle" class="max-w-xl mb-12">
        <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal-400">{{ title }}</p>
        <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal-900">{{ subtitle }}</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div v-for="cat in items" :key="cat._id" class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5 group cursor-pointer" @click="$router.push(`/products?category=${cat._id}`)">
          <div class="aspect-[16/9] bg-charcoal-100 overflow-hidden">
            <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-5 sm:p-6">
            <h3 class="text-base font-semibold text-charcoal-900">{{ cat.name }}</h3>
            <p v-if="cat.description" class="mt-1.5 text-sm text-charcoal-500 leading-relaxed">{{ cat.description }}</p>
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
const items = props.content?.categories || []
</script>
