export type ItemStatus = 'available' | 'sold'

export type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
  display_order?: number
  created_at?: string
}

export type ItemFormData = {
  id?: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

export type ItemOption = {
  id: string
  name: string
  status?: string
}

export type AiMediaItem = {
  id: string
  item_id: string | null
  image_url: string
  is_posted: boolean
  posted_at: string | null
  platform: string
  notes: string | null
  created_at: string
  items?: {
    id: string
    name: string
    sell_price: number
    status: string
  } | null
}
