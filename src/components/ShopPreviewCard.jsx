import { MapPin, Wifi, Coffee, Beer, Leaf, Clock, Pill, ShoppingBag } from 'lucide-react'
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
}

export default function ShopPreviewCard({ shop }) {
  if (!shop) return null

  const open = isOpen(shop.sundayHours, shop.isOpen)

  return (
    <div className="absolute top-4 right-4 z-[1000] w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 pointer-events-none animate-fade-in-up">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
          {shop.name}
        </h3>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {open ? 'Open Now' : 'Closed'}
          </span>
          <span className="text-sm text-gray-500">0.5 km</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3 text-gray-600">
        <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
        <span className="text-sm">{shop.address}</span>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {shop.category}
        </span>
      </div>

      {/* Tags */}
      {shop.tags && shop.tags.length > 0 && (
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {shop.tags.slice(0, 4).map((tag) => {
            const config = tagConfig[tag]
            if (!config) return null
            const IconComponent = config.icon
            return (
              <div key={tag} className="flex items-center gap-1 text-gray-400">
                <IconComponent size={14} />
                <span className="text-xs">{config.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Click hint */}
      <p className="text-xs text-gray-400 mt-3 text-center">Click marker for details</p>
    </div>
  )
}
