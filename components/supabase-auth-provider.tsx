'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createClient(), [])

  return (
    <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>
  )
}

export function useSupabaseClient() {
  const client = useContext(SupabaseContext)

  if (!client) {
    throw new Error('useSupabaseClient must be used within SupabaseAuthProvider')
  }

  return client
}
