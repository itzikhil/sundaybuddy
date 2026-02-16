import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import { Navigation, Crosshair } from 'lucide-react'
import { isOpen, getDirectionsUrl } from '../utils/timeUtils'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const categoryColors = {
  Supermarket: '#10b981',
  Späti: '#f59e0b',
  Pharmacy: '#ef4444',
}

function createCustomIcon(category) {
  const color = categoryColors[category] || '#6b7280'
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

function ShopPopup({ shop }) {
  const open = isOpen(shop.sundayHours)

  return (
    <div className="text-sm min-w-[180px]">
      <div className="flex items-start justify-between gap-2 mb-1">
        <strong className="text-gray-900">{shop.name}</strong>
        <span
          className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
            open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}
          />
          {open ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="text-gray-600 mb-1">{shop.category}</div>
      <div className="text-gray-500 mb-2">{shop.sundayHours}</div>
      <a
        href={getDirectionsUrl(shop.lat, shop.lng)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Navigation size={12} />
        Get Directions
      </a>
    </div>
  )
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

export default function Map({ shops, onShopSelect, selectedShop }) {
  const center = [52.52, 13.405] // Berlin center
  const [userPosition, setUserPosition] = useState(null)

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lng]}
            icon={createCustomIcon(shop.category)}
            eventHandlers={{
              click: () => onShopSelect(shop),
            }}
          >
            <Popup>
              <ShopPopup shop={shop} />
            </Popup>
          </Marker>
        ))}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        <LocateButton onLocationFound={setUserPosition} />
      </MapContainer>
    </div>
  )
}
