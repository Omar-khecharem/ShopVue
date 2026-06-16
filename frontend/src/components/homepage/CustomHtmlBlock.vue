<template>
  <section v-if="content.html" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-reveal>
    <div v-html="content.html" />
  </section>
</template>

<script setup>
defineProps({
  content: { type: Object, default: () => ({}) },
})
</script>
