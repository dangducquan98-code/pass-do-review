import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function checkApiKey(req: NextRequest): boolean {
  const secretKey = process.env.AI_AGENT_API_KEY
  if (!secretKey) return true // If no key is set in .env, allow by default

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
  const itemId = searchParams.get('item_id')
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '1', 10), 1), 10)

  try {
    let query = supabase
      .from('ai_media')
      .select(`
        id,
        item_id,
        image_url,
        is_posted,
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
      .eq('is_posted', false)
      .order('created_at', { ascending: true })

    if (itemId) {
      query = query.eq('item_id', itemId)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      console.error('Error fetching next AI post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Không còn ảnh nào chưa đăng trong kho AI.',
          has_more: false,
          data: null 
        },
        { status: 200 }
      )
    }

    const result = limit === 1 ? data[0] : data

    return NextResponse.json({
      success: true,
      has_more: true,
      data: result
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
