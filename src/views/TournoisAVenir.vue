<!-- filepath: d:\Dev\ACS\acs-frontend\src\views\TournoisAVenir.vue -->
<template>
  <div class="container mx-auto p-8 pt-20">
    <h1 class="text-4xl text-white mb-8 neon-text">Tournois à venir</h1>
    <div class="mb-4">
      <label for="game" class="block text-lg text-white mb-2 neon-label">
        Filtrer par jeu
      </label>
      <select
        id="game"
        v-model="selectedGame"
        @change="fetchTournaments"
        class="w-full p-3 text-white bg-gray-800 border-none rounded shadow neon-input focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="">Tous les jeux</option>
        <option v-for="game in games" :key="game._id" :value="game._id">
          {{ game.name }}
        </option>
      </select>
    </div>
    <div class="mb-4">
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          v-model="showFinished"
          @change="fetchTournaments"
          class="form-checkbox text-pink-500"
        />
        <span class="ml-2 text-white">Afficher les tournois passés</span>
      </label>
    </div>
    <Toast v-if="error" type="error" :message="error" />
    <Toast v-if="success" type="success" :message="success" />
    <div v-if="!user" class="mb-4 p-4 bg-red-500 text-white rounded">
      Veuillez vous connecter pour pouvoir vous inscrire.
    </div>
    <div v-if="filteredTournaments.length > 0">
      <div
        v-for="tournament in filteredTournaments"
        :key="tournament._id"
        class="mb-4 p-4 bg-gray-800 rounded shadow relative"
      >
        <h2 class="text-2xl text-white mb-2">{{ tournament.name }}</h2>
        <p class="text-white">
          <strong>Date:</strong> {{ formatDate(tournament.date) }} 20:30
        </p>
        <p class="text-white">
          <strong>Jeu:</strong> {{ tournament.game.name }}
        </p>
        <p class="text-white">
          <strong>Discord Channel:</strong> {{ tournament.discordChannelName }}
        </p>
        <button
          @click="tournament._id ? toggleParticipants(tournament._id) : null"
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {{
            tournament._id && showParticipants[tournament._id]
              ? "Masquer"
              : "Afficher"
          }}
          les participants
        </button>
        <div v-if="tournament._id && showParticipants[tournament._id]">
          <h3 class="text-xl text-white mt-4">Participants</h3>
          <div v-if="tournament.teams && tournament.teams.length > 0">
            <div v-for="team in tournament.teams" :key="team._id" class="mb-4">
              <h4 class="text-lg text-white">{{ team.name }}</h4>
              <ul>
                <li
                  v-for="player in team.players"
                  :key="player._id"
                  class="text-white"
                >
                  {{ player.username }}
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <ul>
              <li
                v-for="player in tournament.players"
                :key="player._id"
                class="text-white"
              >
                {{ player.username }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="tournament.finished">
          <h3 class="text-xl text-white mt-4">Résultats</h3>
          <p class="text-white">
            <strong>Équipe gagnante:</strong> {{ tournament.winningTeam?.name }}
          </p>
          <ul>
            <li
              v-for="player in tournament.winningTeam?.players"
              :key="player._id"
              class="text-white"
            >
              {{ player.username }}
            </li>
          </ul>
        </div>
        <div v-if="!tournament.finished && user">
          <button
            v-if="!isUserRegistered(tournament)"
            @click="openRegistrationPopup(tournament, 'register')"
            class="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <span class="mr-2">S'inscrire</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            v-else
            @click="openRegistrationPopup(tournament, 'unregister')"
            class="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded flex items-center"
          >
            <span class="mr-2">Se désinscrire</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-white">Pas de tournois trouvés.</p>
    </div>
    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-8 rounded shadow-lg">
        <h2 class="text-2xl mb-4">Confirmation</h2>
        <p class="mb-4">
          Voulez-vous
          <strong>{{
            actionType === "register" ? "vous inscrire" : "vous désinscrire"
          }}</strong>
          au tournoi
          <strong>{{ selectedTournament?.name }}</strong> en tant que
          <strong>{{ user?.username }}</strong> ?
        </p>
        <div class="flex justify-end">
          <button
            @click="confirmAction"
            class="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Confirmer
          </button>
          <button
            @click="closePopup"
            class="bg-red-500 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import gameService from "../services/gameService";
import tournamentService from "../services/tournamentService";
import playerService from "../services/playerService";
import { useUserStore } from "../stores/userStore";
import Toast from "@/shared/Toast.vue";
import type { Game } from "../services/gameService";
import type { Tournament } from "../services/tournamentService";
import type { Player } from "../services/playerService";

const games = ref<Game[]>([]);
const tournaments = ref<Tournament[]>([]);
const selectedGame = ref<string>("");
const showFinished = ref<boolean>(false);
const showParticipants = ref<{ [key: string]: boolean }>({});
const showPopup = ref<boolean>(false);
const selectedTournament = ref<Tournament | null>(null);
const actionType = ref<string>("register");

const userStore = useUserStore();
const user = computed(() => userStore.user);

const success = ref<string | null>(null);
const error = ref<string | null>(null);

const fetchGames = async () => {
  games.value = await gameService.getGames();
};

const fetchTournaments = async () => {
  tournaments.value = await tournamentService.getTournaments();
  // Ajouter la propriété showParticipants à chaque tournoi
  tournaments.value.forEach(async (tournament) => {
    if (tournament.winningTeam && tournament.winningTeam.players) {
      const playerDetails = await Promise.all(
        tournament.winningTeam.players.map((player: Player) =>
          playerService.getPlayerById(player._id as string)
        )
      );
      tournament.winningTeam.players = playerDetails;
    }
  });
  console.log(tournaments.value);
};

const filteredTournaments = computed(() => {
  return tournaments.value.filter((tournament) => {
    const matchesGame = selectedGame.value
      ? tournament.game._id === selectedGame.value
      : true;
    const matchesFinished = showFinished.value ? true : !tournament.finished;
    return matchesGame && matchesFinished;
  });
});

const toggleParticipants = (tournamentId: string) => {
  showParticipants.value[tournamentId] = !showParticipants.value[tournamentId];
};

const openRegistrationPopup = (tournament: Tournament, type: string) => {
  selectedTournament.value = tournament;
  actionType.value = type;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
  selectedTournament.value = null;
};

const confirmAction = async () => {
  if (selectedTournament.value && user.value) {
    try {
      if (actionType.value === "register" && selectedTournament.value._id) {
        await tournamentService.registerPlayer(
          selectedTournament.value._id,
          user.value._id
        );
        showMessage("success", "Inscription réussie !");
      } else {
        if (selectedTournament.value._id) {
          await tournamentService.unregisterPlayer(
            selectedTournament.value._id,
            user.value._id
          );
        }
        showMessage("success", "Désinscription réussie !");
      }
      fetchTournaments();
      closePopup();
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
      showMessage("error", `Erreur lors de l'action.`);
    }
  }
};

const isUserRegistered = (tournament: Tournament) => {
  return user.value
    ? tournament.players.some((player) => player.userId === user.value?._id)
    : false;
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const showMessage = (type: "success" | "error", message: string) => {
  if (type === "success") {
    success.value = message;
    error.value = null;
  } else {
    error.value = message;
    success.value = null;
  }
  setTimeout(() => {
    success.value = null;
    error.value = null;
  }, 3000);
};

onMounted(() => {
  fetchGames();
  fetchTournaments();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
