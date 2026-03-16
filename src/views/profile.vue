<script setup>
import { ref, computed, reactive, onMounted} from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'

const postsStore = usePostsStore()
const userStore = useUserStore()

// Active tab — 'posts' or 'liked'
const activeTab = ref('posts')

// Edit mode
const isEditing = ref(false)

const editForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  bio: '',
  gender: ''
})

// Only show posts belonging to this user
const userPosts = computed(() => {  
  return postsStore.posts.filter(p => p.userId === userStore.profile._id)
})

// When edit button clicked, prefill form with current data
function startEdit() {
  editForm.firstName = userStore.profile?.firstName || ''
  editForm.lastName = userStore.profile?.lastName || ''
  editForm.username = userStore.profile?.username || ''
  editForm.bio = userStore.profile?.bio || ''
  editForm.gender = userStore.profile?.gender || ''
  isEditing.value = true
}

function saveProfile() {
  userStore.updateProfile(editForm)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

// Fetch profile when page loads
onMounted(async () => {
  await userStore.fetchProfile()
  await postsStore.fetchPosts()
});

</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <div class="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
      <h2 class="text-lg font-bold text-gray-800">Profile</h2>
    </div>

    <!-- Loading state -->
    <div v-if="!userStore.profile" class="text-center mt-20 text-gray-400">
      <span class="material-icons text-4xl">hourglass_empty</span>
      <p class="text-sm mt-2">Loading profile...</p>
    </div>

    <!-- Profile content -->
    <div v-else class="max-w-lg mx-auto">

      <!-- Profile Card -->
      <div class="bg-white border-b border-gray-100 px-5 py-6">

        <!-- VIEW MODE -->
        <template v-if="!isEditing">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                <img v-if="userStore.profile.avatar" :src="userStore.profile.avatar" class="w-full h-full object-cover" />
                <span v-else class="material-icons text-emerald-600 text-4xl">person</span>
              </div>
              <div>
                <p class="text-base font-bold text-gray-800">
                  {{ userStore.profile.firstName }} {{ userStore.profile.lastName }}
                </p>
                <p class="text-sm text-gray-400">@{{ userStore.profile.username }}</p>
                <p class="text-xs text-gray-400 mt-0.5 capitalize">{{ userStore.profile.gender }}</p>
              </div>
            </div>
            <button
              @click="startEdit"
              class="text-sm text-emerald-600 border border-emerald-600 px-4 py-1.5 rounded-full hover:bg-emerald-50 transition"
            >
              Edit
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-4 leading-relaxed">{{ userStore.profile.bio }}</p>
          <div class="mt-4">
            <span class="text-sm font-bold text-gray-800">{{ userPosts.length }}</span>
            <span class="text-sm text-gray-400 ml-1">Posts</span>
          </div>
        </template>

        <!-- EDIT MODE -->
        <template v-else>
          <div class="space-y-3">

            <div class="flex gap-3">
              <div class="flex-1">
                <label class="text-xs text-gray-500 font-medium">First Name</label>
                <input v-model="editForm.firstName" type="text"
                  class="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div class="flex-1">
                <label class="text-xs text-gray-500 font-medium">Last Name</label>
                <input v-model="editForm.lastName" type="text"
                  class="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-500 font-medium">Username</label>
              <input v-model="editForm.username" type="text"
                class="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
            </div>

            <div>
              <label class="text-xs text-gray-500 font-medium">Bio</label>
              <textarea v-model="editForm.bio" rows="3"
                class="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-emerald-400"></textarea>
            </div>

            <div>
              <label class="text-xs text-gray-500 font-medium">Gender</label>
              <select v-model="editForm.gender"
                class="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="flex gap-2 justify-end pt-1">
              <button @click="cancelEdit"
                class="text-sm text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button @click="saveProfile"
                class="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-full">
                Save
              </button>
            </div>

          </div>
        </template>

      </div>

      <!-- Tabs -->
      <div class="flex bg-white border-b border-gray-100">
        <button @click="activeTab = 'posts'" class="flex-1 py-3 text-sm font-semibold transition"
          :class="activeTab === 'posts' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-400'">
          Posts
        </button>
        <button @click="activeTab = 'liked'" class="flex-1 py-3 text-sm font-semibold transition"
          :class="activeTab === 'liked' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-400'">
          Liked
        </button>
      </div>

      <!-- Tab Content -->
      <div class="px-4 py-4">

        <template v-if="activeTab === 'posts'">
          <div v-if="userPosts.length === 0" class="text-center py-10 text-gray-400">
            <span class="material-icons text-4xl">auto_stories</span>
            <p class="text-sm mt-2">No posts yet.</p>
          </div>
          <div v-for="post in userPosts" :key="post.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3 cursor-pointer"
            @click="$router.push(`/post/${post.id}`)">
            <p class="text-gray-800 text-sm leading-relaxed">{{ post.body }}</p>
            <div v-if="post.mediaUrl" class="mt-2 rounded-xl overflow-hidden">
              <img v-if="post.mediaType === 'image'" :src="post.mediaUrl" class="w-full max-h-40 object-cover" />
            </div>
            <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-2">
              <span v-for="tag in post.tags" :key="tag"
                class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                #{{ tag }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ post.createdAt }}</p>
          </div>
        </template>

        <template v-if="activeTab === 'liked'">
          <div class="text-center py-10 text-gray-400">
            <span class="material-icons text-4xl">favorite_border</span>
            <p class="text-sm mt-2">Posts you like will appear here.</p>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>