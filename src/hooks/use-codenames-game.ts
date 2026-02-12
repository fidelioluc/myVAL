import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Player = "player1" | "player2";
export type Phase = "lobby" | "spymaster" | "guessing" | "reveal" | "finished";
export type CardRole = "agent" | "assassin" | "neutral";

export interface GameState {
  id: string;
  code: string;
  player1_id: string | null;
  player2_id: string | null;
  player1_ready: boolean;
  player2_ready: boolean;
  words: string[];
  player1_map: { roles: CardRole[]; agentCount: number } | null;
  player2_map: { roles: CardRole[]; agentCount: number } | null;
  turn: Player;
  phase: Phase;
  clue: string | null;
  clue_number: number;
  guesses: number[];
  found_player1: number[];
  found_player2: number[];
  reveal_results: { index: number; role: CardRole }[];
  hit_assassin: boolean;
  turn_count: number;
  winner: "won" | "lost" | null;
}

const PLAYER_ID_KEY = "codenames-player-id";

function getPlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

async function callAction(body: Record<string, unknown>) {
  const res = await supabase.functions.invoke("game-action", { body });
  if (res.error) throw new Error(res.error.message);
  if (res.data?.error) throw new Error(res.data.error);
  return res.data as GameState;
}

export function useCodenamesGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerId = getPlayerId();

  const myRole: Player | null = game
    ? game.player1_id === playerId
      ? "player1"
      : game.player2_id === playerId
      ? "player2"
      : null
    : null;

  // Realtime subscription - re-fetch sanitized data on changes
  useEffect(() => {
    if (!game?.id) return;
    const channel = supabase
      .channel(`game-${game.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${game.id}` },
        async () => {
          // Re-fetch via edge function to get sanitized data (no opponent map)
          try {
            const data = await callAction({ action: "get", gameId: game.id, playerId });
            setGame(data);
          } catch {
            // fallback: ignore
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [game?.id, playerId]);

  const createGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callAction({ action: "create", playerId });
      setGame(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const joinGame = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callAction({ action: "join", code: code.toLowerCase(), playerId });
      setGame(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const ready = useCallback(async () => {
    if (!game) return;
    try {
      await callAction({ action: "ready", gameId: game.id, playerId });
    } catch (e: any) {
      setError(e.message);
    }
  }, [game, playerId]);

  const sendClue = useCallback(async (clue: string, clueNumber: number) => {
    if (!game) return;
    try {
      await callAction({ action: "clue", gameId: game.id, playerId, clue, clueNumber });
    } catch (e: any) {
      setError(e.message);
    }
  }, [game, playerId]);

  const submitGuesses = useCallback(async (guesses: number[]) => {
    if (!game) return;
    try {
      await callAction({ action: "guess", gameId: game.id, playerId, guesses });
    } catch (e: any) {
      setError(e.message);
    }
  }, [game, playerId]);

  const nextTurn = useCallback(async () => {
    if (!game) return;
    try {
      await callAction({ action: "next_turn", gameId: game.id, playerId });
    } catch (e: any) {
      setError(e.message);
    }
  }, [game, playerId]);

  const leaveGame = useCallback(() => {
    setGame(null);
    setError(null);
  }, []);

  return {
    game,
    myRole,
    playerId,
    loading,
    error,
    createGame,
    joinGame,
    ready,
    sendClue,
    submitGuesses,
    nextTurn,
    leaveGame,
  };
}
