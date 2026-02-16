export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🛒</div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Sunday Open Shops</h1>
          <p className="text-xs text-gray-500">Find shops open on Sundays in Germany</p>
        </div>
      </div>
    </header>
  )
}
