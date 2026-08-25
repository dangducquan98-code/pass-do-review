import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { assertAiApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authError = assertAiApiKey(req)
  if (authError) return authError

  try {
    const [totalRes, unpostedRes, postedRes] = await Promise.all([
      supabase
        .from('ai_media')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('ai_media')
        .select('*', { count: 'exact', head: true })
        .eq('is_posted', false),
      supabase
        .from('ai_media')
        .select('*', { count: 'exact', head: true })
        .eq('is_posted', true),
    ])

    const error = totalRes.error || unpostedRes.error || postedRes.error
    if (error) {
      console.error('Error fetching AI media stats:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count ?? 0,
        unposted: unpostedRes.count ?? 0,
        posted: postedRes.count ?? 0,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
