import { createClient } from './supabase/client'

export async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await createClient().auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}
