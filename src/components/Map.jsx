import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import { Crosshair, PanelLeft, Plus } from 'lucide-react'
import { isOpen } from '../utils/timeUtils'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Category colors for markers
const categoryColors = {
  // Shopping (earthy tones)
  supermarket: '#10b981', // green
  convenience: '#f59e0b', // amber
  bakery: '#d97706', // orange
  pharmacy: '#ef4444', // red
  kiosk: '#6b7280', // gray

  // Family Attractions (fun colors)
  kid_cafe: '#8b5cf6', // purple
  petting_zoo: '#ec4899', // pink
  indoor_play: '#f472b6', // light pink
  museum: '#06b6d4', // cyan
}

function getCategoryColor(category) {
  if (!category) return '#6b7280'
  const normalized = category.toLowerCase().trim().replace(/\s+/g, '_')
  return categoryColors[normalized] || '#6b7280'
}

function createCustomIcon(category, shopIsOpen) {
  // Use category color if open, gray if closed
  const baseColor = getCategoryColor(category)
  const color = shopIsOpen ? baseColor : '#9ca3af'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const userLocationIcon = L.divIcon({
  className: 'user-location-dot',
  html: `<div style="
    background-color: #3b82f6;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function MapResizer({ isSidebarOpen }) {
  const map = useMap()

  useEffect(() => {
    // Wait for sidebar transition to complete before resizing
    setTimeout(() => {
      map.invalidateSize()
    }, 300)
  }, [isSidebarOpen, map])

  return null
}

function LocateButton({ onLocationFound }) {
  const map = useMap()

  useEffect(() => {
    const handleLocationFound = (e) => {
      map.flyTo(e.latlng, 14)
      onLocationFound(e.latlng)
    }

    map.on('locationfound', handleLocationFound)

    return () => {
      map.off('locationfound', handleLocationFound)
    }
  }, [map, onLocationFound])

  const handleLocate = () => {
    map.locate()
  }

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-6 right-3 z-[1000] bg-white p-2.5 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      title="Find my location"
    >
      <Crosshair size={20} className="text-gray-700" />
    </button>
  )
}

function SidebarToggleButton({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-24 left-3 z-[1000] bg-white p-2.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
    >
      <PanelLeft size={20} className={`text-gray-700 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
    </button>
  )
}

function AddShopButton({ isAddMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`absolute bottom-20 right-3 z-[1000] p-3 rounded-full shadow-lg transition-all ${
        isAddMode
          ? 'bg-amber-600 hover:bg-amber-700 rotate-45'
          : 'bg-black hover:bg-gray-800'
      }`}
      title={isAddMode ? 'Cancel adding' : 'Add a shop'}
    >
      <Plus size={24} className="text-white" />
    </button>
  )
}

function MapClickHandler({ isAddMode, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (isAddMode) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    },
  })
  return null
}

export default function Map({ shops, onShopSelect, onShopHover, isSidebarOpen, onToggleSidebar, isAddMode, onToggleAddMode, onMapClick }) {
  const center = [52.52, 13.405] // Berlin center
  const [userPosition, setUserPosition] = useState(null)

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={12}
        className={`h-full w-full ${isAddMode ? 'cursor-crosshair' : ''}`}
      >
        <MapResizer isSidebarOpen={isSidebarOpen} />
        <MapClickHandler isAddMode={isAddMode} onMapClick={onMapClick} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {shops.map((shop) => {
          const shopIsOpen = isOpen(shop.sundayHours, shop.isOpen)
          return (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={createCustomIcon(shop.category, shopIsOpen)}
              eventHandlers={{
                mouseover: () => onShopHover(shop),
                mouseout: () => onShopHover(null),
                click: () => onShopSelect(shop),
              }}
            />
          )
        })}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        <LocateButton onLocationFound={setUserPosition} />
      </MapContainer>
      <SidebarToggleButton isOpen={isSidebarOpen} onToggle={onToggleSidebar} />
      <AddShopButton isAddMode={isAddMode} onToggle={onToggleAddMode} />

      {/* Add Mode Banner */}
      {isAddMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
          Click on the map to add a location
        </div>
      )}
    </div>
  )
}
