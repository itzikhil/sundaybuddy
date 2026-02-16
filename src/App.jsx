import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import ShopModal from './components/ShopModal'
import ShopPreviewCard from './components/ShopPreviewCard'
import shopsData from './data/shops.json'

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShop, setSelectedShop] = useState(null)
  const [hoveredShop, setHoveredShop] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Smart click handler: hide preview card, then open modal
  const handleShopSelect = (shop) => {
    setHoveredShop(null)
    setSelectedShop(shop)
  }

  const filteredShops = useMemo(() => {
    let shops = shopsData

    // Filter by category
    if (activeFilter !== 'All') {
      shops = shops.filter((shop) => shop.category === activeFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      shops = shops.filter((shop) =>
        shop.name.toLowerCase().includes(query) ||
        shop.address?.toLowerCase().includes(query)
      )
    }

    // Filter by open now
    if (showOpenOnly) {
      shops = shops.filter((shop) => shop.isOpen)
    }

    return shops
  }, [activeFilter, searchQuery, showOpenOnly])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Header />
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Map wrapper - flex-1 h-full w-full ensures it fills remaining space */}
        <div className="flex-1 relative h-full w-full">
          <Map
            shops={filteredShops}
            onShopSelect={handleShopSelect}
            onShopHover={setHoveredShop}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          {/* Floating Preview Card */}
          <ShopPreviewCard shop={hoveredShop} />
        </div>
      </div>

      {/* Sidebar - fixed width, flex-shrink-0 prevents shrinking */}
      {isSidebarOpen && (
        <div className="w-80 flex-shrink-0 border-l border-gray-200 overflow-hidden bg-white transition-all duration-300">
          <Sidebar
            shops={filteredShops}
            selectedShop={selectedShop}
            onShopSelect={handleShopSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showOpenOnly={showOpenOnly}
            onToggleOpenOnly={setShowOpenOnly}
          />
        </div>
      )}

      {/* Shop Detail Modal */}
      <ShopModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
    </div>
  )
}

export default App
