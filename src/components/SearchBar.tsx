import { Search, X } from 'lucide-react'

type SearchBarProps = {
  placeholder?: string
  value: string
  onChange: (val: string) => void
  onClear?: () => void
  isPending?: boolean
}

/** Ô tìm kiếm controlled, không phụ thuộc URL — dùng được trên trang prerender tĩnh. */
export default function SearchBar({
  placeholder = 'Tìm kiếm sản phẩm...',
  value,
  onChange,
  onClear,
  isPending = false,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${isPending ? 'text-blue-500 animate-pulse' : 'text-neutral-400'}`} />
      </div>
      <input
        type="text"
        className="block w-full pl-9 sm:pl-10 pr-9 py-2 sm:py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          title="Xóa tìm kiếm"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
