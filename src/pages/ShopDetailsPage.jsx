import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Navigation, Star, Clock, MapPin, Wifi, Coffee, Beer, Leaf, Pill, ShoppingBag, Car, Newspaper, Loader2 } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { isOpen } from '../utils/timeUtils'
import { getShopImage } from '../utils/imageUtils'

const DEFAULT_DESCRIPTION = 'A great local spot in the neighborhood.'

const tagConfig = {
  wifi: { icon: Wifi, label: 'WiFi' },
  coffee: { icon: Coffee, label: 'Coffee' },
  beer: { icon: Beer, label: 'Beer' },
  vegan: { icon: Leaf, label: 'Vegan' },
  organic: { icon: Leaf, label: 'Organic' },
  '24h': { icon: Clock, label: '24h' },
  masks: { icon: Pill, label: 'Masks' },
  vitamins: { icon: Pill, label: 'Vitamins' },
  snacks: { icon: ShoppingBag, label: 'Snacks' },
  parking: { icon: Car, label: 'Parking' },
  newspapers: { icon: Newspaper, label: 'News' },
  consultation: { icon: Pill, label: 'Consult' },
  bakery: { icon: Coffee, label: 'Bakery' },
  deli: { icon: ShoppingBag, label: 'Deli' },
  delivery: { icon: Car, label: 'Delivery' },
  emergency: { icon: Pill, label: 'Emergency' },
  budget: { icon: ShoppingBag, label: 'Budget' },
}

export default function ShopDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchShop() {
      const { data, error: fetchError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching shop:', fetchError)
        setError('Shop not found')
      } else if (data) {
        // Map snake_case to camelCase and add fallbacks
        setShop({
          ...data,
          isOpen: data.is_open ?? data.isOpen ?? true,
          sundayHours: data.sunday_hours ?? data.sundayHours ?? 'Unknown',
          image: getShopImage(data),
          description: data.description || DEFAULT_DESCRIPTION,
          rating: data.rating ?? 4.5,
        })
      }
      setLoading(false)
    }

    fetchShop()
  }, [id])

  const handleNavigate = () => {
    if (shop) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-amber-700" />
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Not Found</h1>
        <p className="text-gray-500 mb-6">The shop you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
    )
  }

  const open = isOpen(shop.sundayHours, shop.isOpen)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Image Section */}
      <div className="relative h-64 md:h-80 flex-shrink-0">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-700" />
          <span className="font-medium text-gray-700">Back to Map</span>
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-amber-800 font-medium rounded-full">
            {shop.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full shrink-0">
            <Star size={20} className="text-amber-500" fill="currentColor" />
            <span className="font-bold text-lg text-gray-900">{shop.rating}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
              open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {open ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm mb-6">
          <MapPin size={24} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p className="text-gray-600">{shop.address || 'Address not available'}</p>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm mb-6">
          <Clock size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Sunday Hours</p>
            <p className="text-gray-600">{shop.sundayHours}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 leading-relaxed">{shop.description}</p>
        </div>

        {/* Tags */}
        {shop.tags && shop.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {shop.tags.map((tag) => {
                const config = tagConfig[tag]
                const IconComponent = config?.icon
                return (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full shadow-sm"
                  >
                    {IconComponent && <IconComponent size={16} />}
                    {config?.label || tag}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer Button */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleNavigate}
            className="flex items-center justify-center gap-3 w-full bg-[#784f33] hover:bg-[#5d3d28] text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
          >
            <Navigation size={22} />
            Navigate There
          </button>
        </div>
      </div>
    </div>
  )
}
