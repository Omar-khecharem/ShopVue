<template>
  <template v-if="auth.initDone">
    <Navbar />
    <main :class="isAdminRoute ? 'min-h-screen bg-charcoal-50' : 'min-h-screen'">
      <router-view v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminRoute" />
    <Toast />
    <ExitIntentPopup />
    <SocialProof />
  </template>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import ExitIntentPopup from './components/ExitIntentPopup.vue'
import SocialProof from './components/SocialProof.vue'
import auth, { initAuth } from './store/auth.js'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(initAuth)
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
