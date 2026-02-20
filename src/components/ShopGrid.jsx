import { Heart, Star, Search, Wifi, Coffee, Beer, Leaf, Clock, Pill, ShoppingBag } from 'lucide-react'
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

function ShopGridCard({ shop, onClick }) {
  const open = isOpen(shop.sundayHours, shop.isOpen)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
        >
          <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        {/* Open/Closed Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
              open ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-200' : 'bg-gray-400'}`}
            />
            {open ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title & Rating Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">
            {shop.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold text-gray-900 text-sm">{shop.rating}</span>
          </div>
        </div>

        {/* Category */}
        <span className="inline-block text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mb-2">
          {shop.category}
        </span>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
          {shop.description}
        </p>

        {/* Tags Row */}
        {shop.tags && shop.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {shop.tags.slice(0, 4).map((tag) => {
              const config = tagConfig[tag]
              if (!config) return null
              const IconComponent = config.icon
              return (
                <div key={tag} className="flex items-center gap-1 text-gray-400">
                  <IconComponent size={14} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopGrid({ shops, onShopSelect, searchQuery, onSearchChange, showOpenOnly, onToggleOpenOnly }) {
  return (
    <div className="h-full w-full bg-gray-50 overflow-hidden flex flex-col">
      {/* Spacer for view toggle */}
      <div className="h-14 flex-shrink-0" />

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow text-sm"
            />
          </div>
          <button
            onClick={() => onToggleOpenOnly(!showOpenOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              showOpenOnly
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Open Now
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <ShopGridCard
              key={shop.id}
              shop={shop}
              onClick={() => onShopSelect(shop)}
            />
          ))}
        </div>

        {/* Empty State */}
        {shops.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingBag size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">No shops found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
