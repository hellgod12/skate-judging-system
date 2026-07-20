import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if we're in a build environment
const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    console.log("SUPABASE CLIENT - Creating new instance");
    if (!supabaseUrl || !supabaseAnonKey) {
      if (isBuildTime) {
        // Return a mock client during build
        return createClient('https://mock.supabase.co', 'mock-key') as any
      }
      throw new Error('Missing Supabase environment variables')
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-skate-judging-auth-token',
      }
    })
    console.log("SUPABASE CLIENT - Instance created with auth options");
  }
  return supabaseInstance
}

// Lazy export to avoid build-time initialization
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const instance = getSupabase()
    return instance[prop as keyof typeof instance]
  },
})
