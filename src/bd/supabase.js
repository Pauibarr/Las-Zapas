
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpbcntersjgydvltolrr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYmNudGVyc2pneWR2bHRvbHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNTc4MzIsImV4cCI6MjA0NDczMzgzMn0.NigsnwML3xN3ukkit1y7kMNJsrsUBd6IOOt9HzZ7pVc'
const supabase = createClient(supabaseUrl, supabaseKey)

const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYmNudGVyc2pneWR2bHRvbHJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTE1NzgzMiwiZXhwIjoyMDQ0NzMzODMyfQ.6-mN5SPLiF44tZPtq_uGMqv6WB-BXElCRbH_92QCQ5w'
const supabaseService = createClient(supabaseUrl, supabaseServiceKey)