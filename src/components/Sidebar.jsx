import ShopList from './ShopList'

export default function Sidebar({
  shops,
  selectedShop,
  onShopSelect,
  searchQuery,
  onSearchChange,
  showOpenOnly,
  onToggleOpenOnly,
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search and Filter Section */}
      <div className="p-4 bg-white shadow-md z-10 sticky top-0">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for 'Rewe'..."
          className="border border-gray-300 rounded-lg p-2 w-full"
        />

        {/* Open Now Toggle */}
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => onToggleOpenOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Open Now</span>
        </label>
      </div>

      {/* Shop Count */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <span className="text-sm text-gray-600">
          {shops.length} shop{shops.length !== 1 ? 's' : ''} open on Sunday
        </span>
      </div>

      {/* Scrollable Shop List */}
      <div className="flex-1 overflow-y-auto">
        <ShopList
          shops={shops}
          selectedShop={selectedShop}
          onShopSelect={onShopSelect}
        />
      </div>
    </div>
  )
}
