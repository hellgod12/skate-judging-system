import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Helper to create client for service classes that need to work in both contexts
export function createClientForService() {
  // Always use browser client for service classes to avoid server/client context issues
  // Service classes should be refactored to use server client in server contexts if needed
  return createClient()
}
