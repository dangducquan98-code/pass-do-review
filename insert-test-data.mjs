import { createClient } from '@supabase/supabase-js'

// Try to use environment variables, or hardcode the URL and a generic Anon Key if they don't exist
// I'll grab the Anon Key from the previous session summary.
const supabaseUrl = 'https://xlweuflsnkaetdwhuzsb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2V1ZmxzbmthZXRkd2h1enNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NDU0NDgsImV4cCI6MjEwMjEyMTQ0OH0.GAqCP09P48GdibD1Cw_nam8qPRlQAp_RGW2nugqvt9g'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertTestData() {
  const items = [
    {
      name: 'Màn hình Dell UltraSharp U2723QE 27 inch 4K',
      original_price: 13500000,
      sell_price: 9500000,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600&auto=format&fit=crop'
      ],
      affiliate_link: 'https://shopee.vn'
    },
    {
      name: 'Đồng hồ Apple Watch Series 8 (GPS) 41mm',
      original_price: 9990000,
      sell_price: 6500000,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop'
      ],
      affiliate_link: 'https://shopee.vn'
    },
    {
      name: 'Máy tính bảng iPad Air 5 (M1) 64GB WiFi',
      original_price: 15490000,
      sell_price: 11000000,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533022135061-007cb4a48043?q=80&w=600&auto=format&fit=crop'
      ],
      affiliate_link: 'https://shopee.vn'
    }
  ]

  console.log('Inserting test data...')
  
  // Insert one by one to avoid any potential RLS array insert issues
  for (const item of items) {
    const { error } = await supabase.from('items').insert([item])
    if (error) {
      console.error('Error inserting item:', item.name, error)
    } else {
      console.log('Inserted:', item.name)
    }
  }
  
  console.log('Done!')
}

insertTestData()
