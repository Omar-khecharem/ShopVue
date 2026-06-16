<template>
  <Teleport to="body">
    <Transition name="exit">
      <div v-if="visible" class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="dismiss">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 sm:p-10 text-center shadow-2xl animate-scale-in">
          <div class="w-14 h-14 rounded-full bg-charcoal-900 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Wait! Don't go empty-handed</h2>
          <p class="mt-3 text-sm text-charcoal-500 leading-relaxed">Get <strong class="text-charcoal-900">10% off</strong> your first order when you sign up for our newsletter.</p>
          <form @submit.prevent="subscribe" class="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 bg-charcoal-50 rounded-full text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all text-center sm:text-left"
            />
            <button type="submit" class="bg-charcoal-900 text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-charcoal-700 transition-all flex-shrink-0">Get 10% Off</button>
          </form>
          <p v-if="subscribed" class="mt-3 text-sm text-emerald-600 font-medium">Check your inbox for your discount code!</p>
          <button @click="dismiss" class="mt-5 text-xs text-charcoal-400 hover:text-charcoal-600 transition-colors underline underline-offset-4">No thanks, I'll pay full price</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const email = ref('')
const subscribed = ref(false)
const dismissed = ref(false)

let handler = null

onMounted(() => {
  const shown = sessionStorage.getItem('exit_intent_shown')
  if (shown) return

  handler = (e) => {
    if (dismissed.value) return
    if (e.clientY <= 15) {
      visible.value = true
      sessionStorage.setItem('exit_intent_shown', 'true')
    }
  }
  document.addEventListener('mouseleave', handler)
})

onUnmounted(() => {
  if (handler) document.removeEventListener('mouseleave', handler)
})

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
}

function dismiss() {
  visible.value = false
  dismissed.value = true
}
</script>

<style scoped>
.exit-enter-active,
.exit-leave-active {
  transition: opacity 0.3s ease;
}
.exit-enter-from,
.exit-leave-to {
  opacity: 0;
}
</style>
