import { useState, useMemo, useEffect, useCallback } from 'react'
import { Map as MapIcon, LayoutGrid } from 'lucide-react'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import Map from '../components/Map'
import ShopGrid from '../components/ShopGrid'
import Sidebar from '../components/Sidebar'
import ShopModal from '../components/ShopModal'
import ShopPreviewCard from '../components/ShopPreviewCard'
import AddShopModal from '../components/AddShopModal'
import { supabase } from '../supabaseClient'
import { getShopImage } from '../utils/imageUtils'

const DEFAULT_DESCRIPTION = 'A great local spot in the neighborhood.'

export default function HomePage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShop, setSelectedShop] = useState(null)
  const [hoveredShop, setHoveredShop] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Add Shop state
  const [isAddMode, setIsAddMode] = useState(false)
  const [addLocation, setAddLocation] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const fetchShops = useCallback(async () => {
    const { data, error } = await supabase.from('shops').select('*')

    if (error) {
      console.error('Error fetching shops:', error)
    } else {
      console.log('Fetched shops from Supabase:', data)
      // Map snake_case DB columns to camelCase and add fallbacks
      const mappedShops = data.map((shop) => ({
        ...shop,
        isOpen: shop.is_open ?? shop.isOpen ?? true,
        sundayHours: shop.sunday_hours ?? shop.sundayHours ?? 'Unknown',
        image: getShopImage(shop),
        description: shop.description || DEFAULT_DESCRIPTION,
        rating: shop.rating ?? 4.5,
      }))
      setShops(mappedShops)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  // Handle map click in add mode
  const handleMapClick = (location) => {
    setAddLocation(location)
    setIsAddMode(false)
  }

  // Handle successful shop addition
  const handleAddSuccess = () => {
    setAddLocation(null)
    setSuccessMessage('Shop added successfully!')
    fetchShops()
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // Smart click handler: hide preview card, then open modal
  const handleShopSelect = (shop) => {
    setHoveredShop(null)
    setSelectedShop(shop)
  }

  const filteredShops = useMemo(() => {
    let filtered = shops

    // Filter by category
    if (activeFilter !== 'All') {
      filtered = filtered.filter((shop) => shop.category === activeFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((shop) =>
        shop.name.toLowerCase().includes(query) ||
        shop.address?.toLowerCase().includes(query)
      )
    }

    // Filter by open now
    if (showOpenOnly) {
      filtered = filtered.filter((shop) => shop.isOpen)
    }

    return filtered
  }, [shops, activeFilter, searchQuery, showOpenOnly])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0">
          <Header />
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Content Area - Grid or Map based on viewMode */}
        <div className="flex-1 overflow-hidden relative">
          {/* View Toggle - Positioned inside content area */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex bg-white rounded-full shadow-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid size={16} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-amber-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapIcon size={16} />
                Map
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <>
              <Map
                shops={filteredShops}
                onShopSelect={handleShopSelect}
                onShopHover={setHoveredShop}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isAddMode={isAddMode}
                onToggleAddMode={() => setIsAddMode(!isAddMode)}
                onMapClick={handleMapClick}
              />
              <ShopPreviewCard shop={hoveredShop} />
            </>
          ) : (
            <ShopGrid
              shops={filteredShops}
              onShopSelect={handleShopSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showOpenOnly={showOpenOnly}
              onToggleOpenOnly={setShowOpenOnly}
            />
          )}
        </div>
      </div>

      {/* Sidebar - only show in map view */}
      {viewMode === 'map' && isSidebarOpen && (
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

      {/* Add Shop Modal */}
      {addLocation && (
        <AddShopModal
          location={addLocation}
          onClose={() => setAddLocation(null)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[3000] bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-medium">
          {successMessage}
        </div>
      )}
    </div>
  )
}
