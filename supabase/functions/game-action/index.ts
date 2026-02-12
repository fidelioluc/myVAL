import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COOL_WORDS = [
  "Shadow","Vortex","Cipher","Phantom","Nebula","Raven","Glacier","Thunder","Mirage","Obsidian",
  "Blaze","Specter","Titan","Eclipse","Nomad","Falcon","Apex","Drift","Onyx","Havoc",
  "Wraith","Zenith","Pulse","Ember","Frostbite","Venom","Horizon","Tempest","Cobalt","Abyss",
  "Crimson","Dagger","Lynx","Prism","Volt","Stealth","Cascade","Raptor","Sable","Flux",
  "Mercury","Prowl","Inferno","Quartz","Surge","Bandit","Oracle","Magnet","Recon","Neon",
];

const MAX_TURNS = 7;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMap() {
  const agentCount = Math.floor(Math.random() * 4) + 6;
  const roles: string[] = Array(25).fill("neutral");
  const indices = shuffle(Array.from({ length: 25 }, (_, i) => i));
  for (let i = 0; i < agentCount; i++) roles[indices[i]] = "agent";
  for (let i = agentCount; i < agentCount + 3; i++) roles[indices[i]] = "assassin";
  return { roles, agentCount };
}

// Strip opponent's map from game data so players can't cheat
function sanitizeForPlayer(game: Record<string, unknown>, playerId: string) {
  const sanitized = { ...game };
  if (game.player1_id === playerId) {
    // Player 1: can see player1_map, hide player2_map
    sanitized.player2_map = null;
  } else if (game.player2_id === playerId) {
    // Player 2: can see player2_map, hide player1_map
    sanitized.player1_map = null;
  }
  return sanitized;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, gameId, code, playerId, clue, clueNumber, guesses } = await req.json();

    if (action === "create") {
      const words = shuffle(COOL_WORDS).slice(0, 25);
      const { data, error } = await supabase
        .from("games")
        .insert({
          words,
          player1_id: playerId,
          player1_map: generateMap(),
          player2_map: generateMap(),
          phase: "lobby",
        })
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(sanitizeForPlayer(data, playerId));
    }

    if (action === "join") {
      const { data: game, error: fetchErr } = await supabase
        .from("games")
        .select("*")
        .eq("code", code)
        .single();
      if (fetchErr || !game) return jsonResponse({ error: "Game not found" }, 404);

      if (game.player1_id === playerId) {
        return jsonResponse(sanitizeForPlayer(game, playerId));
      }
      if (game.player2_id && game.player2_id !== playerId) {
        return jsonResponse({ error: "Game is full" }, 400);
      }
      if (!game.player2_id) {
        const { data, error } = await supabase
          .from("games")
          .update({ player2_id: playerId })
          .eq("id", game.id)
          .select()
          .single();
        if (error) throw error;
        return jsonResponse(sanitizeForPlayer(data!, playerId));
      }
      return jsonResponse(sanitizeForPlayer(game, playerId));
    }

    if (action === "get") {
      const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();
      if (!game) throw new Error("Game not found");
      return jsonResponse(sanitizeForPlayer(game, playerId));
    }

    if (action === "ready") {
      const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();
      if (!game) throw new Error("Game not found");

      const isP1 = game.player1_id === playerId;
      const isP2 = game.player2_id === playerId;
      if (!isP1 && !isP2) throw new Error("Not in this game");

      const update: Record<string, unknown> = {};
      if (isP1) update.player1_ready = true;
      if (isP2) update.player2_ready = true;

      const otherReady = isP1 ? game.player2_ready : game.player1_ready;
      if (otherReady) update.phase = "spymaster";

      const { data, error } = await supabase.from("games").update(update).eq("id", gameId).select().single();
      if (error) throw error;
      return jsonResponse(sanitizeForPlayer(data!, playerId));
    }

    if (action === "clue") {
      const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();
      if (!game) throw new Error("Game not found");
      if (game.phase !== "spymaster") throw new Error("Not in spymaster phase");

      const isSpymaster =
        (game.turn === "player1" && game.player1_id === playerId) ||
        (game.turn === "player2" && game.player2_id === playerId);
      if (!isSpymaster) throw new Error("Not your turn to give a clue");
      if (!clue || !clue.trim()) throw new Error("Clue required");

      const { data, error } = await supabase
        .from("games")
        .update({ clue: clue.trim(), clue_number: clueNumber || 1, phase: "guessing" })
        .eq("id", gameId)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(sanitizeForPlayer(data!, playerId));
    }

    if (action === "guess") {
      const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();
      if (!game) throw new Error("Game not found");
      if (game.phase !== "guessing") throw new Error("Not in guessing phase");

      const guesserRole = game.turn === "player1" ? "player2" : "player1";
      const isGuesser =
        (guesserRole === "player1" && game.player1_id === playerId) ||
        (guesserRole === "player2" && game.player2_id === playerId);
      if (!isGuesser) throw new Error("Not your turn to guess");
      if (!guesses || guesses.length === 0) throw new Error("No guesses");

      const allFound = [...(game.found_player1 || []), ...(game.found_player2 || [])];
      for (const g of guesses) {
        if (allFound.includes(g)) throw new Error(`Card ${g} already found`);
        if (g < 0 || g > 24) throw new Error(`Invalid card index ${g}`);
      }

      const guesserMap = guesserRole === "player1" ? game.player1_map : game.player2_map;
      const results = guesses.map((i: number) => ({ index: i, role: guesserMap.roles[i] }));

      const hitAssassin = results.some((r: { role: string }) => r.role === "assassin");
      const newFoundP1 = [...(game.found_player1 || [])];
      const newFoundP2 = [...(game.found_player2 || [])];

      results.forEach((r: { index: number; role: string }) => {
        if (r.role === "agent") {
          if (guesserRole === "player1" && !newFoundP1.includes(r.index)) newFoundP1.push(r.index);
          if (guesserRole === "player2" && !newFoundP2.includes(r.index)) newFoundP2.push(r.index);
        }
      });

      const newTurnCount = game.turn_count + 1;
      const allAgentsFound =
        newFoundP1.length >= game.player1_map.agentCount &&
        newFoundP2.length >= game.player2_map.agentCount;

      let newPhase = "reveal";
      let winner: string | null = null;

      if (hitAssassin) { newPhase = "finished"; winner = "lost"; }
      else if (allAgentsFound) { newPhase = "finished"; winner = "won"; }
      else if (newTurnCount >= MAX_TURNS) { newPhase = "finished"; winner = "lost"; }

      const { data, error } = await supabase
        .from("games")
        .update({
          guesses, found_player1: newFoundP1, found_player2: newFoundP2,
          reveal_results: results, hit_assassin: hitAssassin,
          turn_count: newTurnCount, phase: newPhase, winner,
        })
        .eq("id", gameId)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(sanitizeForPlayer(data!, playerId));
    }

    if (action === "next_turn") {
      const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();
      if (!game) throw new Error("Game not found");
      if (game.phase !== "reveal") throw new Error("Not in reveal phase");

      const nextTurn = game.turn === "player1" ? "player2" : "player1";
      const { data, error } = await supabase
        .from("games")
        .update({ turn: nextTurn, phase: "spymaster", clue: null, clue_number: 1, guesses: [], reveal_results: [] })
        .eq("id", gameId)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(sanitizeForPlayer(data!, playerId));
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
