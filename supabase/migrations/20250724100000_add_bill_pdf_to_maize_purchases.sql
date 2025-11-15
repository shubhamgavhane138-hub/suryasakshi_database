/*
          # [Operation Name]
          Add Bill PDF URL to Maize Purchases

          ## Query Description: [This operation adds a new 'bill_pdf_url' column to the 'maize_purchases' table to store URLs for uploaded bill PDFs. It is a non-destructive change and will not affect existing data; the new column will be populated with NULL for all current records.]

          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]

          ## Structure Details:
          - Table Affected: maize_purchases
          - Column Added: bill_pdf_url (TEXT, NULLABLE)

          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [Authenticated users will need appropriate storage policies to upload/view files.]

          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Negligible performance impact on table operations.]
          */
		ALTER TABLE public.maize_purchases
		ADD COLUMN bill_pdf_url TEXT;
