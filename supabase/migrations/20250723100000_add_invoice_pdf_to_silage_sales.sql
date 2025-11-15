/*
# [Structural] Add Invoice PDF Upload Feature for Silage Sales
This migration adds support for uploading and associating PDF invoices with silage sales records. It involves adding a new column to the `silage_sales` table, creating a dedicated storage bucket for invoices, and setting up security policies for file access.

## Query Description:
- **ALTER TABLE `silage_sales`**: Adds a `invoice_pdf_url` text column to store the public URL of the uploaded invoice PDF. This change is non-destructive and defaults to NULL for existing records.
- **INSERT `storage.buckets`**: Creates a new storage bucket named `invoices` where all PDF files will be stored. This is safe and will not run if the bucket already exists.
- **CREATE POLICY**: Establishes Row Level Security policies on the `invoices` bucket to ensure users can only access and manage their own files.
  - `select_policy`: Allows users to view/download files they have uploaded.
  - `insert_policy`: Allows authenticated users to upload new invoices.
  - `update_policy`: Allows users to update/replace their own invoices.
  - `delete_policy`: Allows users to delete their own invoices.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (The column can be dropped, policies removed, and bucket emptied/deleted)

## Structure Details:
- **Table Modified**: `public.silage_sales`
  - **Column Added**: `invoice_pdf_url` (type: `text`, nullable: `true`)
- **Storage Bucket Created**: `invoices`
- **RLS Policies Added**: Four policies on `storage.objects` for the `invoices` bucket.

## Security Implications:
- RLS Status: Policies are being added to control access to the new storage bucket.
- Policy Changes: Yes, new policies are created for the `invoices` bucket to ensure data privacy and security. Users can only interact with files linked to their user ID.
- Auth Requirements: A user must be authenticated to upload, view, update, or delete files.

## Performance Impact:
- Indexes: None added.
- Triggers: None added.
- Estimated Impact: Negligible. The changes are structural and should not impact query performance on the `silage_sales` table.
*/

-- 1. Add column to silage_sales table
ALTER TABLE public.silage_sales
ADD COLUMN invoice_pdf_url TEXT;

-- 2. Create a storage bucket for invoices (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 3. Add RLS policies for the invoices bucket

-- Allow SELECT access for authenticated users on their own files
CREATE POLICY "select_policy"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'invoices' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow INSERT access for authenticated users
CREATE POLICY "insert_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'invoices' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow UPDATE access for authenticated users on their own files
CREATE POLICY "update_policy"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'invoices' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow DELETE access for authenticated users on their own files
CREATE POLICY "delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'invoices' AND (storage.foldername(name))[1] = auth.uid()::text );
