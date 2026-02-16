import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import Map from './components/Map'
import ShopList from './components/ShopList'
import shopsData from './data/shops.json'

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShop, setSelectedShop] = useState(null)

  const filteredShops = useMemo(() => {
    if (activeFilter === 'All') {
      return shopsData
    }
    return shopsData.filter((shop) => shop.category === activeFilter)
  }, [activeFilter])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map - full width on mobile, left side on desktop */}
        <div className="h-64 md:h-full md:flex-1 order-1 md:order-none">
          <Map
            shops={filteredShops}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
          />
        </div>

        {/* Shop List - scrollable list on right side */}
        <div className="flex-1 md:w-96 md:flex-none bg-white border-l border-gray-200 overflow-hidden order-2 md:order-none">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm text-gray-600">
              {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} open on Sunday
            </span>
          </div>
          <ShopList
            shops={filteredShops}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
          />
        </div>
      </div>
    </div>
  )
}

export default App
