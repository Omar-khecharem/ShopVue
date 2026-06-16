<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900 mb-8">Orders</h1>

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="h-16 skeleton-pulse rounded-xl" />
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchOrders" class="text-sm font-medium underline underline-offset-4">Retry</button>
    </div>

    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-charcoal-200">
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Order</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden sm:table-cell">Customer</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden md:table-cell">Items</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Total</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden lg:table-cell">Date</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id" class="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors">
            <td class="px-5 py-4 font-mono text-xs text-charcoal-500">{{ order._id.slice(-8) }}</td>
            <td class="px-5 py-4 text-charcoal-700 hidden sm:table-cell">{{ order.user?.name || order.user?.email || '—' }}</td>
            <td class="px-5 py-4 text-charcoal-700 hidden md:table-cell tabular-nums">{{ order.products?.length || 0 }}</td>
            <td class="px-5 py-4 font-medium tabular-nums">${{ order.totalPrice?.toFixed(2) }}</td>
            <td class="px-5 py-4 text-charcoal-500 hidden lg:table-cell">{{ formatDate(order.createdAt) }}</td>
            <td class="px-5 py-4">
              <select :value="order.status" @change="updateStatus(order, $event.target.value)" class="text-xs font-medium rounded-lg border border-charcoal-200 px-2.5 py-1.5 bg-white outline-none focus:border-charcoal-400 transition-colors">
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </td>
          </tr>
          <tr v-if="orders.length === 0"><td colspan="6" class="px-5 py-16 text-center text-charcoal-400">No orders.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { useToast } from '../store/toast.js'

const { show } = useToast()
const orders = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchOrders() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/orders'); orders.value = data.data }
  catch (err) { error.value = err.response?.data?.message || 'Failed' }
  finally { loading.value = false }
}

onMounted(fetchOrders)

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }

async function updateStatus(order, status) {
  try {
    const { data } = await api.put(`/orders/${order._id}/status`, { status })
    order.status = data.data.status
    show(`Order marked as ${status}`)
  } catch (err) {
    show(err.response?.data?.message || 'Update failed', 'error')
    fetchOrders()
  }
}
</script>
