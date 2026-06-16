<template>
  <section class="bg-charcoal-900 py-24 sm:py-28 lg:py-36" data-reveal>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p v-if="title" class="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">{{ title }}</p>
      <h2 v-if="subtitle" class="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">{{ subtitle }}</h2>
      <p v-if="content.text" class="mt-3 text-white/50 text-sm max-w-md mx-auto">{{ content.text }}</p>
      <form @submit.prevent="submit" class="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input v-model="email" type="email" required placeholder="Enter your email" class="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/10 text-white text-sm outline-none placeholder:text-white/30 focus:bg-white/15 focus:border-white/25 transition-all" />
        <button type="submit" class="px-7 py-3.5 bg-white text-charcoal-900 rounded-full text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-all flex-shrink-0">{{ sent ? 'Subscribed' : content.buttonText || 'Subscribe' }}</button>
      </form>
      <p v-if="sent" class="mt-4 text-sm text-emerald-400">Thanks for subscribing!</p>
      <p class="mt-4 text-[11px] text-white/25">{{ content.disclaimer || 'No spam. Unsubscribe anytime.' }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const email = ref('')
const sent = ref(false)

function submit() {
  if (!email.value) return
  sent.value = true
  email.value = ''
}
</script>
