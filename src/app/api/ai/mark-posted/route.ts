import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { assertAiApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const authError = assertAiApiKey(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, platform } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu trường "id" của ảnh cần đánh dấu' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('ai_media')
      .update({
        is_posted: true,
        posted_at: new Date().toISOString(),
        ...(platform ? { platform } : {}),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error marking AI media as posted:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Đã đánh dấu ảnh là đã đăng thành công!',
      data,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
