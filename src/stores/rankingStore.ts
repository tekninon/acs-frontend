import { defineStore } from "pinia";
import { ref, computed } from "vue";
import playerService from "../services/playerService";
import gameService from "../services/gameService";
import seasonService from "../services/seasonService";

import type { PlayerRanking, Game } from "../types";

export const useRankingStore = defineStore("rankings", () => {
  // --- État ---
  const rankings = ref<PlayerRanking[]>([]);
  const games = ref<Game[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchTime = ref<number | null>(null);
  const lastGameFetchTime = ref<number | null>(null);
  const currentGameId = ref<string>("");
  const currentSeasonId = ref<string>("");

  // --- Getters ---
  const shouldRefreshData = computed(() => {
    if (!lastFetchTime.value) return true;
    return Date.now() - lastFetchTime.value > 300000; // 30 minutes
  });

  const shouldRefreshGames = computed(() => {
    if (!lastGameFetchTime.value) return true;
    return Date.now() - lastGameFetchTime.value > 3600000; // 1 heure
  });

  // --- Actions ---
  /**
   * Récupère tous les classements des joueurs
   */
  const fetchRankings = async (forceRefresh = false) => {
    // Si les données sont déjà chargées et qu'on ne force pas le refresh
    if (
      !forceRefresh &&
      rankings.value.length > 0 &&
      !shouldRefreshData.value &&
      !currentGameId.value &&
      !currentSeasonId.value
    ) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await playerService.getPlayerRankings();
      rankings.value = response;
      currentGameId.value = "";
      currentSeasonId.value = "";
      lastFetchTime.value = Date.now();
      saveToLocalStorage();
    } catch (err) {
      console.error("Erreur lors de la récupération du classement:", err);
      error.value = "Erreur lors du chargement du classement.";
      loadFromLocalStorage();
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupère les classements des joueurs pour un jeu spécifique
   */
  const fetchRankingsByGame = async (gameId: string, forceRefresh = false) => {
    // Si les données sont déjà chargées pour ce jeu et qu'on ne force pas le refresh
    if (
      !forceRefresh &&
      rankings.value.length > 0 &&
      !shouldRefreshData.value &&
      currentGameId.value === gameId &&
      !currentSeasonId.value
    ) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      if (gameId) {
        const response = await playerService.getPlayerRankingsByGame(gameId);
        rankings.value = response;
        currentGameId.value = gameId;
        currentSeasonId.value = "";
      } else {
        await fetchRankings(forceRefresh);
      }
      lastFetchTime.value = Date.now();
      saveToLocalStorage();
    } catch (err) {
      console.error(
        "Erreur lors de la récupération du classement par jeu:",
        err
      );
      error.value = "Erreur lors du chargement du classement par jeu.";
      loadFromLocalStorage();
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupère le classement par saison
   * @param seasonId - ID de la saison
   * @param gameId - ID du jeu (optionnel) pour filtrer par jeu
   */
  const fetchSeasonRankings = async (
    seasonId: string,
    gameId?: string,
    forceRefresh = false
  ) => {
    // Si les données sont déjà chargées pour cette saison/jeu et qu'on ne force pas le refresh
    if (
      !forceRefresh &&
      rankings.value.length > 0 &&
      !shouldRefreshData.value &&
      currentSeasonId.value === seasonId &&
      currentGameId.value === (gameId || "")
    ) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await seasonService.getSeasonRanking(seasonId, gameId);
      rankings.value = response.rankings;
      currentSeasonId.value = seasonId;
      currentGameId.value = gameId || "";
      lastFetchTime.value = Date.now();
      saveToLocalStorage();
    } catch (err) {
      console.error(
        "Erreur lors de la récupération du classement par saison:",
        err
      );
      error.value = "Erreur lors du chargement du classement par saison.";
      loadFromLocalStorage();
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupère la liste des jeux
   */
  const fetchGames = async (forceRefresh = false) => {
    if (!forceRefresh && games.value.length > 0 && !shouldRefreshGames.value) {
      return;
    }

    try {
      const response = await gameService.getGames();
      games.value = response;
      lastGameFetchTime.value = Date.now();
      saveToLocalStorage();
    } catch (err) {
      console.error("Erreur lors de la récupération des jeux:", err);
      loadFromLocalStorage();
    }
  };

  // --- Méthodes privées pour la persistance ---
  const saveToLocalStorage = () => {
    localStorage.setItem(
      "rankingStore",
      JSON.stringify({
        rankings: rankings.value,
        games: games.value,
        lastFetchTime: lastFetchTime.value,
        lastGameFetchTime: lastGameFetchTime.value,
        currentGameId: currentGameId.value,
        currentSeasonId: currentSeasonId.value,
      })
    );
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("rankingStore");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        rankings.value = parsedData.rankings || [];
        games.value = parsedData.games || [];
        lastFetchTime.value = parsedData.lastFetchTime || null;
        lastGameFetchTime.value = parsedData.lastGameFetchTime || null;
        currentGameId.value = parsedData.currentGameId || "";
        currentSeasonId.value = parsedData.currentSeasonId || "";
      } catch (e) {
        console.error("Erreur lors du parsing des données sauvegardées", e);
      }
    }
  };

  // Initialisation
  loadFromLocalStorage();

  return {
    // État
    rankings,
    games,
    loading,
    error,
    currentGameId,
    currentSeasonId,

    // Actions
    fetchRankings,
    fetchRankingsByGame,
    fetchSeasonRankings,
    fetchGames,
  };
});
