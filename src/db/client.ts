import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

const supabase = createClient<Database>(
    "http://localhost:54321",
    ""
)

export default supabase