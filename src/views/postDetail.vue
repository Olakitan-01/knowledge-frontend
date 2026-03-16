<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()
const userStore = useUserStore()

// Find the post matching the ID in the URL
// route.params.id is a string so we convert with Number()
const post = computed(() => {
  return store.posts.find(p => p._id === route.params.id)
})

// If post not found, go back home
if (!post.value) router.push('/')

const isOwner = computed(() => userStore.profile?._id === props.post.userId)

// Comments
const comments = ref([])
const newComment = ref('')

function submitComment() {
  if (!newComment.value.trim()) return

  comments.value.push({
    id: Date.now(),
    username: currentUser.name,
    body: newComment.value,
    createdAt: new Date().toLocaleString()
  })

  newComment.value = ''
}

// Likes
const liked = ref(false)
const likeCount = ref(0)

function toggleLike() {
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
}
</script>

<template>
  <div v-if="post" class="min-h-screen bg-gray-50">

    <!-- Header -->
    <div class="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
      <button @click="router.back()" class="text-gray-500 hover:text-gray-800">
        <span class="material-icons">arrow_back</span>
      </button>
      <h2 class="text-lg font-bold text-gray-800">Post</h2>
    </div>

    <div class="max-w-lg mx-auto px-4 py-5">

      <!-- Post Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">

        <!-- Author -->
        <div class="flex items-center gap-3 px-5 pt-4 pb-2">
          <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <img v-if="post.avatar" :src="post.avatar" class="w-full h-full object-cover rounded-full" />
            <span v-else class="material-icons text-emerald-600 text-xl">person</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ post.username }}</p>
            <p class="text-xs text-gray-400">{{ post.createdAt }}</p>
          </div>
        </div>

        <!-- Media -->
        <div v-if="post.mediaUrl" class="w-full">
          <img v-if="post.mediaType === 'image'" :src="post.mediaUrl" class="w-full object-cover" />
          <video v-if="post.mediaType === 'video'" :src="post.mediaUrl" controls class="w-full"></video>
        </div>

        <!-- Body -->
        <div class="px-5 pt-3">
          <p class="text-gray-800 text-base leading-relaxed">{{ post.body }}</p>
        </div>

        <!-- Tags -->
        <div v-if="post.tags.length" class="flex flex-wrap gap-2 px-5 pt-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Like & Comment count -->
        <div class="flex items-center gap-5 px-5 py-3 mt-1 border-t border-gray-50">
          <button
            @click="toggleLike"
            class="flex items-center gap-1.5 transition"
            :class="liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
          >
            <span class="material-icons text-base">
              {{ liked ? 'favorite' : 'favorite_border' }}
            </span>
            <span class="text-xs">{{ likeCount }} Likes</span>
          </button>

          <div class="flex items-center gap-1.5 text-gray-400">
            <span class="material-icons text-base">chat_bubble_outline</span>
            <span class="text-xs">{{ comments.length }} Comments</span>
          </div>
        </div>

      </div>

      <!-- Comments Section -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        <h3 class="text-sm font-bold text-gray-700 mb-4">Comments</h3>

        <!-- No comments yet -->
        <div v-if="comments.length === 0" class="text-center py-4 text-gray-400">
          <span class="material-icons text-3xl">chat_bubble_outline</span>
          <p class="text-sm mt-1">No comments yet. Start the conversation!</p>
        </div>

        <!-- Comment list -->
        <div v-for="comment in comments" :key="comment.id" class="flex gap-3 mb-4">
          <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <span class="material-icons text-emerald-600 text-base">person</span>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-2 flex-1">
            <p class="text-xs font-semibold text-gray-700">{{ comment.username }}</p>
            <p class="text-sm text-gray-600 mt-0.5">{{ comment.body }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ comment.createdAt }}</p>
          </div>
        </div>

        <!-- Comment input -->
        <div class="flex items-center gap-3 mt-4 border-t border-gray-50 pt-4">
          <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <span class="material-icons text-emerald-600 text-base">person</span>
          </div>
          <div class="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <input
              v-model="newComment"
              type="text"
              placeholder="Write a comment..."
              class="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
              @keyup.enter="submitComment"
            />
            <button @click="submitComment" class="text-emerald-600 hover:text-emerald-700">
              <span class="material-icons text-base">send</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>