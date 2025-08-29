-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create polls" ON polls;

-- Create a new permissive policy for anonymous poll creation
CREATE POLICY "Anyone can create polls" ON polls
  FOR INSERT WITH CHECK (true);
