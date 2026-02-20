import { Store, ShoppingCart, Pill, Coffee, Baby, Rabbit, Blocks, Building2 } from 'lucide-react'

const categories = [
  { id: 'All', label: 'All', icon: null },
  { id: 'Supermarket', label: 'Supermarket', icon: ShoppingCart },
  { id: 'convenience', label: 'Späti', icon: Store },
  { id: 'Pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'bakery', label: 'Bakery', icon: Coffee },
  { id: 'kid_cafe', label: 'Kid Cafe', icon: Baby },
  { id: 'petting_zoo', label: 'Petting Zoo', icon: Rabbit },
  { id: 'indoor_play', label: 'Indoor Play', icon: Blocks },
  { id: 'museum', label: 'Museum', icon: Building2 },
]

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b border-gray-200 overflow-x-auto">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {IconComponent && <IconComponent size={16} />}
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
