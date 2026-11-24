import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://szbwajxjbsfclfzpeajw.supabase.co'
const supabaseKey = 'sb_publishable_ZPzg7IPMxqVdAvBbYbAqQA_4GVheeur'

export const supabase = createClient(supabaseUrl, supabaseKey)