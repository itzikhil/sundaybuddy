import { useNavigate } from 'react-router-dom'
import { X, ExternalLink, Star, Clock, MapPin, Wifi, Coffee, Beer, Leaf, Pill, ShoppingBag, Car, Newspaper } from 'lucide-react'
import { isOpen } from '../utils/timeUtils'

const tagConfig = {
  wifi: { icon: Wifi, label: 'WiFi' },
  coffee: { icon: Coffee, label: 'Coffee' },
  beer: { icon: Beer, label: 'Beer' },
  vegan: { icon: Leaf, label: 'Vegan' },
  organic: { icon: Leaf, label: 'Organic' },
  '24h': { icon: Clock, label: '24h' },
  masks: { icon: Pill, label: 'Masks' },
  vitamins: { icon: Pill, label: 'Vitamins' },
  snacks: { icon: ShoppingBag, label: 'Snacks' },
  parking: { icon: Car, label: 'Parking' },
  newspapers: { icon: Newspaper, label: 'News' },
  consultation: { icon: Pill, label: 'Consult' },
  bakery: { icon: Coffee, label: 'Bakery' },
  deli: { icon: ShoppingBag, label: 'Deli' },
  delivery: { icon: Car, label: 'Delivery' },
  emergency: { icon: Pill, label: 'Emergency' },
  budget: { icon: ShoppingBag, label: 'Budget' },
}

export default function ShopModal({ shop, onClose }) {
  const navigate = useNavigate()

  if (!shop) return null

  const open = isOpen(shop.sundayHours, shop.isOpen)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleMoreDetails = () => {
    onClose()
    navigate(`/place/${shop.id}`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Hero Image */}
        <div className="relative h-56 flex-shrink-0">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-amber-800 text-sm font-medium rounded-full">
              {shop.category}
            </span>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header: Title & Rating */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{shop.name}</h2>
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full shrink-0">
              <Star size={18} className="text-amber-500" fill="currentColor" />
              <span className="font-bold text-gray-900">{shop.rating}</span>
            </div>
          </div>

          {/* Status & Hours */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}
              />
              {open ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-gray-500 text-sm">{shop.sundayHours}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            <MapPin size={20} className="text-red-500 shrink-0 mt-0.5" />
            <span className="text-gray-700">{shop.address || 'Address not available'}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-5">
            {shop.description}
          </p>

          {/* Tags */}
          {shop.tags && shop.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {shop.tags.map((tag) => {
                const config = tagConfig[tag]
                const IconComponent = config?.icon
                return (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-full"
                  >
                    {IconComponent && <IconComponent size={14} />}
                    {config?.label || tag}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Fixed Action Button */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleMoreDetails}
            className="flex items-center justify-center gap-2 w-full bg-[#784f33] hover:bg-[#5d3d28] text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-lg"
          >
            <ExternalLink size={20} />
            More Details
          </button>
        </div>
      </div>
    </div>
  )
}
