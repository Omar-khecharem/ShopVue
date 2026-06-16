<template>
  <footer class="bg-charcoal-50 border-t border-charcoal-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div class="col-span-2 lg:col-span-1">
          <router-link to="/" class="text-lg font-semibold tracking-tight text-charcoal-900">ShopVue</router-link>
          <p class="mt-3 text-sm text-charcoal-500 leading-relaxed max-w-xs">Premium products, thoughtfully curated. Designed for those who appreciate quality.</p>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-4">Shop</h4>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">All Products</router-link></li>
            <li><router-link to="/cart" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">Cart</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-4">Account</h4>
          <ul class="space-y-3">
            <li><router-link to="/login" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">Sign In</router-link></li>
            <li><router-link to="/register" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">Register</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-4">Support</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">FAQ</a></li>
            <li><a href="#" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">Shipping</a></li>
            <li><a href="#" class="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">Returns</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-charcoal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-charcoal-400">&copy; {{ year }} ShopVue. All rights reserved.</p>
        <div class="flex gap-6 text-xs text-charcoal-400">
          <a href="#" class="hover:text-charcoal-600 transition-colors">Privacy</a>
          <a href="#" class="hover:text-charcoal-600 transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
