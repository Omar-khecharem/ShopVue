<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Categories</h1>
      <button @click="openCreate" class="bg-charcoal-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Add Category</button>
    </div>

    <div v-if="loading" class="space-y-4"><div v-for="n in 3" :key="n" class="h-16 skeleton-pulse rounded-xl" /></div>
    <div v-else-if="error" class="text-center py-16"><p class="text-charcoal-500 mb-4">{{ error }}</p><button @click="fetchCategories" class="text-sm font-medium underline underline-offset-4">Retry</button></div>
    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5">
      <table class="w-full text-sm">
        <thead><tr class="border-b border-charcoal-200"><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Name</th><th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden md:table-cell">Description</th><th class="text-right px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Actions</th></tr></thead>
        <tbody>
          <tr v-for="c in categories" :key="c._id" class="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors">
            <td class="px-5 py-4 font-medium text-charcoal-900">{{ c.name }}</td>
            <td class="px-5 py-4 text-charcoal-500 hidden md:table-cell truncate max-w-xs">{{ c.description || '—' }}</td>
            <td class="px-5 py-4 text-right">
              <button @click="openEdit(c)" class="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 transition-colors mr-4">Edit</button>
              <button @click="confirmDelete(c)" class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" @click.self="closeForm">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">{{ editing ? 'Edit Category' : 'New Category' }}</h2>
          <div class="space-y-4">
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Name</label><input v-model="form.name" required class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Description</label><textarea v-model="form.description" rows="3" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 resize-none" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Image URL</label><input v-model="form.image" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300" /></div>
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
          <p class="text-charcoal-900">Delete "<strong>{{ deleting.name }}</strong>"?</p>
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
const categories = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const editing = ref(null)
const submitting = ref(false)
const formError = ref(null)
const deleting = ref(null)

const form = reactive({ name: '', description: '', image: '' })

async function fetchCategories() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/categories'); categories.value = data.data }
  catch (err) { error.value = err.response?.data?.message || 'Failed' }
  finally { loading.value = false }
}

onMounted(fetchCategories)

function resetForm() { form.name = ''; form.description = ''; form.image = '' }
function openCreate() { resetForm(); editing.value = null; formError.value = null; showForm.value = true }
function openEdit(c) { editing.value = c; form.name = c.name; form.description = c.description || ''; form.image = c.image || ''; formError.value = null; showForm.value = true }
function closeForm() { showForm.value = false; editing.value = null }

async function handleSubmit() {
  submitting.value = true; formError.value = null
  try {
    if (editing.value) { await api.put(`/categories/${editing.value._id}`, { name: form.name, description: form.description, image: form.image }); show('Category updated') }
    else { await api.post('/categories', { name: form.name, description: form.description, image: form.image }); show('Category created') }
    closeForm(); fetchCategories()
  } catch (err) { formError.value = err.response?.data?.message || 'Save failed' }
  finally { submitting.value = false }
}

function confirmDelete(c) { deleting.value = c }
async function handleDelete() {
  submitting.value = true
  try { await api.delete(`/categories/${deleting.value._id}`); show('Category deleted'); deleting.value = null; fetchCategories() }
  catch (err) { show(err.response?.data?.message || 'Delete failed', 'error') }
  finally { submitting.value = false }
}
</script>
