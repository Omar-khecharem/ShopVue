<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="space-y-4 py-24">
      <div class="h-[80vh] skeleton-pulse rounded-none mx-0" />
      <div v-for="n in 3" :key="n" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <div v-for="m in 4" :key="m" class="rounded-2xl overflow-hidden"><div class="aspect-[4/3] skeleton-pulse" /><div class="p-5 space-y-3"><div class="h-4 skeleton-pulse w-3/4" /><div class="h-6 skeleton-pulse w-1/4" /></div></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchSections" class="text-sm font-medium text-charcoal-900 underline underline-offset-4">Retry</button>
    </div>

    <template v-else>
      <SectionRenderer v-for="section in sections" :key="section._id" :section="section" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '../services/api.js'
import SectionRenderer from '../components/homepage/SectionRenderer.vue'

const sections = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchSections() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/homepage')
    sections.value = data.data
    await nextTick()
    observeReveals()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load homepage'
  } finally {
    loading.value = false
  }
}

function observeReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
}

onMounted(fetchSections)
</script>
