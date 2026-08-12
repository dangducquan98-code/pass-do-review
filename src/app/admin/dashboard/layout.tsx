import Link from 'next/link'
import { logout } from '@/app/actions'
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-xl transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Danh sách đồ</span>
          </Link>
          <Link
            href="/admin/dashboard/add"
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-xl transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Thêm đồ mới</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-200">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  )
}
