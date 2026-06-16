<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass transition-shadow duration-300" :class="{ 'shadow-sm': scrolled }">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-semibold tracking-tight text-charcoal-900 hover:text-charcoal-600 transition-colors">
          ShopVue
        </router-link>
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">
            Products
          </router-link>
          <router-link v-if="auth.isAdmin" to="/admin/dashboard" class="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">
            Admin
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <button @click="openSearch" class="p-2 text-charcoal-500 hover:text-charcoal-900 transition-colors hidden sm:block" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <router-link to="/cart" class="relative p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span v-if="cart.totalItems > 0" class="absolute -top-0.5 -right-0.5 bg-charcoal-900 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{{ cart.totalItems }}</span>
        </router-link>

        <div v-if="!auth.isLoggedIn" class="hidden sm:flex items-center gap-3">
          <router-link to="/login" class="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">Sign In</router-link>
          <router-link to="/register" class="text-sm font-medium bg-charcoal-900 text-white px-4 py-2 rounded-full hover:bg-charcoal-700 transition-colors">Get Started</router-link>
        </div>

        <button v-if="auth.isLoggedIn" @click="logout" class="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors hidden sm:block">Sign Out</button>

        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-charcoal-600" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line v-if="!mobileOpen" x1="3" y1="6" x2="21" y2="6"/><line v-if="!mobileOpen" x1="3" y1="12" x2="21" y2="12"/><line v-if="!mobileOpen" x1="3" y1="18" x2="21" y2="18"/><line v-if="mobileOpen" x1="18" y1="6" x2="6" y2="18"/><line v-if="mobileOpen" x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </nav>

    <SearchModal />

    <Transition name="mobile-nav">
      <div v-if="mobileOpen" class="md:hidden border-t border-charcoal-200/50 glass px-4 pb-6 pt-4 flex flex-col gap-4">
        <button @click="mobileOpen = false; openSearch()" class="text-left text-sm font-medium text-charcoal-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Search
        </button>
        <router-link @click="mobileOpen = false" to="/" class="text-sm font-medium text-charcoal-700">Products</router-link>
        <router-link v-if="auth.isAdmin" @click="mobileOpen = false" to="/admin/dashboard" class="text-sm font-medium text-charcoal-700">Admin</router-link>
        <hr class="border-charcoal-200" />
        <router-link v-if="!auth.isLoggedIn" @click="mobileOpen = false" to="/login" class="text-sm font-medium text-charcoal-600">Sign In</router-link>
        <router-link v-if="!auth.isLoggedIn" @click="mobileOpen = false" to="/register" class="text-sm font-medium text-charcoal-600">Register</router-link>
        <button v-if="auth.isLoggedIn" @click="logout; mobileOpen = false" class="text-sm font-medium text-charcoal-600 text-left">Sign Out</button>
      </div>
    </Transition>
  </header>
  <div class="h-16 lg:h-20" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import cart from '../store/cart.js'
import auth, { clearAuth } from '../store/auth.js'
import { openSearch } from '../store/search.js'
import SearchModal from './SearchModal.vue'

const router = useRouter()
const scrolled = ref(false)
const mobileOpen = ref(false)

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { scrolled.value = window.scrollY > 20; ticking = false })
    ticking = true
  }
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function logout() {
  clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
