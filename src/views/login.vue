<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const showPassword = ref(false);

const errors = reactive({
  email: "",
  password: "",
});

const generalError = ref("");
const isLoading = ref(false);

function validate() {
  // Reset errors first
  errors.email = "";
  errors.password = "";
  generalError.value = "";

  let isValid = true;

  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!form.email.includes("@")) {
    errors.email = "Enter a valid email";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "Password is required";
    isValid = false;
  }

  return isValid;
}

async function submitLogin() {
  if (!validate()) return;

  isLoading.value = true;

  try {
    await userStore.login(form);
    router.push("/");
  } catch (error) {
    generalError.value = "Invalid email or password.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div
        class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-3"
      >
        <span class="material-icons text-white text-3xl">auto_stories</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-800">Knowledge</h1>
      <p class="text-sm text-gray-400 mt-1">Welcome back</p>
    </div>

    <!-- Card -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto w-full"
    >
      <!-- General error -->
      <div
        v-if="generalError"
        class="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4"
      >
        {{ generalError }}
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="text-xs font-medium text-gray-600">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="john@example.com"
          class="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition"
          :class="
            errors.email
              ? 'border-red-400 focus:border-red-400'
              : 'border-gray-200 focus:border-emerald-400'
          "
        />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div class="mb-2">
        <label class="text-xs font-medium text-gray-600">Password</label>
        <div class="relative mt-1">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Your password"
            class="w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition pr-10"
            :class="
              errors.password
                ? 'border-red-400 focus:border-red-400'
                : 'border-gray-200 focus:border-emerald-400'
            "
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons text-base">
              {{ showPassword ? "visibility_off" : "visibility" }}
            </span>
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500 mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Forgot password -->
      <div class="text-right mb-6">
        <a href="#" class="text-xs text-emerald-600 hover:underline"
          >Forgot password?</a
        >
      </div>

      <!-- Submit -->
      <button
        @click="submitLogin"
        :disabled="isLoading"
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
        :class="isLoading ? 'opacity-60 cursor-not-allowed' : ''"
      >
        {{ isLoading ? "Logging in..." : "Log In" }}
      </button>

      <!-- Signup link -->
      <p class="text-center text-sm text-gray-400 mt-4">
        Don't have an account?
        <router-link
          to="/signup"
          class="text-emerald-600 font-semibold hover:underline"
        >
          Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>
