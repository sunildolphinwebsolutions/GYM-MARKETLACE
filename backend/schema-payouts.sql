-- Create Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id SERIAL PRIMARY KEY,
    gym_owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid', 'failed')),
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add payout_id to Payments Table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payout_id INTEGER REFERENCES payouts(id) ON DELETE SET NULL;
