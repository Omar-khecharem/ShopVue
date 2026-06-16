<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Dashboard</h1>

    <div v-if="loading" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="n in 4" :key="n" class="bg-white rounded-2xl p-6 space-y-3 shadow-sm"><div class="h-4 skeleton-pulse w-1/2" /><div class="h-8 skeleton-pulse w-1/3" /></div>
    </div>

    <div v-else-if="error" class="mt-12 text-center">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchStats" class="text-sm font-medium text-charcoal-900 underline underline-offset-4">Retry</button>
    </div>

    <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="s in statsData" :key="s.label" class="bg-white rounded-2xl p-6 shadow-sm shadow-charcoal-900/5">
        <p class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">{{ s.label }}</p>
        <p class="mt-2 text-3xl font-semibold text-charcoal-900 tabular-nums">{{ s.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'

const loading = ref(true)
const error = ref(null)
const stats = ref({ products: 0, orders: 0, pending: 0, delivered: 0 })

const statsData = computed(() => [
  { label: 'Total Products', value: stats.value.products },
  { label: 'Total Orders', value: stats.value.orders },
  { label: 'Pending', value: stats.value.pending },
  { label: 'Delivered', value: stats.value.delivered },
])

async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    const [pr, or] = await Promise.all([api.get('/products?limit=1'), api.get('/orders')])
    const orders = or.data.data
    stats.value = {
      products: pr.data.pagination?.total || 0,
      orders: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>
