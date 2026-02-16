const categories = ['All', 'Supermarket', 'Späti', 'Pharmacy']

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b border-gray-200 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === category
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
