import { useState } from 'react'
import { X, MapPin, Loader2 } from 'lucide-react'
import { supabase } from '../supabaseClient'

const categories = ['Supermarket', 'Cafe', 'Späti', 'Pharmacy', 'Bakery']

export default function AddShopModal({ location, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Supermarket')
  const [description, setDescription] = useState('')
  const [openSundays, setOpenSundays] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const shopData = {
      name: name.trim(),
      category,
      description: description.trim() || null,
      lat: location.lat,
      lng: location.lng,
      isOpen: openSundays,
      sundayHours: openSundays ? '10:00 - 18:00' : 'Closed',
    }

    const { data, error: insertError } = await supabase
      .from('shops')
      .insert([shopData])
      .select()

    if (insertError) {
      console.error('Error adding shop:', insertError)
      setError(insertError.message)
      setIsSubmitting(false)
    } else {
      console.log('Shop added successfully:', data)
      onSuccess()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add New Shop</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Location indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <MapPin size={16} />
            <span>
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </span>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Sunday Bakery"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description of the shop..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow resize-none"
            />
          </div>

          {/* Open Sundays Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="openSundays"
              checked={openSundays}
              onChange={(e) => setOpenSundays(e.target.checked)}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="openSundays" className="text-sm text-gray-700">
              Open on Sundays
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding...
              </>
            ) : (
              'Add Shop'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
