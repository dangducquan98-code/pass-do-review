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

export async function POST(req: NextRequest) {
  if (!checkApiKey(req)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing API Key' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { id, platform } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu trường "id" của ảnh cần đánh dấu' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('ai_media')
      .update({
        is_posted: true,
        posted_at: new Date().toISOString(),
        ...(platform ? { platform } : {})
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error marking AI media as posted:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Đã đánh dấu ảnh là đã đăng thành công!',
      data
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
