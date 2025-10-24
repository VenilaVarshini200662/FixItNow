-- Create complaints table
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id text UNIQUE NOT NULL,
  language text NOT NULL,
  description text NOT NULL,
  voice_description_url text,
  image_url text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create complaints (public service)
CREATE POLICY "Anyone can create complaints"
ON public.complaints
FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can view complaints
CREATE POLICY "Anyone can view complaints"
ON public.complaints
FOR SELECT
USING (true);

-- Policy: Anyone can update complaint status (will be admin-only in UI)
CREATE POLICY "Anyone can update complaint status"
ON public.complaints
FOR UPDATE
USING (true);

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true);

-- Storage policies for complaint images
CREATE POLICY "Anyone can upload complaint images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'complaint-images');

CREATE POLICY "Anyone can view complaint images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'complaint-images');

-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-voice', 'complaint-voice', true);

-- Storage policies for voice recordings
CREATE POLICY "Anyone can upload voice recordings"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'complaint-voice');

CREATE POLICY "Anyone can view voice recordings"
ON storage.objects
FOR SELECT
USING (bucket_id = 'complaint-voice');

-- Function to generate unique complaint ID
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS text
LANGUAGE plpgsql
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

-- Trigger to auto-generate complaint_id
CREATE OR REPLACE FUNCTION set_complaint_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.complaint_id IS NULL OR NEW.complaint_id = '' THEN
    NEW.complaint_id := generate_complaint_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_complaint
BEFORE INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION set_complaint_id();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_update_complaint
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
