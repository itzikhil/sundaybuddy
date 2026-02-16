import { X, Navigation, Star, Clock, MapPin } from 'lucide-react'
import { isOpen, getDirectionsUrl } from '../utils/timeUtils'

const tagIcons = {
  wifi: 'WiFi',
  parking: 'Parking',
  organic: 'Organic',
  vegan: 'Vegan',
  beer: 'Beer',
  snacks: 'Snacks',
  '24h': '24h',
  coffee: 'Coffee',
  newspapers: 'News',
  masks: 'Masks',
  vitamins: 'Vitamins',
  consultation: 'Consult',
  bakery: 'Bakery',
  deli: 'Deli',
  delivery: 'Delivery',
  emergency: 'Emergency',
  budget: 'Budget',
}

export default function ShopModal({ shop, onClose }) {
  if (!shop) return null

  const open = isOpen(shop.sundayHours)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star size={18} fill="currentColor" />
              <span className="font-semibold text-gray-900">{shop.rating}</span>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <Clock size={14} />
              {open ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-gray-500">{shop.sundayHours}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">0.5 km</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4 text-gray-600">
            <MapPin size={16} className="shrink-0 mt-0.5" />
            <span>{shop.address}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            {shop.description || 'A cozy local favorite serving fresh coffee and pastries...'}
          </p>

          {/* Tags */}
          {shop.tags && shop.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {shop.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tagIcons[tag] || tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Button */}
          <a
            href={getDirectionsUrl(shop.lat, shop.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            <Navigation size={18} />
            Navigate There
          </a>
        </div>
      </div>
    </div>
  )
}
