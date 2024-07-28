import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qbdoftcalmjyfclojywa.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZG9mdGNhbG1qeWZjbG9qeXdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTgzNzA1NywiZXhwIjoyMDI1NDEzMDU3fQ.Pmz_vPm5C5Z6-1ufFVll2rA0IanMCtjo2sk4r9kXhAk"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase