-- Fix function search paths for security

-- Update generate_complaint_id function with search_path
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id text;
  id_exists boolean;
BEGIN
  LOOP
    new_id := 'CMP-' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.complaints WHERE complaint_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$;

-- Update set_complaint_id function with search_path
CREATE OR REPLACE FUNCTION set_complaint_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.complaint_id IS NULL OR NEW.complaint_id = '' THEN
    NEW.complaint_id := generate_complaint_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Update update_updated_at function with search_path
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
