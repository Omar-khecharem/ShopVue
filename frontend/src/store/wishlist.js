import { reactive } from 'vue'

const wishlist = reactive({ items: [] })

export function toggleWishlist(product) {
  const idx = wishlist.items.findIndex(i => i._id === product._id)
  if (idx > -1) {
    wishlist.items.splice(idx, 1)
  } else {
    wishlist.items.push({ _id: product._id, name: product.name, price: product.price, images: product.images })
  }
}

export default wishlist
