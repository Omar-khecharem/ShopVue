<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="isOpen" ref="backdropEl" class="fixed inset-0 z-[70] flex items-start justify-center bg-black/30 backdrop-blur-sm pt-[15vh]" @click.self="close">
        <div class="bg-white w-full max-w-xl mx-4 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div class="p-4 sm:p-6">
            <div class="relative flex items-center gap-3 border-b border-charcoal-200 pb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref="inputEl"
                v-model="query"
                placeholder="Search products..."
                class="flex-1 text-base outline-none bg-transparent text-charcoal-900 placeholder:text-charcoal-400"
                @keydown="onKeydown"
              />
              <button @click="close" class="text-xs text-charcoal-400 hover:text-charcoal-600 flex-shrink-0 font-medium">Esc</button>
            </div>

            <div v-if="query.length > 0" class="mt-4 min-h-[200px]">
              <div v-if="searching" class="space-y-3 pt-2">
                <div v-for="n in 3" :key="n" class="flex items-center gap-4 p-2"><div class="w-12 h-12 rounded-xl skeleton-pulse" /><div class="flex-1 space-y-2"><div class="h-3 skeleton-pulse w-3/4" /><div class="h-3 skeleton-pulse w-1/4" /></div></div>
              </div>
              <div v-else-if="results.length > 0">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 mb-2 pt-1">Products ({{ results.length }})</p>
                <div class="space-y-0.5">
                  <div
                    v-for="(p, i) in results"
                    :key="p._id"
                    class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors"
                    :class="highlightIdx === i ? 'bg-charcoal-100' : 'hover:bg-charcoal-50'"
                    @click="selectProduct(p)"
                    @mouseenter="highlightIdx = i"
                  >
                    <img :src="p.images?.[0] || placeholderImg" class="w-11 h-11 rounded-lg object-cover bg-charcoal-100 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-charcoal-900 truncate">{{ p.name }}</p>
                      <p class="text-xs text-charcoal-500">${{ p.price.toFixed(2) }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal-300 flex-shrink-0"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal-200 mb-3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p class="text-sm text-charcoal-400">No results for "{{ query }}"</p>
                <p class="text-xs text-charcoal-300 mt-1">Try a different search term</p>
              </div>
            </div>

            <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 mb-2.5">Recent</p>
                <div v-if="recentSearches.length === 0" class="text-sm text-charcoal-300 py-2">No recent searches</div>
                <button v-for="s in recentSearches" :key="s" @click="query = s" class="block w-full text-left text-sm text-charcoal-600 hover:text-charcoal-900 py-1.5 transition-colors truncate">{{ s }}</button>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 mb-2.5">Trending</p>
                <button v-for="s in trendingSearches" :key="s" @click="query = s" class="block w-full text-left text-sm text-charcoal-600 hover:text-charcoal-900 py-1.5 transition-colors truncate">{{ s }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'
import isOpen, { closeSearch, getRecentSearches, addRecentSearch } from '../store/search.js'

const router = useRouter()
const inputEl = ref(null)
const backdropEl = ref(null)
const query = ref('')
const results = ref([])
const searching = ref(false)
const highlightIdx = ref(-1)
const recentSearches = ref(getRecentSearches())

const placeholderImg = 'https://placehold.co/120x120/e2e5e9/6b7280?text=N'

const trendingSearches = ['Wireless headphones', 'Minimalist watch', 'Leather wallet', 'Premium backpack', 'Desk organizer', 'Smart water bottle']

let debounceTimer = null

watch(isOpen, async (open) => {
  if (open) {
    recentSearches.value = getRecentSearches()
    await nextTick()
    inputEl.value?.focus()
  } else {
    query.value = ''
    results.value = []
    highlightIdx.value = -1
  }
})

watch(query, (val) => {
  clearTimeout(debounceTimer)
  highlightIdx.value = -1
  if (val.trim().length < 2) {
    results.value = []
    searching.value = false
    return
  }
  searching.value = true
  debounceTimer = setTimeout(() => search(val.trim()), 250)
})

async function search(q) {
  try {
    const { data } = await api.get(`/products?search=${encodeURIComponent(q)}&limit=8`)
    results.value = data.data || []
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightIdx.value = Math.min(highlightIdx.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightIdx.value = Math.max(highlightIdx.value - 1, -1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightIdx.value >= 0 && results.value[highlightIdx.value]) {
      selectProduct(results.value[highlightIdx.value])
    } else if (query.value.trim()) {
      addRecentSearch(query.value.trim())
      router.push(`/?search=${encodeURIComponent(query.value.trim())}`)
      close()
    }
  }
}

function selectProduct(p) {
  addRecentSearch(query.value.trim() || p.name)
  close()
  router.push(`/products/${p._id}`)
}

function close() {
  closeSearch()
}
</script>

<style scoped>
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.2s ease;
}
.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}
</style>
