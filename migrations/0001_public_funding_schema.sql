-- Public Crowdfunding Schema for tera-crowdfunding-web
-- This is a separate schema from business_funding (ERP internal) designed
-- for the public-facing Kitabisa-style crowdfunding site.

CREATE SCHEMA IF NOT EXISTS public_funding;

-- Campaign Categories
CREATE TABLE IF NOT EXISTS public_funding.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Campaigns (public facing)
CREATE TABLE IF NOT EXISTS public_funding.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,  -- optional, for multi-tenant
  category_id uuid REFERENCES public_funding.categories(id) ON DELETE SET NULL,
  
  -- Core fields
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  story text,
  
  -- Media
  cover_image_url text,
  organizer_name text NOT NULL DEFAULT '',
  organizer_photo_url text,
  
  -- Financial
  target_amount numeric(18,2) NOT NULL DEFAULT 0 CHECK (target_amount >= 0),
  raised_amount numeric(18,2) NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
  min_donation numeric(18,2) NOT NULL DEFAULT 1000 CHECK (min_donation >= 0),
  
  -- Dates
  start_date timestamptz,
  end_date timestamptz,
  
  -- Status & flags
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  is_urgent boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  
  -- Computed/cached
  donor_count integer NOT NULL DEFAULT 0,
  
  -- Tracking
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Campaign updates (for story timeline)
CREATE TABLE IF NOT EXISTS public_funding.campaign_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public_funding.campaigns(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Donations (public facing)
CREATE TABLE IF NOT EXISTS public_funding.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public_funding.campaigns(id) ON DELETE CASCADE,
  
  -- Donor info
  donor_name text NOT NULL,
  donor_email text,
  donor_phone text,
  
  -- Donation
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  message text,
  is_anonymous boolean NOT NULL DEFAULT false,
  
  -- Payment
  payment_method text NOT NULL DEFAULT 'manual_transfer' CHECK (payment_method IN ('manual_transfer', 'midtrans', 'xendit', 'bank_transfer', 'qris', 'gopay', 'ovo', 'link_aja')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'waiting_payment', 'paid', 'failed', 'expired', 'refunded')),
  payment_proof_url text,
  payment_external_id text,  -- from payment gateway
  paid_at timestamptz,
  
  -- Tracking
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pf_campaigns_status ON public_funding.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_pf_campaigns_slug ON public_funding.campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_pf_campaigns_featured ON public_funding.campaigns(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_pf_campaigns_urgent ON public_funding.campaigns(is_urgent, status);
CREATE INDEX IF NOT EXISTS idx_pf_campaigns_created ON public_funding.campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pf_donations_campaign ON public_funding.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_pf_donations_status ON public_funding.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_pf_campaign_updates_campaign ON public_funding.campaign_updates(campaign_id);

-- Insert default categories
INSERT INTO public_funding.categories (name, slug, icon, "order") VALUES
  ('Bencana Alam', 'bencana-alam', '🌊', 1),
  ('Kemanusiaan', 'kemanusiaan', '🤝', 2),
  ('Kesehatan', 'kesehatan', '🏥', 3),
  ('Pendidikan', 'pendidikan', '📚', 4),
  ('Panti Asuhan', 'panti-asuhan', '🏠', 5),
  ('Musibah & Kecelakaan', 'musibah', '💔', 6),
  ('Lansia & Duafa', 'lansia-duafa', '👴', 7),
  ('Renovasi Ibadah', 'renovasi-ibadah', '🕌', 8),
  ('Hewan & Lingkungan', 'hewan-lingkungan', '🐾', 9),
  ('Kegiatan Sosial', 'kegiatan-sosial', '🎉', 10)
ON CONFLICT (slug) DO NOTHING;

-- Seed a demo campaign so the frontend has data to show
INSERT INTO public_funding.campaigns (
  slug, title, description, story,
  cover_image_url, organizer_name, organizer_photo_url,
  target_amount, raised_amount, donor_count,
  start_date, end_date,
  status, is_urgent, is_featured,
  category_id
) VALUES (
  'bantu-korban-banjir-jakarta',
  'Bantu Korban Banjir Jakarta 2026',
  'Bantu saudara kita yang terdampak banjir di Jakarta dan sekitarnya. Donasi akan digunakan untuk makanan, obat-obatan, dan kebutuhan dasar lainnya.',
  'Banjir telah merendam ribuan rumah di Jakarta sejak awal pekan ini. Ribuan warga terpaksa mengungsi ke tempat-tempat pengungsian yang tersedia.\n\nTim relawan kami sudah berada di lokasi dan mendistribusikan bantuan berupa makanan siap saji, air bersih, dan obat-obatan. Namun stok kami semakin menipis dan kami membutuhkan dukungan dari teman-teman semua.\n\nSetiap donasi yang terkumpul akan digunakan untuk:\n- Paket sembako untuk 500 keluarga\n- Layanan kesehatan darurat\n- Perlengkapan pengungsian (selimut, tikar, dll)\n- Air bersih dan sanitasi\n\nTerima kasih atas segala dukungan dan doa dari #OrangBaik semua 🙏',
  NULL,
  'Yayasan Peduli Sesama',
  NULL,
  250000000, 78500000, 234,
  '2026-06-01 00:00:00+00',
  '2026-07-15 00:00:00+00',
  'active', true, true,
  (SELECT id FROM public_funding.categories WHERE slug = 'bencana-alam')
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public_funding.campaigns (
  slug, title, description, story,
  cover_image_url, organizer_name,
  target_amount, raised_amount, donor_count,
  start_date, end_date,
  status, is_urgent, is_featured,
  category_id
) VALUES (
  'sumur-bersih-untuk-desa-terpencil',
  'Sumur Bersih untuk Desa Terpencil',
  'Bantu akses air bersih untuk 3 desa di Nusa Tenggara Timur yang mengalami kekeringan parah.',
  'Desa-desa di NTT telah mengalami kekeringan selama berbulan-bulan. Warga harus berjalan kaki hingga 5 km untuk mendapatkan air bersih.\n\nKami berencana membangun 5 sumur bor di 3 desa yang paling parah terdampak. Setiap sumur akan dilengkapi dengan pompa air tenaga surya agar berkelanjutan.\n\nTarget dana mencakup:\n- Pembangunan 5 sumur bor\n- Pompa air tenaga surya\n- Pipa distribusi ke rumah-rumah\n- Pelatihan perawatan untuk warga',
  NULL,
  'Yayasan Air Untuk Semua',
  180000000, 45000000, 89,
  '2026-05-20 00:00:00+00',
  '2026-08-20 00:00:00+00',
  'active', false, true,
  (SELECT id FROM public_funding.categories WHERE slug = 'kemanusiaan')
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public_funding.campaigns (
  slug, title, description, story,
  cover_image_url, organizer_name,
  target_amount, raised_amount, donor_count,
  start_date, end_date,
  status, is_urgent, is_featured,
  category_id
) VALUES (
  'bantu-operasi-jantung-azka',
  'Bantu Operasi Jantung Azka (3 Tahun)',
  'Azka membutuhkan operasi jantung segera. Bantu kami mewujudkan senyum sehat untuk Azka.',
  'Azka, balita berusia 3 tahun asal Bandung, terdiagnosis kelainan jantung bawaan sejak lahir. Dokter menyarankan operasi secepatnya.\n\nBiaya operasi dan perawatan mencapai Rp 150 juta, sementara orang tua Azka hanya bisa mengumpulkan sebagian.\n\nMari bantu Azka mendapatkan kesempatan untuk tumbuh sehat seperti anak-anak lainnya. Setiap rupiah dari #OrangBaik sangat berarti bagi masa depan Azka.',
  NULL,
  'Komunitas Peduli Anak',
  150000000, 120000000, 567,
  '2026-05-01 00:00:00+00',
  '2026-06-30 00:00:00+00',
  'active', true, false,
  (SELECT id FROM public_funding.categories WHERE slug = 'kesehatan')
) ON CONFLICT (slug) DO NOTHING;
