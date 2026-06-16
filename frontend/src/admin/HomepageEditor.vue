<template>
  <div class="p-6 sm:p-8 lg:p-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal-900">Homepage Builder</h1>
      <div class="flex gap-3">
        <button @click="openAdd" class="bg-charcoal-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Add Section</button>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="h-20 skeleton-pulse rounded-xl" />
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-charcoal-500 mb-4">{{ error }}</p>
      <button @click="fetchSections" class="text-sm font-medium underline underline-offset-4">Retry</button>
    </div>

    <div v-else-if="sections.length === 0" class="text-center py-24">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-charcoal-200 mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
      <p class="text-charcoal-400 mb-4">No sections yet.</p>
      <button @click="openAdd" class="bg-charcoal-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-charcoal-700 transition-all">Create your first section</button>
    </div>

    <div v-else class="space-y-3">
      <div v-for="(section, idx) in sections" :key="section._id" class="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm shadow-charcoal-900/5">
        <div class="flex flex-col gap-0.5 text-charcoal-300">
          <button @click="moveUp(idx)" :disabled="idx === 0" class="hover:text-charcoal-600 disabled:opacity-30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button @click="moveDown(idx)" :disabled="idx === sections.length - 1" class="hover:text-charcoal-600 disabled:opacity-30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-600">{{ section.type }}</span>
            <span class="text-sm font-medium text-charcoal-900 truncate">{{ section.title || section.subtitle || 'Untitled' }}</span>
          </div>
          <p class="text-xs text-charcoal-400 mt-0.5">Order: {{ section.order }}</p>
        </div>

        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="section.enabled" @change="toggleEnabled(section)" class="sr-only peer" />
          <div class="w-9 h-5 bg-charcoal-200 rounded-full peer peer-checked:bg-charcoal-900 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>

        <button @click="openEdit(section)" class="text-xs font-medium text-charcoal-500 hover:text-charcoal-900 transition-colors">Edit</button>
        <button @click="confirmDelete(section)" class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">Delete</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm overflow-y-auto" @click.self="closeForm">
        <div class="bg-white rounded-2xl w-full max-w-2xl my-8 p-6 sm:p-8 shadow-xl animate-fade-in">
          <h2 class="text-xl font-semibold text-charcoal-900 mb-6">{{ editing ? 'Edit Section' : 'New Section' }}</h2>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Section Type</label>
              <select v-model="form.type" :disabled="!!editing" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all">
                <option v-for="t in sectionTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Title</label><input v-model="form.title" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Subtitle</label><input v-model="form.subtitle" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
            </div>

            <div class="border-t border-charcoal-200 pt-4">
              <p class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">Content</p>

              <div v-if="form.type === 'hero'" class="space-y-3">
                <div v-for="(b, bi) in form.content.banners" :key="bi" class="bg-charcoal-50 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between"><span class="text-xs font-medium text-charcoal-600">Banner {{ bi + 1 }}</span><button @click="form.content.banners.splice(bi, 1)" class="text-xs text-red-500">Remove</button></div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Desktop Image URL</label><input v-model="b.desktopImage" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Mobile Image URL</label><input v-model="b.mobileImage" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Title</label><input v-model="b.title" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Subtitle</label><input v-model="b.subtitle" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Button Text</label><input v-model="b.buttonText" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Link</label><input v-model="b.link" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                </div>
                <button @click="form.content.banners.push({ desktopImage: '', mobileImage: '', title: '', subtitle: '', buttonText: 'Shop Now', link: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Banner</button>
              </div>

              <div v-else-if="['featured', 'best_sellers', 'trending', 'product_grid'].includes(form.type)" class="space-y-3">
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Product IDs (comma-separated, or leave blank for auto)</label><input v-model="productIds" placeholder="_id1, _id2, _id3" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Limit (auto mode)</label><input v-model.number="form.content.limit" type="number" min="1" max="20" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
              </div>

              <div v-else-if="form.type === 'social_proof'" class="space-y-3">
                <div v-for="(s, si) in form.content.stats" :key="si" class="bg-charcoal-50 rounded-xl p-4 flex items-center gap-3">
                  <div class="flex-1"><input v-model="s.value" placeholder="Value" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <div class="flex-1"><input v-model="s.label" placeholder="Label" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <button @click="form.content.stats.splice(si, 1)" class="text-xs text-red-500">X</button>
                </div>
                <button @click="form.content.stats.push({ value: '', label: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Stat</button>
              </div>

              <div v-else-if="form.type === 'testimonials'" class="space-y-3">
                <div v-for="(t, ti) in form.content.testimonials" :key="ti" class="bg-charcoal-50 rounded-xl p-4 space-y-2">
                  <div class="grid grid-cols-2 gap-3">
                    <div><input v-model="t.name" placeholder="Name" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><input v-model="t.title" placeholder="Title" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div><textarea v-model="t.text" placeholder="Testimonial text" rows="2" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200 resize-none" /></div>
                  <div class="flex items-center gap-2"><span class="text-[10px] text-charcoal-400">Rating:</span><input v-model.number="t.rating" type="number" min="1" max="5" class="w-16 px-2 py-1 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <button @click="form.content.testimonials.splice(ti, 1)" class="text-xs text-red-500">Remove</button>
                </div>
                <button @click="form.content.testimonials.push({ name: '', title: '', text: '', rating: 5 })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Testimonial</button>
              </div>

              <div v-else-if="form.type === 'benefits'" class="space-y-3">
                <div v-for="(b, bi) in form.content.benefits" :key="bi" class="bg-charcoal-50 rounded-xl p-4 space-y-2">
                  <div class="grid grid-cols-2 gap-3">
                    <div><input v-model="b.title" placeholder="Title" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><input v-model="b.icon" placeholder="SVG icon HTML" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div><textarea v-model="b.text" placeholder="Description" rows="2" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200 resize-none" /></div>
                  <button @click="form.content.benefits.splice(bi, 1)" class="text-xs text-red-500">Remove</button>
                </div>
                <button @click="form.content.benefits.push({ title: '', text: '', icon: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Benefit</button>
              </div>

              <div v-else-if="form.type === 'faq'" class="space-y-3">
                <div v-for="(f, fi) in form.content.faqs" :key="fi" class="bg-charcoal-50 rounded-xl p-4 space-y-2">
                  <div><input v-model="f.q" placeholder="Question" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <div><textarea v-model="f.a" placeholder="Answer" rows="2" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200 resize-none" /></div>
                  <button @click="form.content.faqs.splice(fi, 1)" class="text-xs text-red-500">Remove</button>
                </div>
                <button @click="form.content.faqs.push({ q: '', a: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add FAQ</button>
              </div>

              <div v-else-if="form.type === 'brands'" class="space-y-3">
                <div v-for="(b, bi) in form.content.brands" :key="bi" class="bg-charcoal-50 rounded-xl p-4 flex items-center gap-3">
                  <div class="flex-1"><input v-model="b.name" placeholder="Brand name" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <div class="flex-1"><input v-model="b.logo" placeholder="Logo URL" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  <button @click="form.content.brands.splice(bi, 1)" class="text-xs text-red-500">X</button>
                </div>
                <button @click="form.content.brands.push({ name: '', logo: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Brand</button>
              </div>

              <div v-else-if="form.type === 'banner_carousel'" class="space-y-3">
                <div v-for="(b, bi) in form.content.banners" :key="bi" class="bg-charcoal-50 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between"><span class="text-xs font-medium text-charcoal-600">Banner {{ bi + 1 }}</span><button @click="form.content.banners.splice(bi, 1)" class="text-xs text-red-500">Remove</button></div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Desktop Image URL</label><input v-model="b.desktopImage" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><label class="text-[10px] font-semibold uppercase text-charcoal-400">Mobile Image URL</label><input v-model="b.mobileImage" class="w-full mt-1 px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><input v-model="b.title" placeholder="Title" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><input v-model="b.subtitle" placeholder="Subtitle" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div><input v-model="b.buttonText" placeholder="Button" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                    <div><input v-model="b.link" placeholder="Link URL" class="w-full px-3 py-2 bg-white rounded-lg text-xs outline-none border border-charcoal-200" /></div>
                  </div>
                </div>
                <button @click="form.content.banners.push({ desktopImage: '', mobileImage: '', title: '', subtitle: '', buttonText: 'Shop Now', link: '' })" class="text-xs font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">+ Add Banner</button>
              </div>

              <div v-else-if="form.type === 'promo_block'" class="space-y-3">
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Title</label><input v-model="form.content.title" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Text</label><textarea v-model="form.content.text" rows="3" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all resize-none" /></div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Button Text</label><input v-model="form.content.buttonText" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                  <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Link URL</label><input v-model="form.content.link" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                </div>
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Background Image URL</label><input v-model="form.content.backgroundImage" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                <label class="flex items-center gap-2 text-sm text-charcoal-600"><input type="checkbox" v-model="form.content.darkMode" class="rounded" /> Dark mode</label>
              </div>

              <div v-else-if="form.type === 'custom_html'" class="space-y-3">
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">HTML</label><textarea v-model="form.content.html" rows="6" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all resize-none" /></div>
              </div>

              <div v-else-if="form.type === 'newsletter'" class="space-y-3">
                <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Text</label><textarea v-model="form.content.text" rows="2" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all resize-none" /></div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Button Text</label><input v-model="form.content.buttonText" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                  <div><label class="text-xs font-semibold uppercase tracking-widest text-charcoal-400 block mb-1.5">Disclaimer</label><input v-model="form.content.disclaimer" class="w-full px-4 py-3 bg-charcoal-50 rounded-xl text-sm outline-none focus:bg-white focus:border focus:border-charcoal-300 transition-all" /></div>
                </div>
              </div>
            </div>

            <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>

            <div class="flex justify-end gap-3 pt-4 border-t border-charcoal-200">
              <button type="button" @click="closeForm" class="px-6 py-2.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">Cancel</button>
              <button @click="handleSubmit" :disabled="submitting" class="px-6 py-2.5 bg-charcoal-900 text-white rounded-full text-sm font-medium hover:bg-charcoal-700 disabled:opacity-50 transition-all">{{ submitting ? 'Saving…' : editing ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" @click.self="deleting = null">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 sm:p-8 shadow-xl animate-fade-in text-center">
          <p class="text-charcoal-900">Delete "<strong>{{ deleting.title || deleting.subtitle || deleting.type }}</strong>"?</p>
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
import { ref, reactive, onMounted, watch } from 'vue'
import api from '../services/api.js'
import { useToast } from '../store/toast.js'

const { show } = useToast()
const sections = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const editing = ref(null)
const submitting = ref(false)
const formError = ref(null)
const deleting = ref(null)
const productIds = ref('')

const form = reactive({ type: 'hero', title: '', subtitle: '', content: {} })

const sectionTypes = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'featured', label: 'Featured Products' },
  { value: 'best_sellers', label: 'Best Sellers' },
  { value: 'trending', label: 'Trending' },
  { value: 'product_grid', label: 'Custom Product Grid' },
  { value: 'social_proof', label: 'Social Proof / Stats' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'benefits', label: 'Benefits / Why Choose Us' },
  { value: 'faq', label: 'FAQ Accordion' },
  { value: 'newsletter', label: 'Newsletter Signup' },
  { value: 'brands', label: 'Brand Logos' },
  { value: 'banner_carousel', label: 'Banner Carousel' },
  { value: 'promo_block', label: 'Promotional Block' },
  { value: 'custom_html', label: 'Custom HTML' },
]

watch(() => form.type, () => {
  if (!editing.value) {
    form.content = getDefaultContent(form.type)
    productIds.value = ''
  }
})

function getDefaultContent(type) {
  switch (type) {
    case 'hero': return { banners: [{ desktopImage: '', mobileImage: '', title: '', subtitle: '', buttonText: 'Shop Now', link: '' }] }
    case 'featured':
    case 'best_sellers':
    case 'trending':
    case 'product_grid': return { productIds: [], limit: 4 }
    case 'social_proof': return { stats: [{ value: '10K+', label: 'Happy Customers' }, { value: '4.8', label: 'Rating' }, { value: '500+', label: 'Products' }, { value: '99%', label: 'Satisfaction' }] }
    case 'testimonials': return { testimonials: [{ name: 'Customer', title: 'Verified Buyer', text: 'Great product!', rating: 5 }] }
    case 'benefits': return { benefits: [{ title: 'Benefit', text: 'Description', icon: '' }] }
    case 'faq': return { faqs: [{ q: 'Question?', a: 'Answer.' }] }
    case 'brands': return { brands: [{ name: 'Brand', logo: '' }] }
    case 'banner_carousel': return { banners: [{ desktopImage: '', mobileImage: '', title: '', subtitle: '', buttonText: 'Shop Now', link: '' }] }
    case 'promo_block': return { title: '', text: '', buttonText: 'Learn More', link: '', backgroundImage: '', darkMode: true }
    case 'custom_html': return { html: '' }
    case 'newsletter': return { text: '', buttonText: 'Subscribe', disclaimer: 'No spam. Unsubscribe anytime.' }
    default: return {}
  }
}

async function fetchSections() {
  loading.value = true; error.value = null
  try { const { data } = await api.get('/homepage/admin'); sections.value = data.data }
  catch (err) { error.value = err.response?.data?.message || 'Failed to load' }
  finally { loading.value = false }
}

onMounted(fetchSections)

async function saveReorder() {
  const orderMap = {}
  sections.value.forEach((s, i) => { orderMap[s._id] = i })
  try { await api.put('/homepage/reorder', { orderMap }) }
  catch { show('Reorder failed', 'error') }
}

function moveUp(idx) {
  if (idx === 0) return
  ;[sections.value[idx - 1], sections.value[idx]] = [sections.value[idx], sections.value[idx - 1]]
  saveReorder()
}

function moveDown(idx) {
  if (idx === sections.value.length - 1) return
  ;[sections.value[idx], sections.value[idx + 1]] = [sections.value[idx + 1], sections.value[idx]]
  saveReorder()
}

async function toggleEnabled(section) {
  const enabled = !section.enabled
  try {
    await api.put(`/homepage/${section._id}`, { enabled })
    section.enabled = enabled
    show(enabled ? 'Section enabled' : 'Section disabled')
  } catch { show('Toggle failed', 'error') }
}

function openAdd() {
  editing.value = null
  form.type = 'hero'
  form.title = ''
  form.subtitle = ''
  form.content = getDefaultContent('hero')
  productIds.value = ''
  formError.value = null
  showForm.value = true
}

function openEdit(section) {
  editing.value = section
  form.type = section.type
  form.title = section.title || ''
  form.subtitle = section.subtitle || ''
  form.content = JSON.parse(JSON.stringify(section.content || {}))
  productIds.value = (form.content.productIds || []).join(', ')
  formError.value = null
  showForm.value = true
}

function closeForm() { showForm.value = false; editing.value = null }

function buildPayload() {
  const payload = {
    type: form.type,
    title: form.title,
    subtitle: form.subtitle,
    content: JSON.parse(JSON.stringify(form.content)),
  }
  if (['featured', 'best_sellers', 'trending', 'product_grid'].includes(form.type)) {
    payload.content.productIds = productIds.value ? productIds.value.split(',').map(s => s.trim()).filter(Boolean) : []
  }
  return payload
}

async function handleSubmit() {
  submitting.value = true; formError.value = null
  try {
    const payload = buildPayload()
    if (editing.value) {
      await api.put(`/homepage/${editing.value._id}`, payload)
      show('Section updated')
    } else {
      await api.post('/homepage', payload)
      show('Section created')
    }
    closeForm(); fetchSections()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Save failed'
  } finally { submitting.value = false }
}

function confirmDelete(section) { deleting.value = section }

async function handleDelete() {
  submitting.value = true
  try {
    await api.delete(`/homepage/${deleting.value._id}`)
    show('Section deleted'); deleting.value = null; fetchSections()
  } catch (err) { show(err.response?.data?.message || 'Delete failed', 'error') }
  finally { submitting.value = false }
}
</script>
