<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-semibold tracking-tight text-charcoal-900 text-center">Create account</h1>
      <p class="mt-2 text-sm text-charcoal-500 text-center">Start shopping in minutes</p>

      <form @submit.prevent="handleRegister" class="mt-10 space-y-5">
        <div>
          <label for="name" class="sr-only">Name</label>
          <input id="name" v-model="name" type="text" placeholder="Full name" required class="w-full px-4 py-3.5 bg-charcoal-50 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 border border-transparent focus:border-charcoal-300 focus:bg-white outline-none transition-all" />
        </div>
        <div>
          <label for="email" class="sr-only">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Email address" required class="w-full px-4 py-3.5 bg-charcoal-50 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 border border-transparent focus:border-charcoal-300 focus:bg-white outline-none transition-all" />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Password (min. 6 characters)" required minlength="6" class="w-full px-4 py-3.5 bg-charcoal-50 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 border border-transparent focus:border-charcoal-300 focus:bg-white outline-none transition-all" />
        </div>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

        <button type="submit" :disabled="submitting" class="w-full bg-charcoal-900 text-white rounded-full py-3.5 text-sm font-medium hover:bg-charcoal-700 disabled:opacity-50 transition-all">
          {{ submitting ? 'Creating account…' : 'Create Account' }}
        </button>
      </form>

      <p class="mt-8 text-sm text-charcoal-500 text-center">
        Already have an account? <router-link to="/login" class="text-charcoal-900 font-medium underline underline-offset-4 hover:no-underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'
import { setAuth } from '../store/auth.js'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const submitting = ref(false)

async function handleRegister() {
  error.value = null
  submitting.value = true
  try {
    const { data } = await api.post('/auth/register', { name: name.value, email: email.value, password: password.value })
    setAuth(data)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    submitting.value = false
  }
}
</script>
