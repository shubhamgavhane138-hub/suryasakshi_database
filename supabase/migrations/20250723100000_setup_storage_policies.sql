/*
# [Operation Name]
Setup Storage Buckets and RLS Policies

[Description of what this operation does]
This script ensures the necessary storage buckets ('invoices', 'bills') exist and applies the required Row-Level Security (RLS) policies. These policies are crucial for allowing authenticated users to upload, view, update, and delete their own files securely. Applying this migration will fix the 'violates row-level security policy' error and enable file uploads for both Silage Sales and Maize Purchases.

## Query Description: [This operation configures security for file storage. It creates storage buckets if they don't exist and sets permissions for users to manage their own files. This is a safe and necessary step for enabling file uploads.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- storage.buckets: Inserts 'invoices' and 'bills' if not present.
- storage.objects: Applies RLS policies for SELECT, INSERT, UPDATE, DELETE on objects within the 'invoices' and 'bills' buckets.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Policies are applied for the 'authenticated' role.]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible performance impact. Enables secure file storage operations.]
*/

-- Create 'invoices' bucket if it doesn't exist
-- This will fail gracefully if the bucket already exists.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (name) DO NOTHING;

-- Create 'bills' bucket for maize purchases
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('bills', 'bills', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (name) DO NOTHING;


-- Policies for 'invoices' bucket
DROP POLICY IF EXISTS "Allow authenticated select on own invoices" ON storage.objects;
CREATE POLICY "Allow authenticated select on own invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'invoices' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Allow authenticated insert on invoices" ON storage.objects;
CREATE POLICY "Allow authenticated insert on invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

DROP POLICY IF EXISTS "Allow authenticated update on own invoices" ON storage.objects;
CREATE POLICY "Allow authenticated update on own invoices"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'invoices' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Allow authenticated delete on own invoices" ON storage.objects;
CREATE POLICY "Allow authenticated delete on own invoices"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'invoices' AND auth.uid() = owner);


-- Policies for 'bills' bucket
DROP POLICY IF EXISTS "Allow authenticated select on own bills" ON storage.objects;
CREATE POLICY "Allow authenticated select on own bills"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'bills' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Allow authenticated insert on bills" ON storage.objects;
CREATE POLICY "Allow authenticated insert on bills"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bills');

DROP POLICY IF EXISTS "Allow authenticated update on own bills" ON storage.objects;
CREATE POLICY "Allow authenticated update on own bills"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bills' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Allow authenticated delete on own bills" ON storage.objects;
CREATE POLICY "Allow authenticated delete on own bills"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bills' AND auth.uid() = owner);
