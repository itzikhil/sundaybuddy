import ShopCard from './ShopCard'

export default function ShopList({ shops, selectedShop, onShopSelect }) {
  if (shops.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No shops found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          isSelected={selectedShop?.id === shop.id}
          onClick={() => onShopSelect(shop)}
        />
      ))}
    </div>
  )
}
