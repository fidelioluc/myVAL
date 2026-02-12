
-- Games table storing all game state
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text), 1, 6),
  player1_id TEXT,
  player2_id TEXT,
  player1_ready BOOLEAN NOT NULL DEFAULT false,
  player2_ready BOOLEAN NOT NULL DEFAULT false,
  words TEXT[] NOT NULL DEFAULT '{}',
  player1_map JSONB,
  player2_map JSONB,
  turn TEXT NOT NULL DEFAULT 'player1' CHECK (turn IN ('player1', 'player2')),
  phase TEXT NOT NULL DEFAULT 'lobby' CHECK (phase IN ('lobby', 'spymaster', 'guessing', 'reveal', 'finished')),
  clue TEXT,
  clue_number INTEGER DEFAULT 1,
  guesses INTEGER[] NOT NULL DEFAULT '{}',
  found_player1 INTEGER[] NOT NULL DEFAULT '{}',
  found_player2 INTEGER[] NOT NULL DEFAULT '{}',
  reveal_results JSONB DEFAULT '[]',
  hit_assassin BOOLEAN NOT NULL DEFAULT false,
  turn_count INTEGER NOT NULL DEFAULT 0,
  winner TEXT CHECK (winner IN ('won', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS - this is a casual game without auth, identified by session tokens
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read games (they need the code to find them)
CREATE POLICY "Anyone can read games" ON public.games FOR SELECT USING (true);

-- Allow anyone to insert games
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);

-- Allow anyone to update games (validation happens in edge function)
CREATE POLICY "Anyone can update games" ON public.games FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW
EXECUTE FUNCTION public.update_games_updated_at();
