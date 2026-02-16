const categoryStyles = {
  Supermarket: 'bg-emerald-100 text-emerald-800',
  Späti: 'bg-amber-100 text-amber-800',
  Pharmacy: 'bg-red-100 text-red-800',
}

export default function ShopCard({ shop, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{shop.name}</h3>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            categoryStyles[shop.category] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {shop.category}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
          {shop.sundayHours}
        </span>
      </div>

      <p className="text-sm text-gray-500">{shop.address}</p>
    </div>
  )
}
