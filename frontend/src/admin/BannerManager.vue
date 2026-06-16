<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Banners</h1>
      <button @click="openCreate" class="bg-charcoal-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Add Banner</button>
    </div>

    <div v-if="loading" class="space-y-4"><div v-for="n in 3" :key="n" class="h-20 skeleton-pulse rounded-xl" /></div>
    <div v-else-if="error" class="text-center py-16"><p class="text-charcoal-500 mb-4">{{ error }}</p><button @click="fetchBanners" class="text-sm font-medium underline underline-offset-4">Retry</button></div>
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-charcoal-200">
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Title</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden md:table-cell">Schedule</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Active</th>
            <th class="text-right px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in banners" :key="b._id" class="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors">
            <td class="px-5 py-4 font-medium text-charcoal-900">{{ b.title || 'Untitled' }}</td>
            <td class="px-5 py-4 text-charcoal-500 hidden md:table-cell text-xs">{{ formatDate(b.publishedAt) }} – {{ formatDate(b.expiresAt) }}</td>
            <td class="px-5 py-4"><span :class="b.enabled && isActive(b) ? 'text-emerald-600 font-medium' : 'text-charcoal-400'">{{ b.enabled && isActive(b) ? 'Active' : 'Inactive' }}</span></td>
            <td class="px-5 py-4 text-right">
              <button @click="openEdit(b)" class="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 transition-colors mr-4">Edit</button>
              <button @click="confirmDelete(b)" class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm overflow-y-auto" @click.self="closeForm">
        <div class="bg-white rounded-2xl w-full max-w-lg my-8 p-6 sm:p-8 shadow-xl">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">{{ editing ? 'Edit Banner' : 'New Banner' }}</h2>
          <div class="space-y-4">
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Title</label><input v-model="form.title" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Subtitle</label><input v-model="form.subtitle" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Desktop Image URL</label><input v-model="form.desktopImage" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Mobile Image URL</label><input v-model="form.mobileImage" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Button Text</label><input v-model="form.buttonText" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Link URL</label><input v-model="form.link" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Publish At</label><input v-model="form.publishedAt" type="datetime-local" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Expires At</label><input v-model="form.expiresAt" type="datetime-local" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            </div>
            <label class="flex items-center gap-2 text-sm text-charcoal-600"><input type="checkbox" v-model="form.enabled" class="rounded" /> Enabled</label>
            <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
            <div class="flex justify-end gap-3 pt-4 border-t border-charcoal-200">
              <button @click="closeForm" class="px-6 py-2.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900">Cancel</button>
              <button @click="handleSubmit" :disabled="submitting" class="px-6 py-2.5 bg-charcoal-900 text-white rounded-full text-sm font-medium hover:bg-charcoal-700 disabled:opacity-50">{{ submitting ? 'Saving…' : editing ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" @click.self="deleting = null">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
          <p class="text-charcoal-900">Delete "<strong>{{ deleting.title || 'this banner' }}</strong>"?</p>
          <div class="mt-6 flex justify-center gap-3">
            <button @click="deleting = null" class="px-6 py-2.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900">Cancel</button>
            <button @click="handleDelete" :disabled="submitting" class="px-6 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium disabled:opacity-50">{{ submitting ? 'Deleting…' : 'Delete' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api.js'
import { useToast } from '../store/toast.js'

const { show } = useToast()
const banners = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const editing = ref(null)
const submitting = ref(false)
const formError = ref(null)
const deleting = ref(null)

const form = reactive({
  title: '', subtitle: '', desktopImage: '', mobileImage: '',
  buttonText: 'Shop Now', link: '', publishedAt: '', expiresAt: '', enabled: true,
})

function isActive(b) {
  const now = new Date()
  if (b.publishedAt && new Date(b.publishedAt) > now) return false
  if (b.expiresAt && new Date(b.expiresAt) < now) return false
  return true
}

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }

async function fetchBanners() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/banners/admin'); banners.value = data.data }
  catch (err) { error.value = err.response?.data?.message || 'Failed' }
  finally { loading.value = false }
}

onMounted(fetchBanners)

function resetForm() {
  form.title = ''; form.subtitle = ''; form.desktopImage = ''; form.mobileImage = ''
  form.buttonText = 'Shop Now'; form.link = ''; form.publishedAt = ''; form.expiresAt = ''; form.enabled = true
}

function openCreate() { resetForm(); editing.value = null; formError.value = null; showForm.value = true }
function openEdit(b) {
  editing.value = b
  form.title = b.title || ''; form.subtitle = b.subtitle || ''
  form.desktopImage = b.desktopImage || ''; form.mobileImage = b.mobileImage || ''
  form.buttonText = b.buttonText || 'Shop Now'; form.link = b.link || ''
  form.publishedAt = b.publishedAt ? new Date(b.publishedAt).toISOString().slice(0, 16) : ''
  form.expiresAt = b.expiresAt ? new Date(b.expiresAt).toISOString().slice(0, 16) : ''
  form.enabled = b.enabled
  formError.value = null; showForm.value = true
}
function closeForm() { showForm.value = false; editing.value = null }

async function handleSubmit() {
  submitting.value = true; formError.value = null
  const payload = {
    title: form.title, subtitle: form.subtitle,
    desktopImage: form.desktopImage, mobileImage: form.mobileImage,
    buttonText: form.buttonText, link: form.link, enabled: form.enabled,
    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
  }
  try {
    if (editing.value) { await api.put(`/banners/${editing.value._id}`, payload); show('Banner updated') }
    else { await api.post('/banners', payload); show('Banner created') }
    closeForm(); fetchBanners()
  } catch (err) { formError.value = err.response?.data?.message || 'Save failed' }
  finally { submitting.value = false }
}

function confirmDelete(b) { deleting.value = b }
async function handleDelete() {
  submitting.value = true
  try { await api.delete(`/banners/${deleting.value._id}`); show('Banner deleted'); deleting.value = null; fetchBanners() }
  catch (err) { show(err.response?.data?.message || 'Delete failed', 'error') }
  finally { submitting.value = false }
}
</script>
