import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import ShopModal from './components/ShopModal'
import shopsData from './data/shops.json'

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShop, setSelectedShop] = useState(null)
  const [modalShop, setModalShop] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map - full width when sidebar closed, otherwise shares space */}
        <div className={`h-64 md:h-full order-1 md:order-none ${isSidebarOpen ? 'md:flex-1' : 'md:w-full'}`}>
          <Map
            shops={filteredShops}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
            onShopClick={setModalShop}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Sidebar - scrollable list on right side */}
        {isSidebarOpen && (
          <div className="flex-1 md:w-96 md:flex-none border-l border-gray-200 overflow-hidden order-2 md:order-none">
            <Sidebar
              shops={filteredShops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showOpenOnly={showOpenOnly}
              onToggleOpenOnly={setShowOpenOnly}
            />
          </div>
        )}
      </div>

      {/* Shop Detail Modal */}
      <ShopModal shop={modalShop} onClose={() => setModalShop(null)} />
    </div>
  )
}

export default App
