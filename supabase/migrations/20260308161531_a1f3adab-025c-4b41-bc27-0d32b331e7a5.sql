
INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-photos', 'complaint-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

CREATE POLICY "Anyone can upload complaint photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'complaint-photos');
CREATE POLICY "Anyone can view complaint photos" ON storage.objects FOR SELECT USING (bucket_id = 'complaint-photos');
CREATE POLICY "Anyone can upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos');
CREATE POLICY "Anyone can view profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');

CREATE TABLE public.citizen_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aadhaar_hash text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT 'Citizen',
  father_name text DEFAULT '',
  dob text DEFAULT '',
  gender text DEFAULT '',
  address text DEFAULT '',
  ward text DEFAULT '',
  city text DEFAULT 'Ahmedabad',
  state text DEFAULT 'Gujarat',
  pincode text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  photo_url text DEFAULT '',
  blood_group text DEFAULT '',
  suvidha_card_id text UNIQUE DEFAULT ('SVD-' || substr(md5(random()::text), 1, 12)),
  total_transactions integer DEFAULT 0,
  total_bills_paid numeric DEFAULT 0,
  complaints_filed integer DEFAULT 0,
  certificates_applied integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.citizen_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read profiles" ON public.citizen_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.citizen_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.citizen_profiles FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_profiles;
