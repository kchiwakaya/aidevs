-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  share_code TEXT UNIQUE DEFAULT SUBSTRING(REPLACE(uuid_generate_v4()::text, '-', ''), 1, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  voter_ip INET, -- For anonymous voting tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraints for preventing duplicate votes
-- Note: These constraints will be handled by the application logic for polls that allow multiple votes
CREATE UNIQUE INDEX unique_user_vote_per_poll 
  ON votes(poll_id, user_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX unique_ip_vote_per_poll 
  ON votes(poll_id, voter_ip) 
  WHERE voter_ip IS NOT NULL AND user_id IS NULL;

-- Create indexes for better performance
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_polls_user_id ON polls(user_id);
CREATE INDEX idx_polls_share_code ON polls(share_code);
CREATE INDEX idx_polls_expires_at ON polls(expires_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_voter_ip ON votes(voter_ip);

-- Create function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options 
    SET votes = votes + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options 
    SET votes = votes - 1 
    WHERE id = OLD.option_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
CREATE TRIGGER update_vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_count();

-- Create function to check if user can vote
CREATE OR REPLACE FUNCTION can_user_vote(
  p_poll_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_voter_ip INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  poll_allows_multiple BOOLEAN;
  existing_vote_count INTEGER;
BEGIN
  -- Get poll settings
  SELECT allow_multiple_votes INTO poll_allows_multiple
  FROM polls 
  WHERE id = p_poll_id AND is_active = true 
  AND (expires_at IS NULL OR expires_at > NOW());
  
  -- If poll not found or inactive, return false
  IF poll_allows_multiple IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If poll allows multiple votes, always return true
  IF poll_allows_multiple THEN
    RETURN TRUE;
  END IF;
  
  -- Check for existing votes
  SELECT COUNT(*) INTO existing_vote_count
  FROM votes 
  WHERE poll_id = p_poll_id 
  AND (
    (p_user_id IS NOT NULL AND user_id = p_user_id) OR
    (p_user_id IS NULL AND p_voter_ip IS NOT NULL AND voter_ip = p_voter_ip)
  );
  
  RETURN existing_vote_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls table
CREATE POLICY "Polls are viewable by everyone" ON polls
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Anyone can create polls" ON polls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for poll_options table
CREATE POLICY "Poll options are viewable for active polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

CREATE POLICY "Poll creators can manage options" ON poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.user_id = auth.uid()
    )
  );

-- Create policies for votes table
CREATE POLICY "Votes are viewable for active polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
    )
  );

CREATE POLICY "Users can vote on active polls" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON polls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
