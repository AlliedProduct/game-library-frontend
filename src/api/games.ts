import apiClient from "./client";

export interface Game {
  id: number;
  title: string;
  platform: string;
  genre: string;
  status: string;
  rating?: number;
  notes?: string;
  avg_rating?: number | null;
  created_at?: string;
  updated_at?: string;
}

export async function getGames(): Promise<Game[]> {
  const res = await apiClient.get("/api/v1/games");
  const data: unknown = res.data;

  if (Array.isArray(data)) {
    return data as Game[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "games" in data &&
    Array.isArray((data as { games: unknown }).games)
  ) {
    return (data as { games: Game[] }).games;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: Game[] }).data;
  }

  console.warn("Unexpected response from data:", data);
  return [];
}

export async function getGame(id: number): Promise<Game> {
  const res = await apiClient.get(`/api/v1/games/${id}`);
  return res.data;
}

export type GameCreatePayload = {
  title: string;
  platform: string;
  genre: string;
  status: string;
  rating?: number;
  notes?: string;
};

export type GameUpdatePayload = Partial<GameCreatePayload>;

export async function createGame(payload: GameCreatePayload): Promise<Game> {
  const res = await apiClient.post("/api/v1/games", { game: payload });
  return res.data;
}

export async function updateGame(
  id: number,
  payload: GameUpdatePayload
): Promise<Game> {
  const res = await apiClient.put(`/api/v1/games/${id}`, { game: payload });
  return res.data;
}

export async function deleteGame(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/games/${id}`);
}
