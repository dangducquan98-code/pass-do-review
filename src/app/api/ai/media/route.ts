import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { assertAiApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = assertAiApiKey(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // 'all' | 'unposted' | 'posted'
  const itemId = searchParams.get('item_id')
  const limitRaw = Number.parseInt(searchParams.get('limit') || '50', 10)
  const offsetRaw = Number.parseInt(searchParams.get('offset') || '0', 10)
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 50
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0

  try {
    let dataQuery = supabase
      .from('ai_media')
      .select(
        `
        id,
        item_id,
        image_url,
        is_posted,
        posted_at,
        platform,
        notes,
        created_at,
        items (
          id,
          name,
          original_price,
          sell_price,
          status,
          affiliate_link
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    let unpostedQuery = supabase
      .from('ai_media')
      .select('*', { count: 'exact', head: true })
      .eq('is_posted', false)

    let postedQuery = supabase
      .from('ai_media')
      .select('*', { count: 'exact', head: true })
      .eq('is_posted', true)

    if (status === 'unposted') {
      dataQuery = dataQuery.eq('is_posted', false)
    } else if (status === 'posted') {
      dataQuery = dataQuery.eq('is_posted', true)
    }

    if (itemId) {
      dataQuery = dataQuery.eq('item_id', itemId)
      unpostedQuery = unpostedQuery.eq('item_id', itemId)
      postedQuery = postedQuery.eq('item_id', itemId)
    }

    const [dataRes, unpostedRes, postedRes] = await Promise.all([
      dataQuery,
      unpostedQuery,
      postedQuery,
    ])

    if (dataRes.error) {
      console.error('Error fetching all AI media library:', dataRes.error.message)
      return NextResponse.json({ error: dataRes.error.message }, { status: 500 })
    }

    if (unpostedRes.error || postedRes.error) {
      const msg =
        unpostedRes.error?.message || postedRes.error?.message || 'Count error'
      console.error('Error counting AI media:', msg)
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      total: dataRes.count ?? 0,
      unposted_count: unpostedRes.count ?? 0,
      posted_count: postedRes.count ?? 0,
      limit,
      offset,
      data: dataRes.data || [],
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
