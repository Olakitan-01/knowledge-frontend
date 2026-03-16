import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "../api/axios";

export const useUserStore = defineStore("user", () => {
  const profile = ref(null);
  const token = ref(localStorage.getItem("token") || null);
  const isAuthenticated = computed(() => !!token.value);

  async function signup(formData) {
    const response = await api.post("/auth/signup", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    return response.data;
  }

  async function login(formData) {
    const response = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    // Save token to localStorage so user stays logged in
    token.value = response.data.token;
    localStorage.setItem("token", response.data.token);
    await fetchProfile();
    console.log("Token saved:", response.data.token);

    return response.data;
  }

  function logout() {
    token.value = null;
    profile.value = null;
    localStorage.removeItem("token");
  }

  async function fetchProfile() {
    try {
      const response = await api.get("/users/me");
      profile.value = response.data;
    } catch (error) {
      console.log(
        "fetchProfile error:",
        error.response?.status,
        error.response?.data,
      );
    }
  }

  async function updateProfile(updateData) {
    const response = await api.patch("/users/me", updateData);
    profile.value = response.data;
  }

  return {
    signup,
    login,
    logout,
    profile,
    fetchProfile,
    updateProfile,
    isAuthenticated,
  };
});
