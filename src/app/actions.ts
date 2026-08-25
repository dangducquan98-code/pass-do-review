'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  ADMIN_COOKIE_MAX_AGE_SEC,
  ADMIN_COOKIE_NAME,
  assertAdmin,
  signAdminCookie,
} from '@/lib/auth'
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  recordFailedLogin,
} from '@/lib/rate-limit'
import { parseItemFormData } from '@/lib/item-schema'

function getClientIp(headerStore: Headers): string {
  const forwarded = headerStore.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headerStore.get('x-real-ip')?.trim() || 'unknown'
}

export async function loginWithPin(formData: FormData) {
  const headerStore = await headers()
  const ip = getClientIp(headerStore)

  const rate = checkLoginRateLimit(ip)
  if (!rate.allowed) {
    return {
      error: `Quá nhiều lần đăng nhập sai. Thử lại sau ${rate.retryAfterSec} giây.`,
    }
  }

  const pin = formData.get('pin') as string
  const adminPin = process.env.ADMIN_PIN

  if (!adminPin) {
    return { error: 'ADMIN_PIN chưa được cấu hình' }
  }

  if (pin === adminPin) {
    clearLoginAttempts(ip)
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, signAdminCookie(adminPin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_COOKIE_MAX_AGE_SEC,
    })
    redirect('/admin/dashboard')
  }

  recordFailedLogin(ip)
  return { error: 'Mã PIN không chính xác' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  redirect('/admin')
}

/** Upload one image to storage via service role. Client keeps compress + preview UX. */
export async function uploadImage(formData: FormData) {
  await assertAdmin()

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Không có file ảnh hợp lệ' }
  }

  const prefixRaw = formData.get('prefix')
  const prefix =
    typeof prefixRaw === 'string' && prefixRaw.length > 0 ? prefixRaw : ''

  const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

  const { error } = await supabaseAdmin.storage
    .from('item-images')
    .upload(fileName, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || 'image/webp',
    })

  if (error) {
    return { error: error.message }
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('item-images')
    .getPublicUrl(fileName)

  return { url: publicUrlData.publicUrl }
}

export async function addItem(formData: FormData) {
  await assertAdmin()

  const parsed = parseItemFormData(formData)
  if (parsed.error || !parsed.data) {
    return { error: parsed.error || 'Dữ liệu không hợp lệ' }
  }

  const { name, original_price, sell_price, status, affiliate_link, images } =
    parsed.data

  const { error } = await supabaseAdmin.from('items').insert([
    { name, original_price, sell_price, status, affiliate_link, images },
  ])

  if (error) {
    console.error('Error adding item:', error.message)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  redirect('/admin/dashboard')
}

export async function updateItemStatus(id: string, status: string) {
  await assertAdmin()

  const { error } = await supabaseAdmin
    .from('items')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

function extractStorageFileNames(urls: string[]): string[] {
  if (!urls || !Array.isArray(urls)) return []
  return urls
    .map((url) => {
      try {
        const parts = url.split('/item-images/')
        if (parts.length > 1) {
          return decodeURIComponent(parts[1].split('?')[0])
        }
        return ''
      } catch {
        return ''
      }
    })
    .filter(Boolean)
}

export async function deleteItem(id: string) {
  await assertAdmin()

  const { data: item } = await supabase
    .from('items')
    .select('images')
    .eq('id', id)
    .single()

  if (item?.images && Array.isArray(item.images)) {
    const fileNames = extractStorageFileNames(item.images)
    if (fileNames.length > 0) {
      await supabaseAdmin.storage.from('item-images').remove(fileNames)
    }
  }

  const { error } = await supabaseAdmin.from('items').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function editItem(id: string, formData: FormData) {
  await assertAdmin()

  const parsed = parseItemFormData(formData)
  if (parsed.error || !parsed.data) {
    return { error: parsed.error || 'Dữ liệu không hợp lệ' }
  }

  const { name, original_price, sell_price, status, affiliate_link, images } =
    parsed.data
  const newImages = images

  const { data: existingItem } = await supabase
    .from('items')
    .select('images')
    .eq('id', id)
    .single()

  if (existingItem?.images && Array.isArray(existingItem.images)) {
    const oldImages: string[] = existingItem.images
    const removedImages = oldImages.filter((img) => !newImages.includes(img))
    const removedFileNames = extractStorageFileNames(removedImages)
    if (removedFileNames.length > 0) {
      await supabaseAdmin.storage.from('item-images').remove(removedFileNames)
    }
  }

  const { error } = await supabaseAdmin
    .from('items')
    .update({
      name,
      original_price,
      sell_price,
      status,
      affiliate_link,
      images: newImages,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating item:', error.message)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  redirect('/admin/dashboard')
}

export async function updateItemsOrder(
  items: { id: string; display_order: number }[]
) {
  await assertAdmin()

  const promises = items.map((item) =>
    supabaseAdmin
      .from('items')
      .update({ display_order: item.display_order })
      .eq('id', item.id)
  )

  const results = await Promise.all(promises)

  const error = results.find((res) => res.error)?.error
  if (error) {
    console.error('Error updating items order:', error.message)
    return { error: error.message }
  }

  return { success: true }
}

export async function bulkAddAiMedia(data: {
  item_id?: string | null
  image_urls: string[]
  notes?: string
}) {
  await assertAdmin()

  const records = data.image_urls.map((url) => ({
    item_id: data.item_id || null,
    image_url: url,
    notes: data.notes || null,
    is_posted: false,
  }))

  const { error } = await supabaseAdmin.from('ai_media').insert(records)

  if (error) {
    console.error('Error adding AI media:', error.message)
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/ai-media')
  return { success: true, count: records.length }
}

export async function toggleAiMediaStatus(id: string, is_posted: boolean) {
  await assertAdmin()

  const { error } = await supabaseAdmin
    .from('ai_media')
    .update({
      is_posted,
      posted_at: is_posted ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/ai-media')
  return { success: true }
}

export async function deleteAiMedia(id: string, imageUrl: string) {
  await assertAdmin()

  const fileNames = extractStorageFileNames([imageUrl])
  if (fileNames.length > 0) {
    await supabaseAdmin.storage.from('item-images').remove(fileNames)
  }

  const { error } = await supabaseAdmin.from('ai_media').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/ai-media')
  return { success: true }
}
