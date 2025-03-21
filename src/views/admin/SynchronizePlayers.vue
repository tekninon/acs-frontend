<template>
  <div
    class="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6 relative overflow-hidden"
  >
    <!-- Grille d'arrière-plan rétro -->
    <div class="absolute inset-0 z-0 bg-grid-pattern opacity-20"></div>

    <!-- Container principal -->
    <div class="relative z-10 max-w-6xl mx-auto pt-8">
      <!-- Titre principal -->
      <h1
        class="text-5xl font-audiowide text-center mb-10 text-white neon-text-pink"
      >
        Synchronisation des Joueurs
      </h1>

      <!-- Instructions -->
      <div
        class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/20 mb-8"
      >
        <p class="text-cyan-300 font-orbitron text-lg">
          Le username de <span class="text-pink-400 font-bold">Player</span> et
          de <span class="text-purple-400 font-bold">User</span> doit être
          similaire, effectuez les modifications nécessaires avant la
          synchronisation.
        </p>
      </div>

      <!-- Ajout d'un indicateur de chargement -->
      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="w-16 h-16 border-4 border-t-pink-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-white font-orbitron">Chargement...</p>
        </div>
      </div>

      <!-- Tables de comparaison -->
      <div v-else class="flex flex-col lg:flex-row gap-8 mb-8">
        <!-- Table des joueurs -->
        <div
          class="w-full lg:w-1/2 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20 overflow-hidden"
        >
          <div class="border-b border-cyan-500/40 p-4">
            <h2 class="text-2xl font-orbitron text-cyan-300 neon-text-cyan">
              Players
            </h2>
          </div>
          <div
            class="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
          >
            <table class="w-full">
              <thead>
                <tr class="border-b border-cyan-500/30">
                  <th class="py-3 px-4 text-left font-orbitron text-cyan-300">
                    Username
                  </th>
                  <th class="py-3 px-4 text-left font-orbitron text-cyan-300">
                    Actions
                  </th>
                  <th
                    class="py-3 px-4 text-left font-orbitron text-cyan-300 hidden md:table-cell"
                  >
                    Discord ID
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="player in players"
                  :key="player._id"
                  class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <td class="py-4 px-4 text-white font-orbitron">
                    {{ player.username }}
                  </td>
                  <td class="py-4 px-4">
                    <button
                      @click="editPlayerUsername(player)"
                      class="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-orbitron text-sm px-4 py-2 rounded shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Modifier
                    </button>
                  </td>
                  <td
                    class="py-4 px-4 text-gray-300 font-mono hidden md:table-cell"
                  >
                    {{ player.discordId || "—" }}
                  </td>
                </tr>
                <tr v-if="players.length === 0">
                  <td
                    colspan="3"
                    class="py-8 text-center text-gray-400 font-orbitron"
                  >
                    Aucun joueur trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Table des utilisateurs -->
        <div
          class="w-full lg:w-1/2 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20 overflow-hidden"
        >
          <div class="border-b border-purple-500/40 p-4">
            <h2 class="text-2xl font-orbitron text-purple-400 neon-text-purple">
              Users
            </h2>
          </div>
          <div
            class="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
          >
            <table class="w-full">
              <thead>
                <tr class="border-b border-purple-500/30">
                  <th class="py-3 px-4 text-left font-orbitron text-purple-400">
                    Username
                  </th>
                  <th class="py-3 px-4 text-left font-orbitron text-purple-400">
                    Email
                  </th>
                  <th
                    class="py-3 px-4 text-left font-orbitron text-purple-400 hidden md:table-cell"
                  >
                    Discord ID
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user._id"
                  class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <td class="py-4 px-4 text-white font-orbitron">
                    {{ user.username }}
                  </td>
                  <td class="py-4 px-4 text-gray-300 font-mono">
                    {{ user.email }}
                  </td>
                  <td
                    class="py-4 px-4 text-gray-300 font-mono hidden md:table-cell"
                  >
                    {{ user.discordId || "—" }}
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td
                    colspan="3"
                    class="py-8 text-center text-gray-400 font-orbitron"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bouton de synchronisation -->
      <div class="flex justify-center">
        <button
          @click="synchronizePlayers"
          class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-orbitron text-lg px-8 py-4 rounded-lg shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
          <span class="relative z-10"
            >Synchroniser les joueurs avec les utilisateurs</span
          >
          <span
            class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"
          ></span>
        </button>
      </div>

      <!-- Notifications -->
      <Toast v-if="error" type="error" :message="error" />
      <Toast v-if="success" type="success" :message="success" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import playerService from "../../services/playerService";
import userService from "../../services/userService";
import Toast from "../../shared/Toast.vue";
import type { Player, User } from "../../types";

//-------------------------------------------------------
// SECTION: Définition des états
//-------------------------------------------------------

/**
 * Stockage des données récupérées depuis l'API
 */
const players = ref<Player[]>([]); // Liste des joueurs
const users = ref<User[]>([]); // Liste des utilisateurs

/**
 * États pour le système de notifications
 */
const error = ref<string | null>(null); // Message d'erreur
const success = ref<string | null>(null); // Message de succès

/**
 * État du chargement des données
 */
const isLoading = ref(true); // Indicateur de chargement actif

//-------------------------------------------------------
// SECTION: Récupération des données
//-------------------------------------------------------

/**
 * Charge les données des joueurs et des utilisateurs en parallèle
 * Gère l'état de chargement global
 */
const fetchData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([fetchPlayers(), fetchUsers()]);
  } catch (err) {
    console.error("Erreur de chargement des données:", err);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Récupère la liste des joueurs depuis l'API
 * Affiche une notification en cas d'erreur
 */
const fetchPlayers = async () => {
  try {
    players.value = await playerService.getPlayers();
  } catch (err) {
    showMessage("error", "Erreur lors du chargement des joueurs.");
  }
};

/**
 * Récupère la liste des utilisateurs depuis l'API
 * Affiche une notification en cas d'erreur
 */
const fetchUsers = async () => {
  try {
    users.value = await userService.fetchAllUsers();
  } catch (err) {
    showMessage("error", "Erreur lors du chargement des utilisateurs.");
  }
};

//-------------------------------------------------------
// SECTION: Actions utilisateur
//-------------------------------------------------------

/**
 * Déclenche la synchronisation des joueurs avec les utilisateurs
 * Cette opération met en correspondance les joueurs et les utilisateurs
 * ayant des noms d'utilisateur similaires
 */
const synchronizePlayers = async () => {
  try {
    await playerService.synchronizePlayers();
    showMessage("success", "Synchronisation réussie !");
    fetchPlayers(); // Rafraîchit la liste des joueurs après synchronisation
  } catch (err) {
    console.error("Erreur lors de la synchronisation:", err);
    showMessage("error", "Erreur lors de la synchronisation.");
  }
};

/**
 * Permet de modifier le nom d'utilisateur d'un joueur
 * Affiche une boîte de dialogue pour saisir le nouveau nom
 * @param player - Le joueur dont le nom doit être modifié
 */
const editPlayerUsername = (player: Player) => {
  const newUsername = prompt("Modifier le nom d'utilisateur:", player.username);
  if (newUsername && newUsername !== player.username) {
    playerService
      .updatePlayerUsername(player._id!, newUsername)
      .then(() => {
        showMessage("success", "Nom d'utilisateur mis à jour avec succès !");
        fetchPlayers(); // Rafraîchit la liste après modification
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la mise à jour du nom d'utilisateur:",
          err
        );
        showMessage(
          "error",
          "Erreur lors de la mise à jour du nom d'utilisateur."
        );
      });
  }
};

//-------------------------------------------------------
// SECTION: Gestion des notifications
//-------------------------------------------------------

/**
 * Affiche un message de notification temporaire
 * @param type - Type de notification ("success" ou "error")
 * @param message - Contenu du message
 */
const showMessage = (type: "success" | "error", message: string) => {
  // Défini le message approprié selon le type
  if (type === "success") {
    success.value = message;
    error.value = null;
  } else {
    error.value = message;
    success.value = null;
  }

  // Auto-effacement après 3 secondes
  setTimeout(() => {
    success.value = null;
    error.value = null;
  }, 3000);
};

//-------------------------------------------------------
// SECTION: Cycle de vie du composant
//-------------------------------------------------------

/**
 * Initialisation du composant au montage
 * Charge les données nécessaires à l'affichage
 */
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Ajout des classes personnalisées non-disponibles dans Tailwind */
.font-audiowide {
  font-family: "Audiowide", cursive;
}

.font-orbitron {
  font-family: "Orbitron", sans-serif;
}

.neon-text-pink {
  text-shadow: 0 0 5px #ec4899, 0 0 15px #ec4899, 0 0 20px #ec4899,
    0 0 40px #ec4899;
  animation: pulsate 1.5s infinite alternate;
}

.neon-text-cyan {
  text-shadow: 0 0 5px #06b6d4, 0 0 15px #06b6d4;
}

.neon-text-purple {
  text-shadow: 0 0 5px #a855f7, 0 0 15px #a855f7;
}

@keyframes pulsate {
  0% {
    text-shadow: 0 0 5px #ec4899, 0 0 15px #ec4899;
  }
  100% {
    text-shadow: 0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899,
      0 0 40px #ec4899;
  }
}

/* Grille d'arrière-plan */
.bg-grid-pattern {
  background-image: linear-gradient(
      rgba(139, 92, 246, 0.3) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(500px) rotateX(30deg);
  background-position: center center;
}

/* Scrollbar personnalisée */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thumb-cyan-500::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.5);
  border-radius: 3px;
}

.scrollbar-thumb-purple-500::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 3px;
}

.scrollbar-track-gray-800::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

/* Animation de scintillement pour le bouton */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
