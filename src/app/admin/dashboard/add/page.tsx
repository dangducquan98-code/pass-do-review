import AdminItemForm from '@/components/AdminItemForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddItemPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="p-2 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Thêm đồ mới</h1>
        </div>
        
        <AdminItemForm />
      </div>
    </div>
  )
}
