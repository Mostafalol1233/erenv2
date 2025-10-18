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

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id BIGSERIAL PRIMARY KEY,
  comments_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_packages_game ON packages(game_name);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_comments_game ON comments(game);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- Insert admin settings if not exists
INSERT INTO admin_settings (comments_enabled) 
SELECT true 
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Insert initial packages data
DELETE FROM packages;
INSERT INTO packages (game_name, amount, price, description, is_active) VALUES
-- CrossFire ZP
('CrossFire ZP', '5,000 ZP', 125, 'Basic pack', true),
('CrossFire ZP', '10,000 ZP', 245, 'Standard pack', true),
('CrossFire ZP', '20,000 ZP', 465, 'Popular pack', true),
('CrossFire ZP', '50,000 ZP', 1135, 'Premium pack', true),
('CrossFire ZP', '100,000 ZP', 2325, 'Ultimate pack', true),

-- Valorant Points
('Valorant Points', '475 VP', 245, 'Starter pack', true),
('Valorant Points', '1000 VP', 488, 'Standard pack', true),
('Valorant Points', '2050 VP', 974, 'Popular pack', true),
('Valorant Points', '3650 VP', 1720, 'Premium pack', true),
('Valorant Points', '5350 VP', 2440, 'Best value', true),
('Valorant Points', '11000 VP', 4900, 'Ultimate pack', true),

-- PUBG UC
('PUBG UC', '60 UC', 48, 'Basic pack', true),
('PUBG UC', '300 + 25 UC', 242, 'Standard pack', true),
('PUBG UC', '600 + 60 UC', 470, 'Popular pack', true),
('PUBG UC', '1500 + 300 UC', 1165, 'Premium pack', true),
('PUBG UC', '3000 + 850 UC', 2290, 'Best value', true),
('PUBG UC', '6000 + 2100 UC', 4580, 'Ultimate pack', true),

-- Free Fire Diamonds
('Free Fire Diamonds', '100 + 10 Diamonds', 65, 'Basic pack', true),
('Free Fire Diamonds', '210 + 21 Diamonds', 130, 'Standard pack', true),
('Free Fire Diamonds', '530 + 53 Diamonds', 314, 'Popular pack', true),
('Free Fire Diamonds', '1080 + 108 Diamonds', 610, 'Premium pack', true),
('Free Fire Diamonds', '2200 + 220 Diamonds', 1220, 'Ultimate pack', true),

-- 8 Ball Pool Coins
('8 Ball Pool Coins', '20,000 Coins', 16, 'Basic pack', true),
('8 Ball Pool Coins', '52,000 Coins', 47, 'Standard pack', true),
('8 Ball Pool Coins', '112,000 Coins', 90, 'Popular pack', true),
('8 Ball Pool Coins', '256,000 Coins', 172, 'Premium pack', true),
('8 Ball Pool Coins', '800,000 Coins', 420, 'Best value', true),
('8 Ball Pool Coins', '2 Million Coins', 840, 'Ultimate pack', true);
