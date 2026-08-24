import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function checkApiKey(req: NextRequest): boolean {
  const secretKey = process.env.AI_AGENT_API_KEY
  if (!secretKey) return true

  const authHeader = req.headers.get('authorization')
  const apiKeyHeader = req.headers.get('x-api-key')

  if (apiKeyHeader && apiKeyHeader === secretKey) return true
  if (authHeader && authHeader.replace(/^Bearer\s+/i, '') === secretKey) return true

  return false
}

export async function GET(req: NextRequest) {
  if (!checkApiKey(req)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing API Key' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // 'all' | 'unposted' | 'posted'
  const itemId = searchParams.get('item_id')

  try {
    let query = supabase
      .from('ai_media')
      .select(`
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
      `)
      .order('created_at', { ascending: false })

    if (status === 'unposted') {
      query = query.eq('is_posted', false)
    } else if (status === 'posted') {
      query = query.eq('is_posted', true)
    }

    if (itemId) {
      query = query.eq('item_id', itemId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching all AI media library:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      total: data?.length || 0,
      unposted_count: data?.filter(m => !m.is_posted).length || 0,
      posted_count: data?.filter(m => m.is_posted).length || 0,
      data: data || []
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
