import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xlweuflsnkaetdwhuzsb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2V1ZmxzbmthZXRkd2h1enNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NDU0NDgsImV4cCI6MjEwMjEyMTQ0OH0.GAqCP09P48GdibD1Cw_nam8qPRlQAp_RGW2nugqvt9g'

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearDB() {
  console.log('Clearing database...')
  
  // First we need to get all IDs since delete requires a filter
  const { data: items, error: fetchError } = await supabase.from('items').select('id')
  
  if (fetchError) {
    console.error('Failed to fetch items:', fetchError)
    return
  }

  if (items && items.length > 0) {
    const ids = items.map(item => item.id)
    const { error: deleteError } = await supabase.from('items').delete().in('id', ids)
    
    if (deleteError) {
      console.error('Failed to delete items:', deleteError)
    } else {
      console.log(`Successfully deleted ${ids.length} items.`)
    }
  } else {
    console.log('Database is already empty.')
  }
}

clearDB()
