<template>
  <div class="container mx-auto p-8 sm:p-8 pt-20 sm:pt-24">
    <h1 class="text-4xl text-white mb-8 neon-text font-audiowide text-center">
      Tournois à venir
    </h1>

    <!-- Filtres -->
    <div
      class="cyberpunk-panel-purple bg-black/75 backdrop-blur-sm rounded-lg border border-pink-500/70 shadow-lg shadow-pink-500/30 p-4 sm:p-6 mb-6 sm:mb-8"
    >
      <!-- Sélecteur de jeux -->
      <div class="mb-6">
        <label
          for="game"
          class="relative flex items-center gap-2 font-orbitron text-base sm:text-lg text-pink-400 mb-3 cyberpunk-label-pink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
            />
          </svg>
          <span>FILTRER PAR JEU</span>
          <div
            class="h-px flex-grow bg-gradient-to-r from-pink-500 to-transparent mx-2 opacity-70"
          ></div>
        </label>
        <div class="relative group">
          <select
            id="game"
            v-model="selectedGame"
            @change="fetchTournaments"
            class="cyberpunk-select-pink w-full p-2.5 sm:p-3 text-pink-300 bg-gray-900/80 border-2 border-pink-500/70 rounded-md font-orbitron focus:outline-none focus:border-pink-400 transition-all appearance-none cursor-pointer"
          >
            <option value="">Tous les jeux</option>
            <option v-for="game in games" :key="game._id" :value="game._id">
              {{ game.name }}
            </option>
          </select>

          <!-- Effet de contour néon sur hover -->
          <div
            class="cyberpunk-select-glow-pink absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <!-- Icône personnalisée -->
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-pink-400 cyberpunk-icon-pink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Options de filtrage -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Option 1: Afficher les tournois passés -->
        <div class="cyberpunk-toggle-container">
          <label class="cyberpunk-toggle">
            <input
              type="checkbox"
              v-model="showFinished"
              @change="fetchTournaments"
              class="hidden"
            />
            <div class="cyberpunk-toggle-slider">
              <div class="cyberpunk-toggle-knob">
                <div class="cyberpunk-toggle-knob-highlight"></div>
              </div>
            </div>
            <span class="cyberpunk-toggle-label font-orbitron text-white ml-3">
              Afficher les tournois passés
            </span>
          </label>
        </div>

        <!-- Option 2: Ordre chronologique -->
        <div class="cyberpunk-toggle-container">
          <label class="cyberpunk-toggle">
            <input type="checkbox" v-model="sortAscending" class="hidden" />
            <div class="cyberpunk-toggle-slider">
              <div class="cyberpunk-toggle-knob">
                <div class="cyberpunk-toggle-knob-highlight"></div>
              </div>
            </div>
            <span class="cyberpunk-toggle-label font-orbitron text-white ml-3">
              Ordre chronologique
              <span class="text-xs text-gray-400 ml-1">
                ({{ sortAscending ? "ancien → récent" : "récent → ancien" }})
              </span>
            </span>
          </label>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <label
          class="relative flex items-center gap-2 font-orbitron text-base sm:text-lg text-pink-400 mb-3 cyberpunk-label-pink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>FILTRER PAR DATE</span>
          <div
            class="h-px flex-grow bg-gradient-to-r from-pink-500 to-transparent mx-2 opacity-70"
          ></div>
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Date de début -->
          <div class="cyberpunk-date-container">
            <label
              class="block text-sm font-medium text-pink-400 mb-1 font-orbitron"
            >
              Du
            </label>
            <div class="relative group">
              <input
                type="date"
                v-model="startDate"
                class="cyberpunk-date-input w-full p-2.5 sm:p-3 text-pink-300 bg-gray-900/80 border-2 border-pink-500/70 rounded-md font-orbitron focus:outline-none focus:border-pink-400 transition-all cursor-pointer"
                :max="endDate || undefined"
                @change="filterByDate"
              />
              <div
                class="cyberpunk-date-glow-pink absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
          </div>

          <!-- Date de fin -->
          <div class="cyberpunk-date-container">
            <label
              class="block text-sm font-medium text-pink-400 mb-1 font-orbitron"
            >
              Au
            </label>
            <div class="relative group">
              <input
                type="date"
                v-model="endDate"
                class="cyberpunk-date-input w-full p-2.5 sm:p-3 text-pink-300 bg-gray-900/80 border-2 border-pink-500/70 rounded-md font-orbitron focus:outline-none focus:border-pink-400 transition-all cursor-pointer"
                :min="startDate || undefined"
                @change="filterByDate"
              />
              <div
                class="cyberpunk-date-glow-pink absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
          </div>
        </div>

        <!-- Bouton pour effacer les dates -->
        <div class="flex justify-end" v-if="startDate || endDate">
          <button
            @click="clearDates"
            class="cyberpunk-btn-pink text-xs px-3 py-1.5 font-orbitron rounded-md"
          >
            <span class="relative z-10 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Effacer les dates</span>
            </span>
          </button>
        </div>
      </div>
    </div>
    <!-- Notifications -->
    <Toast v-if="error" type="error" :message="error" />
    <Toast v-if="success" type="success" :message="success" />

    <!-- Avertissement connexion -->
    <div
      v-if="!user"
      class="mb-8 p-4 bg-red-900 text-white rounded border border-red-600 shadow-md flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2 text-red-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      Veuillez vous connecter pour pouvoir vous inscrire aux tournois.
    </div>

    <!-- Affichage du loader pendant le chargement -->
    <div v-if="isLoading" class="my-12">
      <CyberpunkLoader />
    </div>

    <!-- Liste des tournois -->
    <div v-if="filteredTournaments.length > 0">
      <tournament-card
        v-for="tournament in paginatedTournaments"
        :key="tournament._id"
        :tournament="tournament"
        :user="user"
        :show-participants="
          tournament._id ? showParticipants[tournament._id] : false
        "
        :show-description="
          tournament._id ? showDescription[tournament._id] : false
        "
        :show-podium="tournament._id ? showPodium[tournament._id] : false"
        :is-checked-in="
          tournament._id ? checkedInPlayers[tournament._id] : false
        "
        :show-other-rankings="
          tournament._id ? showOtherRankings[tournament._id] : false
        "
        @toggle-tab="toggleTab"
        @open-registration="openRegistrationPopup"
        @check-in="checkIn"
        @toggle-other-rankings="toggleOtherRankings"
      />
      <CyberpunkPagination
        v-if="filteredTournaments.length > itemsPerPage"
        class="mt-8"
        :current-page="currentPage"
        :total-pages="totalPages"
        prev-label="&laquo; Précédent"
        next-label="Suivant &raquo;"
        color="pink"
        :show-dots="totalPages > 5"
        @prev-page="prevPage"
        @next-page="nextPage"
        @page-select="goToPage"
      />
    </div>

    <!-- Message pas de tournois -->
    <div
      v-else
      class="flex flex-col items-center justify-center p-12 bg-black bg-opacity-60 rounded-lg border border-pink-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-pink-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-white text-center text-xl font-orbitron">
        Pas de tournois trouvés.
      </p>
    </div>

    <!-- Modal de confirmation -->
    <ConfirmationDialog
      v-if="showPopup"
      :title="'Confirmation'"
      :message="`Voulez-vous ${
        actionType === 'register' ? 'vous inscrire' : 'vous désinscrire'
      } au tournoi ${selectedTournament?.name} en tant que ${user?.username} ?`"
      @confirm="confirmAction"
      @cancel="closePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import gameService from "../services/gameService";
import tournamentService from "../services/tournamentService";
import playerService from "../services/playerService";
import { useUserStore } from "../stores/userStore";
import Toast from "@/shared/Toast.vue";
import type { Game, Tournament } from "../types";
import ConfirmationDialog from "@/shared/ConfirmationDialog.vue";
import TournamentCard from "@/components/tournois-a-venir/TournamentCard.vue";
import CyberpunkLoader from "@/shared/CyberpunkLoader.vue";
import CyberpunkPagination from "../shared/CyberpunkPagination.vue";
// Regroupement et organisation des états du composant
// SECTION: État du composant
//-------------------------------------------------------

// États globaux
const games = ref<Game[]>([]);
const tournaments = ref<Tournament[]>([]);
const success = ref<string | null>(null);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false); // Nouvel état pour le chargement

// État de filtrage par date
const startDate = ref<string>("");
const endDate = ref<string>("");

// États de filtrage et d'affichage
const selectedGame = ref<string>("");
const showFinished = ref<boolean>(false);
const sortAscending = ref<boolean>(false);

// États d'interface et d'interaction
const showParticipants = ref<{ [key: string]: boolean }>({});
const showDescription = ref<{ [key: string]: boolean }>({});
const showOtherRankings = ref<{ [key: string]: boolean }>({});
const showPodium = ref<{ [key: string]: boolean }>({});
const checkedInPlayers = ref<{ [key: string]: boolean }>({});

// États du modal de confirmation
const showPopup = ref<boolean>(false);
const selectedTournament = ref<Tournament | null>(null);
const actionType = ref<string>("register"); // "register" ou "unregister"

// États de pagination
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(5); // Nombre de tournois par page

//-------------------------------------------------------
// SECTION: Store et propriétés calculées
//-------------------------------------------------------

// Accès au store utilisateur
const userStore = useUserStore();
const user = computed(() => userStore.user);

/**
 * Filtre et trie les tournois selon les critères sélectionnés
 */
const filteredTournaments = computed(() => {
  // Appliquer d'abord les filtres pour réduire le nombre d'éléments à trier
  let filtered = tournaments.value;

  // Filtre par jeu si un jeu est sélectionné
  if (selectedGame.value) {
    filtered = filtered.filter((t) => t.game._id === selectedGame.value);
  }

  // Filtre par statut (terminé/à venir)
  if (!showFinished.value) {
    filtered = filtered.filter((t) => !t.finished);
  }

  // Filtre par plage de dates
  if (startDate.value || endDate.value) {
    filtered = filtered.filter((t) => {
      const tournamentDate = new Date(t.date);
      tournamentDate.setHours(0, 0, 0, 0); // Normaliser à minuit

      // Vérifier la date de début si définie
      if (startDate.value) {
        const start = new Date(startDate.value);
        start.setHours(0, 0, 0, 0);
        if (tournamentDate < start) return false;
      }

      // Vérifier la date de fin si définie
      if (endDate.value) {
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59, 999); // Fin de journée
        if (tournamentDate > end) return false;
      }

      return true;
    });
  }

  // Tri chronologique configurable
  const sortMultiplier = sortAscending.value ? 1 : -1;

  return filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return (dateA - dateB) * sortMultiplier;
  });
});

/**
 * Filtre les tournois par date
 */
const filterByDate = () => {
  // Réinitialiser la pagination quand les dates changent
  currentPage.value = 1;
  // Le filtrage s'effectue via la propriété calculée filteredTournaments
};

/**
 * Efface les filtres de date
 */
const clearDates = () => {
  startDate.value = "";
  endDate.value = "";
  currentPage.value = 1;
};

//-------------------------------------------------------
// SECTION: Récupération des données
//-------------------------------------------------------

/**
 * Récupère la liste des tournois depuis l'API
 * et vérifie les check-ins de l'utilisateur
 */
const fetchTournaments = async () => {
  // Activer l'état de chargement
  isLoading.value = true;

  try {
    // Réinitialiser les états de check-in
    checkedInPlayers.value = {};

    // Récupérer tous les tournois
    tournaments.value = await tournamentService.getTournaments();

    // Vérifier l'état de check-in du joueur pour chaque tournoi
    if (user.value) {
      const player = await playerService.getPlayerByIdUser(user.value._id);
      if (player && player._id) {
        tournaments.value.forEach((tournament) => {
          if (tournament._id) {
            checkedInPlayers.value[tournament._id] =
              (tournament.checkIns &&
                player._id &&
                tournament.checkIns[player._id]) ||
              false;
          }
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des tournois:", error);
    showMessage("error", "Impossible de charger les tournois");
  } finally {
    // Désactiver l'état de chargement, qu'il y ait eu une erreur ou non
    setTimeout(() => {
      isLoading.value = false;
    }, 100); // Légère temporisation pour une meilleure UX
  }
};

//-------------------------------------------------------
// SECTION: Gestion des onglets des tournois
//-------------------------------------------------------

/**
 * Gère la bascule entre les différents onglets d'un tournoi
 * @param tournamentId - ID du tournoi
 * @param tab - Nom de l'onglet ('participants', 'description' ou 'podium')
 */
const toggleTab = (tournamentId: string, tab: string) => {
  // S'assurer que tous les objets existent
  if (!showParticipants.value[tournamentId]) {
    showParticipants.value[tournamentId] = false;
  }
  if (!showDescription.value[tournamentId]) {
    showDescription.value[tournamentId] = false;
  }
  if (!showPodium.value[tournamentId]) {
    showPodium.value[tournamentId] = false;
  }

  if (tab === "participants") {
    // Basculer l'état de l'onglet participants
    showParticipants.value[tournamentId] =
      !showParticipants.value[tournamentId];

    // Si on active l'onglet, fermer les autres
    if (showParticipants.value[tournamentId]) {
      showDescription.value[tournamentId] = false;
      showPodium.value[tournamentId] = false;
    }
  } else if (tab === "description") {
    // Basculer l'état de l'onglet description
    showDescription.value[tournamentId] = !showDescription.value[tournamentId];

    // Si on active l'onglet, fermer les autres
    if (showDescription.value[tournamentId]) {
      showParticipants.value[tournamentId] = false;
      showPodium.value[tournamentId] = false;
    }
  } else if (tab === "podium") {
    // Basculer l'état de l'onglet podium
    showPodium.value[tournamentId] = !showPodium.value[tournamentId];

    // Si on active l'onglet, fermer les autres
    if (showPodium.value[tournamentId]) {
      showParticipants.value[tournamentId] = false;
      showDescription.value[tournamentId] = false;
    }
  }
};

/**
 * Bascule l'affichage des autres classements pour un tournoi
 * @param tournamentId - ID du tournoi
 */
const toggleOtherRankings = (tournamentId: string) => {
  // S'assurer que l'objet existe
  if (!showOtherRankings.value) {
    showOtherRankings.value = {};
  }

  // Créer un nouvel objet pour forcer la réactivité
  const updatedState = { ...showOtherRankings.value };
  updatedState[tournamentId] = !updatedState[tournamentId];
  showOtherRankings.value = updatedState;
};
//-------------------------------------------------------
// SECTION: Gestion des inscriptions aux tournois
//-------------------------------------------------------

/**
 * Ouvre le popup de confirmation pour l'inscription ou désinscription
 * @param tournament - Objet tournoi
 * @param type - Type d'action ("register" ou "unregister")
 */
const openRegistrationPopup = (tournament: Tournament, type: string) => {
  selectedTournament.value = tournament;
  actionType.value = type;
  showPopup.value = true;
};

/**
 * Ferme le popup de confirmation
 */
const closePopup = () => {
  showPopup.value = false;
  // Réinitialisation différée pour éviter les changements visuels pendant la transition de sortie
  setTimeout(() => {
    selectedTournament.value = null;
    actionType.value = "register";
  }, 300); // Correspondant à la durée de l'animation fadeOut
};

/**
 * Exécute l'action d'inscription ou de désinscription après confirmation
 */
const confirmAction = async () => {
  if (selectedTournament.value && user.value) {
    try {
      if (actionType.value === "register" && selectedTournament.value._id) {
        // Inscription au tournoi
        await tournamentService.registerPlayer(
          selectedTournament.value._id,
          user.value._id
        );
        showMessage(
          "success",
          "Inscription réussie ! N'oublie pas de venir te check-in 24h avant le tournoi."
        );
      } else {
        if (selectedTournament.value._id) {
          // Désinscription du tournoi
          await tournamentService.unregisterPlayer(
            selectedTournament.value._id,
            user.value._id
          );
        }
        showMessage(
          "success",
          "Désinscription réussie ! Triste de te voir partir :("
        );
      }
      fetchTournaments();
      closePopup();
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
      showMessage("error", `Erreur lors de l'action.`);
    }
  }
};

/**
 * Change l'état de check-in d'un joueur pour un tournoi avec retour visuel immédiat
 * @param tournamentId - ID du tournoi
 * @param checkedIn - Nouvel état de check-in
 */
const checkIn = async (tournamentId: string, checkedIn: boolean) => {
  // Optimistic UI: mettre à jour l'interface avant que la requête soit terminée
  checkedInPlayers.value[tournamentId] = checkedIn;

  try {
    if (user.value) {
      await tournamentService.checkInPlayer(
        tournamentId,
        user.value._id,
        checkedIn
      );

      showMessage(
        "success",
        checkedIn ? "Check-in confirmé !" : "Check-in annulé."
      );
    }
  } catch (error) {
    // En cas d'erreur, remettre l'état précédent
    checkedInPlayers.value[tournamentId] = !checkedIn;
    console.error("Erreur lors du check-in:", error);
    showMessage(
      "error",
      `Erreur: Impossible de ${
        checkedIn ? "confirmer" : "annuler"
      } le check-in.`
    );
  }
};

//-------------------------------------------------------
// SECTION: Pagination
//-------------------------------------------------------

/**
 * Calcule le nombre total de pages pour la pagination
 */
const totalPages = computed(() => {
  return Math.ceil(filteredTournaments.value.length / itemsPerPage.value);
});

/**
 * Retourne les tournois pour la page courante
 */
const paginatedTournaments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTournaments.value.slice(start, end);
});

/**
 * Fonctions de navigation pour la pagination
 */
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

//-------------------------------------------------------
// SECTION: Utilitaires et formatage
//-------------------------------------------------------

/**
 * Affiche un message de notification temporaire
 * @param type - Type de message ("success" ou "error")
 * @param message - Contenu du message
 * @param duration - Durée d'affichage en ms (défaut: 3000ms)
 */
const showMessage = (
  type: "success" | "error",
  message: string,
  duration: number = 3000
) => {
  // Réinitialiser tout message précédent
  success.value = null;
  error.value = null;

  // Définir le nouveau message
  if (type === "success") {
    success.value = message;
  } else {
    error.value = message;
  }

  // Auto-effacement après la durée spécifiée
  setTimeout(() => {
    if (type === "success") {
      success.value = null;
    } else {
      error.value = null;
    }
  }, duration);
};

//-------------------------------------------------------
// SECTION: Cycle de vie du composant
//-------------------------------------------------------

/**
 * Initialise les états de check-in pour l'utilisateur connecté
 */
const initializeCheckInStates = async () => {
  checkedInPlayers.value = {};

  if (!user.value) return;

  try {
    const player = await playerService.getPlayerByIdUser(user.value._id);
    if (!player?._id) return;

    tournaments.value.forEach((tournament) => {
      if (tournament._id) {
        checkedInPlayers.value[tournament._id] = !!(
          tournament.checkIns &&
          player._id &&
          tournament.checkIns[player._id]
        );
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation des check-ins:", error);
  }
};

/**
 * Initialise les états d'interface pour les accordéons et onglets
 */
const initializeUIStates = () => {
  // Initialiser tous les accordéons comme fermés par défaut
  tournaments.value.forEach((tournament) => {
    if (tournament._id) {
      showOtherRankings.value[tournament._id] = false;
      showParticipants.value[tournament._id] = false;
      showDescription.value[tournament._id] = false;
    }
  });
};

/**
 * Réinitialise la pagination quand les filtres changent
 */
watch([selectedGame, showFinished, sortAscending, startDate, endDate], () => {
  currentPage.value = 1;
});
/**
 * Initialisation du composant au montage
 */
onMounted(async () => {
  // Activer l'état de chargement
  isLoading.value = true;

  try {
    // Chargement parallèle des jeux et tournois pour plus de rapidité
    const [gamesResult, tournamentsResult] = await Promise.all([
      gameService.getGames(),
      tournamentService.getTournaments(),
    ]);

    games.value = gamesResult;
    tournaments.value = tournamentsResult;

    // Initialisation des états d'interface
    await initializeCheckInStates();
    initializeUIStates();
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    showMessage("error", "Erreur lors du chargement des données");
  } finally {
    // Désactiver l'état de chargement
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Base et layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Panel cyberpunk avec esthétique rose */
.cyberpunk-panel-pink {
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    0 100%
  );
  background: radial-gradient(
      circle at top right,
      rgba(236, 72, 153, 0.2),
      transparent 60%
    ),
    linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(15, 23, 42, 0.9));
  position: relative;
}

.cyberpunk-panel-pink::before {
  content: "";
  position: absolute;
  right: 15px;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: rgba(236, 72, 153, 0.7);
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.7);
}

.cyberpunk-panel-pink::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 15px;
  width: 2px;
  height: 30px;
  background: rgba(236, 72, 153, 0.7);
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.7);
}

/* Label avec teinte rose */
.cyberpunk-label-pink {
  text-shadow: 0 0 5px rgba(236, 72, 153, 0.7);
  letter-spacing: 1px;
}

.cyberpunk-label-pink svg {
  filter: drop-shadow(0 0 2px rgba(236, 72, 153, 0.7));
}

/* Select avec style rose */
.cyberpunk-select-pink {
  clip-path: polygon(
    0 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  background: linear-gradient(
    135deg,
    rgba(8, 8, 16, 0.95),
    rgba(14, 23, 36, 0.95)
  );
  box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.3),
    0 0 5px rgba(236, 72, 153, 0.3);
  text-shadow: 0 0 3px rgba(236, 72, 153, 0.7);
  caret-color: #ec4899;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
  padding-right: 2.5rem !important;
  color: #ec4899;
  border: 2px solid rgba(236, 72, 153, 0.7);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Style au focus */
.cyberpunk-select-pink:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.5);
  animation: pulse-glow-pink 2s infinite;
}

/* Effet de lueur rose sur survol */
.cyberpunk-select-glow-pink {
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.7);
  border: 2px solid rgba(236, 72, 153, 0.8);
  clip-path: polygon(
    0 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  transform: scale(1.01);
  z-index: 0;
}

/* Icône avec effet rose */
.cyberpunk-icon-pink {
  filter: drop-shadow(0 0 2px rgba(236, 72, 153, 0.7));
  transition: transform 0.3s ease;
}

.cyberpunk-select-pink:focus
  + .cyberpunk-select-glow-pink
  + div
  .cyberpunk-icon-pink,
.group:hover .cyberpunk-icon-pink {
  transform: translateY(2px);
  filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.9));
}

/* Styles pour les options du select */
.cyberpunk-select-pink option {
  background-color: #0f172a;
  color: #fbcfe8;
  font-family: "Orbitron", sans-serif;
}

/* Animation de pulsation rose */
@keyframes pulse-glow-pink {
  0% {
    box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.3),
      0 0 5px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: inset 0 0 15px rgba(236, 72, 153, 0.4),
      0 0 10px rgba(236, 72, 153, 0.4);
  }
  100% {
    box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.3),
      0 0 5px rgba(236, 72, 153, 0.3);
  }
}

/* Nouveaux styles pour le toggle cyberpunk */
.cyberpunk-toggle-container {
  display: flex;
  align-items: center;
}

.cyberpunk-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.cyberpunk-toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(236, 72, 153, 0.5);
  transition: all 0.3s ease;
  overflow: hidden;
}

.cyberpunk-toggle-slider::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background-color: #0f172a;
  border-radius: 50%;
  transform: translateX(0);
  transition: all 0.3s ease;
  z-index: 1;
}

.cyberpunk-toggle input:checked + .cyberpunk-toggle-slider {
  background-color: rgba(236, 72, 153, 0.3);
  border-color: rgba(236, 72, 153, 0.8);
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
}

.cyberpunk-toggle input:checked + .cyberpunk-toggle-slider::before {
  transform: translateX(20px);
  background-color: #ec4899;
}

.cyberpunk-toggle-label {
  user-select: none;
}

.cyberpunk-toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #334155;
  transition: transform 0.3s ease;
  z-index: 1;
}

.cyberpunk-toggle
  input:checked
  + .cyberpunk-toggle-slider
  .cyberpunk-toggle-knob {
  transform: translateX(20px);
  background-color: #ec4899;
}

.cyberpunk-toggle-knob-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.8), transparent);
  transition: opacity 0.3s ease;
}

.cyberpunk-toggle
  input:checked
  + .cyberpunk-toggle-slider
  .cyberpunk-toggle-knob-highlight {
  opacity: 1;
}

/* Animation pour le fade in */
.animate__fadeIn {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animation des transitions de page */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.cyber-transition-container {
  min-height: 200px;
  position: relative;
}

.cyberpunk-date-input {
  clip-path: polygon(
    0 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  background: linear-gradient(
    135deg,
    rgba(8, 8, 16, 0.95),
    rgba(14, 23, 36, 0.95)
  );
  box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.3),
    0 0 5px rgba(236, 72, 153, 0.3);
  color: #ec4899;
  border: 2px solid rgba(236, 72, 153, 0.7);
  padding-right: 10px !important;
}

/* Personnaliser l'icône du calendrier */
.cyberpunk-date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5) sepia(1) saturate(5) hue-rotate(300deg); /* Teinte rose */
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.cyberpunk-date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Effet de lueur rose sur survol */
.cyberpunk-date-glow-pink {
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.7);
  border: 2px solid rgba(236, 72, 153, 0.8);
  clip-path: polygon(
    0 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  transform: scale(1.01);
  z-index: 0;
}

/* Style au focus */
.cyberpunk-date-input:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.5);
  animation: pulse-glow-pink 2s infinite;
}
</style>
