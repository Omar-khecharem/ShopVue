<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900 mb-8">Users</h1>

    <div v-if="loading" class="space-y-4"><div v-for="n in 5" :key="n" class="h-16 skeleton-pulse rounded-xl" /></div>
    <div v-else-if="error" class="text-center py-16"><p class="text-charcoal-500 mb-4">{{ error }}</p><button @click="fetchUsers" class="text-sm font-medium underline underline-offset-4">Retry</button></div>
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5">
      <table class="w-full text-sm">
        <thead><tr class="border-b border-charcoal-200"><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Name</th><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden sm:table-cell">Email</th><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Role</th><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden md:table-cell">Joined</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u._id" class="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors">
            <td class="px-5 py-4 font-medium text-charcoal-900">{{ u.name || '—' }}</td>
            <td class="px-5 py-4 text-charcoal-500 hidden sm:table-cell">{{ u.email }}</td>
            <td class="px-5 py-4"><span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="u.role === 'admin' ? 'bg-charcoal-900 text-white' : 'bg-charcoal-100 text-charcoal-600'">{{ u.role }}</span></td>
            <td class="px-5 py-4 text-charcoal-500 hidden md:table-cell text-xs">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const users = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchUsers() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/users'); users.value = data.data || data.users || data }
  catch (err) { error.value = err.response?.data?.message || 'Failed' }
  finally { loading.value = false }
}

onMounted(fetchUsers)
</script>
