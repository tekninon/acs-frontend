<!-- filepath: d:\Dev\ACS\acs-frontend\src\views\Membres.vue -->
<template>
  <div class="container mx-auto p-8 pt-20">
    <h1 class="text-4xl text-white mb-8 neon-text">Liste des membres</h1>
    <table class="min-w-full bg-white">
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td class="py-2 px-4 border-b">{{ user.username }}</td>
          <td>
            <img
              v-if="user.avatarUrl"
              :src="user.avatarUrl"
              alt="Avatar"
              class="w-20 h-20 rounded-full mx-auto"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Toast v-if="error" type="error" :message="error" />
    <Toast v-if="success" type="success" :message="success" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import userService from "../services/userService";
import Toast from "@/shared/Toast.vue";

interface User {
  _id?: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
}

const users = ref<User[]>([]);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const fetchUsers = async () => {
  try {
    users.value = await userService.fetchAllUsers();
    console.log("Utilisateurs récupérés:", users.value);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    error.value = "Erreur lors de la récupération des utilisateurs.";
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>
