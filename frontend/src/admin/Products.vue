<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Products</h1>
      <button @click="openCreate" class="bg-charcoal-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Add Product</button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="h-16 skeleton-pulse rounded-xl" />
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchProducts" class="text-sm font-medium underline underline-offset-4">Retry</button>
    </div>

    <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm shadow-charcoal-900/5">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-charcoal-200">
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Product</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden sm:table-cell">Price</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden md:table-cell">Stock</th>
            <th class="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400 hidden lg:table-cell">Category</th>
            <th class="text-right px-5 py-4 text-xs font-semibold uppercase tracking-widest text-charcoal-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p._id" class="border-b border-charcoal-100 hover:bg-charcoal-50 transition-colors">
            <td class="px-5 py-4 flex items-center gap-3 font-medium text-charcoal-900">
              <img v-if="p.images?.length" :src="p.images[0]" class="w-10 h-10 object-cover rounded-lg" />
              <span class="truncate">{{ p.name }}</span>
            </td>
            <td class="px-5 py-4 text-charcoal-700 hidden sm:table-cell tabular-nums">${{ p.price.toFixed(2) }}</td>
            <td class="px-5 py-4 hidden md:table-cell"><span :class="p.stock === 0 ? 'text-red-500 font-medium' : p.stock < 5 ? 'text-amber-600' : 'text-charcoal-700'">{{ p.stock }}</span></td>
            <td class="px-5 py-4 text-charcoal-500 hidden lg:table-cell">{{ p.category?.name || '—' }}</td>
            <td class="px-5 py-4 text-right">
              <button @click="openEdit(p)" class="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 transition-colors mr-4">Edit</button>
              <button @click="confirmDelete(p)" class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
          <tr v-if="products.length === 0"><td colspan="5" class="px-5 py-16 text-center text-charcoal-400">No products.</td></tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" @click.self="closeForm">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl animate-fade-in">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">{{ editing ? 'Edit Product' : 'New Product' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Name</label><input v-model="form.name" required class="mt-1.5 w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Price</label><input v-model.number="form.price" type="number" step="0.01" min="0" required class="mt-1.5 w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Stock</label><input v-model.number="form.stock" type="number" min="0" required class="mt-1.5 w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            </div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Category ID</label><input v-model="form.category" class="mt-1.5 w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Description</label><textarea v-model="form.description" rows="3" required class="mt-1.5 w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all resize-none" /></div>
            <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400">Images</label><input type="file" multiple accept="image/*" @change="handleFiles" class="mt-1.5 text-sm text-charcoal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-charcoal-100 file:text-charcoal-700 hover:file:bg-charcoal-200 transition-all" /></div>
            <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeForm" class="px-6 py-2.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">Cancel</button>
              <button type="submit" :disabled="submitting" class="px-6 py-2.5 bg-charcoal-900 text-white rounded-full text-sm font-medium hover:bg-charcoal-700 disabled:opacity-50 transition-all">{{ submitting ? 'Saving…' : editing ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" @click.self="deleting = null">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 sm:p-8 shadow-xl animate-fade-in text-center">
          <p class="text-charcoal-900">Delete <strong>{{ deleting.name }}</strong>?</p>
          <p class="mt-1 text-sm text-charcoal-500">This action cannot be undone.</p>
          <div class="mt-6 flex justify-center gap-3">
            <button @click="deleting = null" class="px-6 py-2.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">Cancel</button>
            <button @click="handleDelete" :disabled="submitting" class="px-6 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-all">{{ submitting ? 'Deleting…' : 'Delete' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { useToast } from '../store/toast.js'

const { show } = useToast()
const products = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const editing = ref(null)
const submitting = ref(false)
const formError = ref(null)
const form = ref({ name: '', price: 0, stock: 0, category: '', description: '' })
const files = ref([])
const deleting = ref(null)

async function fetchProducts() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/products'); products.value = data.data }
  catch (err) { error.value = err.response?.data?.message || 'Failed' }
  finally { loading.value = false }
}

onMounted(fetchProducts)

function handleFiles(e) { files.value = Array.from(e.target.files) }
function resetForm() { form.value = { name: '', price: 0, stock: 0, category: '', description: '' }; files.value = []; formError.value = null; editing.value = null }
function openCreate() { resetForm(); showForm.value = true }
function openEdit(p) { editing.value = p; form.value = { name: p.name, price: p.price, stock: p.stock, category: p.category?._id || p.category || '', description: p.description }; files.value = []; formError.value = null; showForm.value = true }
function closeForm() { showForm.value = false; resetForm() }

async function handleSubmit() {
  submitting.value = true; formError.value = null
  const fd = new FormData()
  fd.append('name', form.value.name)
  fd.append('price', form.value.price)
  fd.append('stock', form.value.stock)
  fd.append('description', form.value.description)
  if (form.value.category) fd.append('category', form.value.category)
  for (const f of files.value) fd.append('images', f)
  try {
    if (editing.value) { await api.put(`/products/${editing.value._id}`, fd); show('Product updated') }
    else { await api.post('/products', fd); show('Product created') }
    closeForm(); fetchProducts()
  } catch (err) { formError.value = err.response?.data?.message || 'Save failed' }
  finally { submitting.value = false }
}

function confirmDelete(p) { deleting.value = p }

async function handleDelete() {
  submitting.value = true
  try { await api.delete(`/products/${deleting.value._id}`); show('Product deleted'); deleting.value = null; fetchProducts() }
  catch (err) { show(err.response?.data?.message || 'Delete failed', 'error') }
  finally { submitting.value = false }
}
</script>
