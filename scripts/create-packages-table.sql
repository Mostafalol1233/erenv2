-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id BIGSERIAL PRIMARY KEY,
  game_name VARCHAR(255) NOT NULL,
  amount VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_packages_game ON packages(game_name);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);

-- Insert initial data
INSERT INTO packages (game_name, amount, price, description) VALUES
-- CrossFire ZP
('CrossFire ZP', '5,000 ZP', 125, 'Basic pack'),
('CrossFire ZP', '10,000 ZP', 245, 'Standard pack'),
('CrossFire ZP', '20,000 ZP', 465, 'Popular pack'),
('CrossFire ZP', '50,000 ZP', 1135, 'Premium pack'),
('CrossFire ZP', '100,000 ZP', 2325, 'Ultimate pack'),

-- Valorant Points
('Valorant Points', '475 VP', 245, 'Starter pack'),
('Valorant Points', '1000 VP', 488, 'Standard pack'),
('Valorant Points', '2050 VP', 974, 'Popular pack'),
('Valorant Points', '3650 VP', 1720, 'Premium pack'),
('Valorant Points', '5350 VP', 2440, 'Best value'),
('Valorant Points', '11000 VP', 4900, 'Ultimate pack'),

-- PUBG UC
('PUBG UC', '60 UC', 48, 'Basic pack'),
('PUBG UC', '300 + 25 UC', 242, 'Standard pack'),
('PUBG UC', '600 + 60 UC', 470, 'Popular pack'),
('PUBG UC', '1500 + 300 UC', 1165, 'Premium pack'),
('PUBG UC', '3000 + 850 UC', 2290, 'Best value'),
('PUBG UC', '6000 + 2100 UC', 4580, 'Ultimate pack'),

-- Free Fire Diamonds
('Free Fire Diamonds', '100 + 10 Diamonds', 65, 'Basic pack'),
('Free Fire Diamonds', '210 + 21 Diamonds', 130, 'Standard pack'),
('Free Fire Diamonds', '530 + 53 Diamonds', 314, 'Popular pack'),
('Free Fire Diamonds', '1080 + 108 Diamonds', 610, 'Premium pack'),
('Free Fire Diamonds', '2200 + 220 Diamonds', 1220, 'Ultimate pack'),

-- 8 Ball Pool Coins
('8 Ball Pool Coins', '20,000 Coins', 16, 'Basic pack'),
('8 Ball Pool Coins', '52,000 Coins', 47, 'Standard pack'),
('8 Ball Pool Coins', '112,000 Coins', 90, 'Popular pack'),
('8 Ball Pool Coins', '256,000 Coins', 172, 'Premium pack'),
('8 Ball Pool Coins', '800,000 Coins', 420, 'Best value'),
('8 Ball Pool Coins', '2 Million Coins', 840, 'Ultimate pack');
