-- Drop existing table if it exists (optional, be careful!)
-- DROP TABLE IF EXISTS comments;

-- Create comments table for Eren Store
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_game ON comments(game);

-- Insert sample comments with realistic Egyptian gamer data
INSERT INTO comments (name, game, comment, created_at) VALUES 
('أحمد محمد', 'Free Fire Diamonds', 'خدمة ممتازة والشحن سريع جداً! شكراً لكم 🎮', NOW() - INTERVAL '5 days'),
('سارة علي', 'PUBG UC', 'أفضل موقع شحن جربته، الأسعار كويسة والدعم ممتاز 👍', NOW() - INTERVAL '4 days'),
('محمود حسن', 'Valorant Points', 'شحن فوري وآمن، أنصح بالموقع بشدة ⭐⭐⭐⭐⭐', NOW() - INTERVAL '3 days'),
('فاطمة رحمة', '8 Ball Pool Coins', 'تجربة رائعة جداً، أول مرة اشتري من هنا والحمد لله كويسة', NOW() - INTERVAL '2 days'),
('محمد إبراهيم', 'CrossFire ZP', 'الخدمة دي أحسن حاجة جربتها، أسعار منخفضة وخدمة سريعة', NOW() - INTERVAL '1 day'),
('ليلى نور', 'Discord Effects', 'فكرة حلوة جداً، الديسكورد إفكتس حلو والأسعار معقولة', NOW() - INTERVAL '12 hours'),
('عمرو صالح', 'Free Fire Diamonds', 'شحنت كام مرة من هنا والحمد لله كل مرة تمام، الموقع موثوق', NOW() - INTERVAL '10 hours'),
('منة الله علي', 'Valorant Points', 'أنا لاعبة فالورانت وبصراحة هنا أفضل سعر في السوق 💯', NOW() - INTERVAL '8 hours'),
('خالد نور الدين', 'PUBG UC', 'والله حلو الموقع، شحن فوري وآمن ومافيش مشاكل إطلاقاً', NOW() - INTERVAL '6 hours'),
('مريم أحمد', '8 Ball Pool Coins', 'أختي اشترت منهم وكانت تجربة رائعة، أنصح جميع اللاعبين', NOW() - INTERVAL '4 hours');

-- Verify the data was inserted
SELECT COUNT(*) as total_comments FROM comments;

-- Display all comments
SELECT id, name, game, comment, created_at FROM comments ORDER BY created_at DESC;
