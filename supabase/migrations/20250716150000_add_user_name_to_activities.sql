/*
  # [Schema Modification] Add user_name to activities table
  This migration adds a 'user_name' column to the 'activities' table to store the email of the user who performed an action. This resolves an error where the application tries to insert into a non-existent column.

  ## Query Description: 
  This operation adds a new 'user_name' text column to the 'activities' table. It is a non-destructive change and will not affect existing data, though the new column will be NULL for old records.
  
  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Table 'activities':
    - ADD COLUMN 'user_name' (text)
  
  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: No
  - Auth Requirements: This change does not alter existing RLS policies.
  
  ## Performance Impact:
  - Indexes: None
  - Triggers: None
  - Estimated Impact: Low. Adding a column to the table is a fast operation.
*/
ALTER TABLE public.activities
ADD COLUMN user_name TEXT;
