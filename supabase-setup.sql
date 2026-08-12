-- 1. Create a table for items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  original_price NUMERIC,
  sell_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'available', -- 'available' or 'sold'
  image_url TEXT,
  affiliate_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create a storage bucket for item images
-- Go to Supabase Dashboard -> Storage -> Create a new bucket named 'item-images'
-- Make sure the bucket is PUBLIC so images can be displayed on the website.

-- MUST DO: Allow public uploads to the bucket (Otherwise you get "new row violates row-level security policy")
CREATE POLICY "Allow public uploads to item-images bucket" 
ON storage.objects FOR INSERT TO public 
WITH CHECK (bucket_id = 'item-images');

-- 3. Set up Row Level Security (RLS) for the items table
-- For this simple project, we will allow anyone to read, but only admin can insert/update/delete.
-- However, since we are doing admin check via a PIN on the application level, we can just allow all for now, 
-- or disable RLS for simplicity (Not recommended for large apps, but fine for a personal showcase if you don't expose the Supabase keys publicly without limits).

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
  ON items FOR SELECT
  USING ( true );

-- For simplicity in this personal project without proper Auth, we allow insert/update from the app
-- (Security relies on the PIN check in the Next.js API/Server Actions)
CREATE POLICY "Allow insert from anon"
  ON items FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Allow update from anon"
  ON items FOR UPDATE
  USING ( true );

CREATE POLICY "Allow delete from anon"
  ON items FOR DELETE
  USING ( true );

-- Note: In a production app, you should use Supabase Auth and only allow authenticated users to Insert/Update.
