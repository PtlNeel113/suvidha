
-- Transactions table for all bill payments
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aadhaar_hash TEXT NOT NULL,
  citizen_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('electricity', 'water', 'gas', 'waste', 'certificate', 'scheme')),
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  provider TEXT,
  reference_id TEXT,
  ward TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT UNIQUE NOT NULL,
  aadhaar_hash TEXT NOT NULL,
  citizen_name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  ward TEXT NOT NULL,
  location TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated', 'rejected')),
  assigned_to TEXT,
  resolution_notes TEXT,
  photo_url TEXT,
  ai_fraud_score NUMERIC(3,2) DEFAULT 0,
  resolved_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificate applications
CREATE TABLE public.certificate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  aadhaar_hash TEXT NOT NULL,
  citizen_name TEXT NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('income', 'caste', 'domicile', 'birth', 'death', 'marriage', 'ews')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'ready_for_collection')),
  ward TEXT,
  documents JSONB DEFAULT '[]',
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scheme applications
CREATE TABLE public.scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  aadhaar_hash TEXT NOT NULL,
  citizen_name TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  eligibility_status TEXT NOT NULL DEFAULT 'checking' CHECK (eligibility_status IN ('checking', 'eligible', 'not_eligible', 'approved', 'disbursed')),
  amount NUMERIC(12,2),
  ward TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kiosk tracking
CREATE TABLE public.kiosks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kiosk_id TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  ward TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Ahmedabad',
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  total_transactions INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily analytics aggregation
CREATE TABLE public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ward TEXT,
  bills_paid INTEGER DEFAULT 0,
  certificates_issued INTEGER DEFAULT 0,
  complaints_filed INTEGER DEFAULT 0,
  complaints_resolved INTEGER DEFAULT 0,
  schemes_applied INTEGER DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  avg_queue_time_saved INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date, ward)
);

-- Enable RLS on all tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies for kiosk app (no auth - Aadhaar based)
CREATE POLICY "Anyone can read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update complaints" ON public.complaints FOR UPDATE USING (true);

CREATE POLICY "Anyone can read certificates" ON public.certificate_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert certificates" ON public.certificate_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update certificates" ON public.certificate_applications FOR UPDATE USING (true);

CREATE POLICY "Anyone can read schemes" ON public.scheme_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert schemes" ON public.scheme_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read kiosks" ON public.kiosks FOR SELECT USING (true);
CREATE POLICY "Anyone can manage kiosks" ON public.kiosks FOR ALL USING (true);

CREATE POLICY "Anyone can read analytics" ON public.daily_analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can manage analytics" ON public.daily_analytics FOR ALL USING (true);

-- Enable realtime for complaints (for admin live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
