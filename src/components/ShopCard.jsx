import { Navigation } from 'lucide-react'
import { isOpen, getDirectionsUrl } from '../utils/timeUtils'

const categoryStyles = {
  Supermarket: 'bg-emerald-100 text-emerald-800',
  Späti: 'bg-amber-100 text-amber-800',
  Pharmacy: 'bg-red-100 text-red-800',
}

export default function ShopCard({ shop, isSelected, onClick }) {
  const open = isOpen(shop.sundayHours, shop.isOpen)

  const handleDirections = (e) => {
    e.stopPropagation()
    window.open(getDirectionsUrl(shop.lat, shop.lng), '_blank')
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{shop.name}</h3>
        <span
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
            open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}
          />
          {open ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            categoryStyles[shop.category] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {shop.category}
        </span>
        <span className="text-xs text-gray-500">{shop.sundayHours}</span>
      </div>

      <p className="text-sm text-gray-500 mb-3">{shop.address}</p>

      <button
        onClick={handleDirections}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Navigation size={14} />
        Get Directions
      </button>
    </div>
  )
}
