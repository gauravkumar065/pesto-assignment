import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL|| 'https://amzooetcyfnhjcbiugdj.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtem9vZXRjeWZuaGpjYml1Z2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2NjcyODAsImV4cCI6MjAzODI0MzI4MH0.zLXLK2UCkX-UpfhyhMn4GjRWO_JD8rGOidlsfQaQFeY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)