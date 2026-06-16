<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-semibold tracking-tight text-charcoal-900 text-center">Welcome back</h1>
      <p class="mt-2 text-sm text-charcoal-500 text-center">Sign in to your account</p>

      <form @submit.prevent="handleLogin" class="mt-10 space-y-5">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Email address" required class="w-full px-4 py-3.5 bg-charcoal-50 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 border border-transparent focus:border-charcoal-300 focus:bg-white outline-none transition-all" />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Password" required class="w-full px-4 py-3.5 bg-charcoal-50 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 border border-transparent focus:border-charcoal-300 focus:bg-white outline-none transition-all" />
        </div>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

        <button type="submit" :disabled="submitting" class="w-full bg-charcoal-900 text-white rounded-full py-3.5 text-sm font-medium hover:bg-charcoal-700 disabled:opacity-50 transition-all">
          {{ submitting ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-8 text-sm text-charcoal-500 text-center">
        Don't have an account? <router-link to="/register" class="text-charcoal-900 font-medium underline underline-offset-4 hover:no-underline">Create one</router-link>
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
const email = ref('')
const password = ref('')
const error = ref(null)
const submitting = ref(false)

async function handleLogin() {
  error.value = null
  submitting.value = true
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    setAuth(data)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  } finally {
    submitting.value = false
  }
}
</script>
