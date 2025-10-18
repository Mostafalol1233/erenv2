-- Create comments table for Eren Store
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Insert some sample comments
INSERT INTO comments (name, game, comment) VALUES 
('أحمد محمد', 'Free Fire Diamonds', 'خدمة ممتازة والشحن سريع جداً! شكراً لكم'),
('سارة علي', 'PUBG UC', 'أفضل موقع شحن جربته، الأسعار كويسة والدعم ممتاز'),
('محمود حسن', 'Valorant Points', 'شحن فوري وآمن، أنصح بالموقع بشدة');
