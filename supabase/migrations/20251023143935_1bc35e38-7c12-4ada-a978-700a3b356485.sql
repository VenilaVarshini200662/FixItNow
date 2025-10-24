-- Add personal details and category fields to complaints table
ALTER TABLE public.complaints
ADD COLUMN name TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN email TEXT,
ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
