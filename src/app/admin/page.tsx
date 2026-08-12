'use client'

import { useState } from 'react'
import { loginWithPin } from '@/app/actions'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const res = await loginWithPin(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-neutral-900 mb-2">Đăng nhập Quản trị</h1>
        <p className="text-neutral-500 text-center mb-8">Vui lòng nhập mã PIN để tiếp tục</p>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-semibold text-neutral-700 mb-2">
              Mã PIN
            </label>
            <input
              type="password"
              name="pin"
              id="pin"
              required
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}
