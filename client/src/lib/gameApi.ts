import { apiRequest } from "./queryClient";

export interface CreateGameRequest {
  mode: string;
  totalQuestions?: number;
  maxPlayers?: number;
}

export interface JoinGameRequest {
  userId: string;
}

export interface SubmitAnswerRequest {
  userId: string;
  questionId: number;
  selectedAnswer: string;
  timeSpent: number;
}

export const gameApi = {
  createGame: async (data: CreateGameRequest) => {
    const response = await apiRequest("POST", "/api/games", data);
    return response.json();
  },

  getGame: async (gameId: string) => {
    const response = await apiRequest("GET", `/api/games/${gameId}`);
    return response.json();
  },

  joinGame: async (gameId: string, data: JoinGameRequest) => {
    const response = await apiRequest("POST", `/api/games/${gameId}/join`, data);
    return response.json();
  },

  startGame: async (gameId: string) => {
    const response = await apiRequest("POST", `/api/games/${gameId}/start`);
    return response.json();
  },

  submitAnswer: async (gameId: string, data: SubmitAnswerRequest) => {
    const response = await apiRequest("POST", `/api/games/${gameId}/answer`, data);
    return response.json();
  },

  getRandomQuestions: async (params?: {
    culture?: number;
    category?: number;
    difficulty?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.culture) searchParams.append('culture', params.culture.toString());
    if (params?.category) searchParams.append('category', params.category.toString());
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await apiRequest("GET", `/api/questions/random?${searchParams}`);
    return response.json();
  },

  getCultures: async () => {
    const response = await apiRequest("GET", "/api/cultures");
    return response.json();
  },

  getFeaturedCulture: async () => {
    const response = await apiRequest("GET", "/api/cultures/featured");
    return response.json();
  },

  getLeaderboard: async (limit = 10) => {
    const response = await apiRequest("GET", `/api/leaderboard?limit=${limit}`);
    return response.json();
  },

  getUserStats: async (userId: string) => {
    const response = await apiRequest("GET", `/api/users/${userId}/stats`);
    return response.json();
  },

  getUserAchievements: async (userId: string) => {
    const response = await apiRequest("GET", `/api/users/${userId}/achievements`);
    return response.json();
  },
};
