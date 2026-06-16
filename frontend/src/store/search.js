import { ref } from 'vue'

const isOpen = ref(false)
const RECENT_KEY = 'shopvue_recent_searches'

export function openSearch() { isOpen.value = true }
export function closeSearch() { isOpen.value = false }

export function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') }
  catch { return [] }
}

export function addRecentSearch(query) {
  const list = getRecentSearches().filter(s => s !== query)
  list.unshift(query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)))
}

export default isOpen
