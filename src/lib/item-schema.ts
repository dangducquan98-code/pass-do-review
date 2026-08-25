import { z } from 'zod'

const httpUrl = z
  .string()
  .refine(
    (v) => {
      try {
        const u = new URL(v)
        return u.protocol === 'http:' || u.protocol === 'https:'
      } catch {
        return false
      }
    },
    { message: 'Link phải là URL hợp lệ (http/https)' }
  )

export const itemInputSchema = z.object({
  name: z
    .string({ message: 'Tên món đồ không hợp lệ' })
    .trim()
    .min(1, 'Tên món đồ không được để trống'),
  original_price: z
    .number({ message: 'Giá gốc không hợp lệ' })
    .min(0, 'Giá gốc phải lớn hơn hoặc bằng 0')
    .nullable(),
  sell_price: z
    .number({ message: 'Giá bán không hợp lệ' })
    .min(0, 'Giá bán phải lớn hơn hoặc bằng 0'),
  status: z.enum(['available', 'sold'], {
    message: 'Trạng thái không hợp lệ',
  }),
  affiliate_link: z.union([z.literal(''), httpUrl]),
  images: z.array(httpUrl, {
    message: 'Danh sách ảnh không hợp lệ',
  }),
})

export type ItemInput = z.infer<typeof itemInputSchema>

export function parseItemFormData(formData: FormData): {
  data?: ItemInput
  error?: string
} {
  const name = String(formData.get('name') ?? '')
  const status = String(formData.get('status') ?? 'available')
  const affiliateRaw = formData.get('affiliate_link')
  const affiliate_link =
    affiliateRaw == null ? '' : String(affiliateRaw).trim()

  const originalRaw = formData.get('original_price')
  const originalStr =
    originalRaw == null ? '' : String(originalRaw).trim()
  const original_price =
    originalStr === '' ? null : Number.parseFloat(originalStr)

  const sellRaw = formData.get('sell_price')
  const sell_price = Number.parseFloat(String(sellRaw ?? ''))

  let images: string[] = []
  const imagesStr = formData.get('images')
  if (typeof imagesStr === 'string' && imagesStr.length > 0) {
    try {
      const parsed = JSON.parse(imagesStr)
      if (!Array.isArray(parsed)) {
        return { error: 'Danh sách ảnh không hợp lệ' }
      }
      images = parsed.map(String)
    } catch {
      return { error: 'Danh sách ảnh không hợp lệ' }
    }
  }

  const result = itemInputSchema.safeParse({
    name,
    original_price: Number.isFinite(original_price as number)
      ? original_price
      : originalStr === ''
        ? null
        : Number.NaN,
    sell_price: Number.isFinite(sell_price) ? sell_price : Number.NaN,
    status,
    affiliate_link,
    images,
  })

  if (!result.success) {
    const first = result.error.issues[0]
    return { error: first?.message || 'Dữ liệu không hợp lệ' }
  }

  return { data: result.data }
}
