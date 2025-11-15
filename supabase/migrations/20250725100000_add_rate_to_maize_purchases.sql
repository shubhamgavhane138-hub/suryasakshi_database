/*
          # [Operation Name]
          Add 'rate' column to 'maize_purchases' table

          ## Query Description: [This operation adds a new 'rate' column to the 'maize_purchases' table to store the purchase rate per kilogram. This change is necessary to fix an application error caused by a mismatch between the application code and the database schema. No existing data will be lost, and the new column will be populated with a default value of 0 for existing rows.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: maize_purchases
          - Column Added: rate (numeric, NOT NULL, default 0)
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact. Adding a column with a default value may cause a brief table lock on very large tables, but it is generally a fast operation.
          */
ALTER TABLE public.maize_purchases
ADD COLUMN rate numeric NOT NULL DEFAULT 0;
