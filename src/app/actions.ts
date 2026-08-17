'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function loginWithPin(formData: FormData) {
  const pin = formData.get('pin') as string
  const adminPin = process.env.ADMIN_PIN || '123456'

  if (pin === adminPin) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/admin/dashboard')
  } else {
    return { error: 'Mã PIN không chính xác' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin')
}

export async function addItem(formData: FormData) {
  // In a real app, verify cookie here again just in case
  const name = formData.get('name') as string
  const original_price = parseFloat(formData.get('original_price') as string)
  const sell_price = parseFloat(formData.get('sell_price') as string)
  const status = formData.get('status') as string
  const affiliate_link = formData.get('affiliate_link') as string
  const imagesStr = formData.get('images') as string
  const images = imagesStr ? JSON.parse(imagesStr) : []

  const { error } = await supabase
    .from('items')
    .insert([
      { name, original_price, sell_price, status, affiliate_link, images }
    ])

  if (error) {
    console.error('Error adding item:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  redirect('/admin/dashboard')
}

export async function updateItemStatus(id: string, status: string) {
  const { error } = await supabase
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

import { revalidatePath } from 'next/cache'

function extractStorageFileNames(urls: string[]): string[] {
  if (!urls || !Array.isArray(urls)) return []
  return urls
    .map(url => {
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
  // 1. Fetch images to delete files from storage
  const { data: item } = await supabase
    .from('items')
    .select('images')
    .eq('id', id)
    .single()

  if (item?.images && Array.isArray(item.images)) {
    const fileNames = extractStorageFileNames(item.images)
    if (fileNames.length > 0) {
      await supabase.storage.from('item-images').remove(fileNames)
    }
  }

  // 2. Delete item record
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function editItem(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const original_price = parseFloat(formData.get('original_price') as string)
  const sell_price = parseFloat(formData.get('sell_price') as string)
  const status = formData.get('status') as string
  const affiliate_link = formData.get('affiliate_link') as string
  
  const imagesStr = formData.get('images') as string
  const newImages: string[] = imagesStr ? JSON.parse(imagesStr) : []

  // 1. Clean up removed old images from storage
  const { data: existingItem } = await supabase
    .from('items')
    .select('images')
    .eq('id', id)
    .single()

  if (existingItem?.images && Array.isArray(existingItem.images)) {
    const oldImages: string[] = existingItem.images
    const removedImages = oldImages.filter(img => !newImages.includes(img))
    const removedFileNames = extractStorageFileNames(removedImages)
    if (removedFileNames.length > 0) {
      await supabase.storage.from('item-images').remove(removedFileNames)
    }
  }

  // 2. Update item record
  const { error } = await supabase
    .from('items')
    .update({ name, original_price, sell_price, status, affiliate_link, images: newImages })
    .eq('id', id)

  if (error) {
    console.error('Error updating item:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  redirect('/admin/dashboard')
}

export async function updateItemsOrder(items: { id: string; display_order: number }[]) {
  // We can't bulk update easily with supabase-js unless we use upsert, 
  // but upsert requires all non-nullable fields if we don't have a specific setup.
  // So we'll just run individual updates concurrently.
  const promises = items.map(item => 
    supabase
      .from('items')
      .update({ display_order: item.display_order })
      .eq('id', item.id)
  )
  
  const results = await Promise.all(promises)
  
  const error = results.find(res => res.error)?.error
  if (error) {
    console.error('Error updating items order:', error)
    return { error: error.message }
  }
  
  return { success: true }
}
