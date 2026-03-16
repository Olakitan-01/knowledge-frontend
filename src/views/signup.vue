<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// All form fields in one reactive object
const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// For showing/hiding password
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// For storing error messages
const errors = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// General error and loading state
const generalError = ref('')
const isLoading = ref(false)

// Validates the whole form, returns true if valid
function validate() {
  // Reset all errors first
  errors.firstName = ''
  errors.lastName = ''
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  generalError.value = ''

  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (form.username.includes(' ')) {
    errors.username = 'Username cannot contain spaces'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.email = 'Enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

async function submitSignup() {
  if (!validate()) return

  isLoading.value = true

  try {
    await userStore.signup(form)
    router.push('/login')

  } catch (error) {
    console.log('Signup error:', error.response?.data) 
    generalError.value = 'Something went wrong. Pls try again later'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10">

    <!-- Logo / App name -->
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-3">
        <span class="material-icons text-white text-3xl">auto_stories</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-800">Knowledge</h1>
      <p class="text-sm text-gray-400 mt-1">Create your account</p>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto w-full">

      <!-- General error -->
      <div v-if="generalError" class="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
        {{ generalError }}
      </div>

      <!-- First name + Last name side by side -->
      <div class="flex gap-3 mb-4">

        <div class="flex-1">
          <label class="text-xs font-medium text-gray-600">First Name</label>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="John"
            class="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition"
            :class="errors.firstName ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
          />
          <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
        </div>

        <div class="flex-1">
          <label class="text-xs font-medium text-gray-600">Last Name</label>
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Doe"
            class="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition"
            :class="errors.lastName ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
          />
          <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
        </div>

      </div>

      <!-- Username -->
      <div class="mb-4">
        <label class="text-xs font-medium text-gray-600">Username</label>
        <div class="relative mt-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
          <input
            v-model="form.username"
            type="text"
            placeholder="johndoe"
            class="w-full border rounded-xl pl-7 pr-3 py-2.5 text-sm text-gray-800 outline-none transition"
            :class="errors.username ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
          />
        </div>
        <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="text-xs font-medium text-gray-600">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="john@example.com"
          class="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition"
          :class="errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
        />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="text-xs font-medium text-gray-600">Password</label>
        <div class="relative mt-1">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 6 characters"
            class="w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition pr-10"
            :class="errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons text-base">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="mb-6">
        <label class="text-xs font-medium text-gray-600">Confirm Password</label>
        <div class="relative mt-1">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Repeat your password"
            class="w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition pr-10"
            :class="errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons text-base">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Submit button -->
      <button
        @click="submitSignup"
        :disabled="isLoading"
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
        :class="isLoading ? 'opacity-60 cursor-not-allowed' : ''"
      >
        {{ isLoading ? 'Creating account...' : 'Create Account' }}
      </button>

      <!-- Login link -->
      <p class="text-center text-sm text-gray-400 mt-4">
        Already have an account?
        <router-link to="/login" class="text-emerald-600 font-semibold hover:underline">
          Log in
        </router-link>
      </p>

    </div>
  </div>
</template>