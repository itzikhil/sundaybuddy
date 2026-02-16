import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
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

export default function Map({ shops, onShopSelect, selectedShop }) {
  const center = [52.52, 13.405] // Berlin center

  return (
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
            <div className="text-sm">
              <strong>{shop.name}</strong>
              <br />
              <span className="text-gray-600">{shop.category}</span>
              <br />
              <span className="text-green-600 font-medium">{shop.sundayHours}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
