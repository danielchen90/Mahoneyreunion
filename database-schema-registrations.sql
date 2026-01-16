-- ============================================================================
-- MAHONEY FAMILY REUNION - REGISTRATION TABLES
-- Stores registration, payment, and attendee data from Stripe checkout
-- ============================================================================

-- Registrations table (main registration record)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  adults INTEGER NOT NULL DEFAULT 0,
  children INTEGER NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_type VARCHAR(50) NOT NULL, -- 'deposit' or 'full_payment'
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table (tracks all payment transactions)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'pending', 'failed', 'refunded'
  payment_method VARCHAR(50), -- 'card', 'paypal', etc.
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendees table (individual attendee details)
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  age_group VARCHAR(50), -- 'adult' or 'child'
  dietary_restrictions TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_stripe_session_id ON registrations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attendees_registration_id ON attendees(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_created_at ON attendees(created_at DESC);

-- Add comments to tables
COMMENT ON TABLE registrations IS 'Main registration records for family reunion';
COMMENT ON TABLE payments IS 'Payment transaction records from Stripe';
COMMENT ON TABLE attendees IS 'Individual attendee information for each registration';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('registrations', 'payments', 'attendees')
ORDER BY table_name;

-- View table structures
-- \d registrations
-- \d payments
-- \d attendees

