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

  try {
    const { data: allMedia, error } = await supabase
      .from('ai_media')
      .select('id, is_posted, item_id')

    if (error) {
      console.error('Error fetching AI media stats:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const total = allMedia?.length || 0
    const unposted = allMedia?.filter(m => !m.is_posted).length || 0
    const posted = allMedia?.filter(m => m.is_posted).length || 0

    return NextResponse.json({
      success: true,
      stats: {
        total,
        unposted,
        posted
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
