<template>
  <Teleport to="body">
    <div class="fixed bottom-6 left-6 z-50 space-y-3 pointer-events-none">
      <TransitionGroup name="social-proof">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="bg-white rounded-2xl p-4 pl-4 pr-6 shadow-xl shadow-charcoal-900/10 flex items-center gap-4 pointer-events-auto max-w-sm border border-charcoal-100"
        >
          <div class="w-10 h-10 rounded-full bg-charcoal-100 flex items-center justify-center text-xs font-semibold text-charcoal-600 flex-shrink-0">{{ n.initials }}</div>
          <div class="min-w-0">
            <p class="text-sm text-charcoal-700 leading-snug">
              <strong>{{ n.person }}</strong> in <strong>{{ n.location }}</strong>
            </p>
            <p class="text-xs text-charcoal-400">purchased {{ n.product }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])

const people = [
  { name: 'Sarah M.', location: 'New York', initials: 'SM' },
  { name: 'James K.', location: 'Los Angeles', initials: 'JK' },
  { name: 'Emily R.', location: 'Chicago', initials: 'ER' },
  { name: 'Michael T.', location: 'Austin', initials: 'MT' },
  { name: 'Lisa W.', location: 'Portland', initials: 'LW' },
  { name: 'David C.', location: 'Denver', initials: 'DC' },
]

const products = [
  'Wireless Headphones', 'Minimalist Watch', 'Leather Backpack',
  'Desk Lamp', 'Canvas Sneakers', 'Ceramic Mug Set',
  'Bamboo Organizer', 'Cotton T-Shirt', 'Denim Jacket',
]

let idCounter = 0
let interval = null

function addNotification() {
  const person = people[Math.floor(Math.random() * people.length)]
  const product = products[Math.floor(Math.random() * products.length)]
  const n = { id: ++idCounter, ...person, product }
  notifications.value.push(n)
  setTimeout(() => {
    notifications.value = notifications.value.filter(x => x.id !== n.id)
  }, 5000)
}

onMounted(() => {
  addNotification()
  interval = setInterval(addNotification, 25000 + Math.random() * 30000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.social-proof-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.social-proof-leave-active {
  transition: all 0.3s ease;
}
.social-proof-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
.social-proof-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
.social-proof-move {
  transition: transform 0.3s ease;
}
</style>
