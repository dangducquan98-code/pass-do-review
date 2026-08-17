import Link from 'next/link'
import { logout } from '@/app/actions'
import { LayoutDashboard, PlusCircle, LogOut, ExternalLink, Package } from 'lucide-react'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
            AD
          </div>
          <span className="font-extrabold text-neutral-900 text-sm tracking-tight">Admin</span>
        </div>

        <nav className="flex items-center gap-1.5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 px-2.5 py-1.5 text-neutral-700 hover:text-blue-700 text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Kho</span>
          </Link>

          <Link
            href="/admin/dashboard/add"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            title="Xem trang bán hàng"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <form action={logout}>
            <button
              type="submit"
              title="Đăng xuất"
              className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-neutral-200 flex-col flex-shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">Admin Panel</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Quản lý kho đồ review</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-blue-700 hover:bg-blue-50 font-semibold rounded-xl transition-all"
          >
            <LayoutDashboard className="w-5 h-5 text-neutral-500" />
            <span>Danh sách kho</span>
          </Link>
          <Link
            href="/admin/dashboard/add"
            className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-blue-700 hover:bg-blue-50 font-semibold rounded-xl transition-all"
          >
            <PlusCircle className="w-5 h-5 text-neutral-500" />
            <span>Thêm món mới</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-medium rounded-xl transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Xem trang bán</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-semibold hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  )
}
