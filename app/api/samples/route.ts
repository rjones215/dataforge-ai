import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 200

function parseLimit(rawLimit: string | null) {
  if (!rawLimit) {
    return DEFAULT_LIMIT
  }

  const parsedLimit = Number.parseInt(rawLimit, 10)
  if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_LIMIT
  }

  return Math.min(parsedLimit, MAX_LIMIT)
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const domain = request.nextUrl.searchParams.get('domain')
  const source = request.nextUrl.searchParams.get('source')
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'))

  let query = supabase.from('data_samples').select('*')

  if (domain) {
    query = query.eq('domain', domain)
  }

  if (source) {
    query = query.eq('source', source)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
