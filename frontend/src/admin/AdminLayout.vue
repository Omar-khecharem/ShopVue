<template>
  <div class="flex min-h-screen bg-charcoal-50">
    <aside class="w-56 bg-white border-r border-charcoal-200 fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-charcoal-200">
        <router-link to="/admin/dashboard" class="text-base font-semibold tracking-tight text-charcoal-900">ShopVue Admin</router-link>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors" :class="$route.path === item.path ? 'bg-charcoal-100 text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-50'">
          <component :is="item.icon" :size="16" />
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-3 border-t border-charcoal-200">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-900 rounded-xl hover:bg-charcoal-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          Store
        </router-link>
      </div>
    </aside>

    <div class="lg:pl-56 flex-1 min-w-0">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { h } from 'vue'

const route = useRoute()

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('rect', { x: 3, y: 3, width: 7, height: 7 }), h('rect', { x: 14, y: 3, width: 7, height: 7 }), h('rect', { x: 14, y: 14, width: 7, height: 7 }), h('rect', { x: 3, y: 14, width: 7, height: 7 })]) } },
  { path: '/admin/products', label: 'Products', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }), h('line', { x1: 3, y1: 6, x2: 21, y2: 6 }), h('path', { d: 'M16 10a4 4 0 0 1-8 0' })]) } },
  { path: '/admin/orders', label: 'Orders', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }), h('polyline', { points: '14 2 14 8 20 8' }), h('line', { x1: 16, y1: 13, x2: 8, y2: 13 }), h('line', { x1: 16, y1: 17, x2: 8, y2: 17 })]) } },
  { path: '/admin/homepage', label: 'Homepage', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }), h('polyline', { points: '9 22 9 12 15 12 15 22' })]) } },
  { path: '/admin/banners', label: 'Banners', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('rect', { x: 2, y: 3, width: 20, height: 14, rx: 2, ry: 2 }), h('line', { x1: 8, y1: 21, x2: 16, y2: 21 }), h('line', { x1: 12, y1: 17, x2: 12, y2: 21 })]) } },
  { path: '/admin/categories', label: 'Categories', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M4 4h6v6H4z' }), h('path', { d: 'M14 4h6v6h-6z' }), h('path', { d: 'M4 14h6v6H4z' }), h('path', { d: 'M14 14h6v6h-6z' })]) } },
  { path: '/admin/users', label: 'Users', icon: { render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }), h('circle', { cx: 9, cy: 7, r: 4 }), h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }), h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })]) } },
]
</script>
