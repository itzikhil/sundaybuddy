const categoryImages = {
  // Shopping
  supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
  convenience: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  pharmacy: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
  kiosk: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800',

  // Family Attractions
  kid_cafe: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
  petting_zoo: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800',
  indoor_play: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&q=80&w=800',
  museum: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800'

/**
 * Returns a placeholder image URL based on shop category
 * @param {string} category - The shop category
 * @returns {string} - URL of the placeholder image
 */
export function getPlaceholderImage(category) {
  if (!category) return DEFAULT_IMAGE

  const normalizedCategory = category.toLowerCase().trim().replace(/\s+/g, '_')
  return categoryImages[normalizedCategory] || DEFAULT_IMAGE
}

/**
 * Returns the shop image, falling back to category placeholder if missing
 * @param {object} shop - The shop object
 * @returns {string} - URL of the image to display
 */
export function getShopImage(shop) {
  if (shop.image_url && shop.image_url.trim()) {
    return shop.image_url
  }
  if (shop.image && shop.image.trim() && !shop.image.includes('unsplash')) {
    return shop.image
  }
  return getPlaceholderImage(shop.category)
}
