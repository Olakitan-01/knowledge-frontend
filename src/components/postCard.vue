<script setup>
import { ref, reactive, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const props = defineProps({
  post: Object
})

const store = usePostsStore()
const userStore = useUserStore()
const router = useRouter()

const isOwner = computed(() => {
  return userStore.profile?._id?.toString() === props.post?.userId?.toString()
})

const isEditing = ref(false)

const editForm = reactive({
  body: props.post?.body || '',
  tags: props.post?.tags.join(', ') || ''
})

// In script
const formattedDate = computed(() => {
  if (!props.post.createdAt) return ''
  return new Date(props.post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

function goToPost() {
  router.push(`/post/${props.post._id}`)
}
function saveEdit() {
  store.updatePost(props.post._id, {
    body: editForm.body,
    tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
  })
  isEditing.value = false
}

function cancelEdit() {
  editForm.body = props.post.body
  editForm.tags = props.post.tags.join(', ')
  isEditing.value = false
}

function deletePost() {
  if (confirm('Delete this post?')) {
    store.deletePost(props.post._id)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">

    <!-- VIEW MODE -->
    <template v-if="!isEditing">

      <!-- Card Header — Avatar + Username + Date -->
      <div class="flex items-center justify-between px-5 pt-4 pb-2">
        <div class="flex items-center gap-3">

          <!-- Avatar -->
          <div class="w-9 h-9 rounded-full bg-white-100 flex items-center justify-center overflow-hidden">
            <img v-if="post.avatar" :src="post.avatar" class="w-full h-full object-cover" />
            <span v-else class="material-icons text-white-600 text-xl">person</span>
          </div>

          <!-- Username -->
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ post.username }}</p>
            <p class="text-xs text-gray-400">{{ formattedDate }}</p>
          </div>

        </div>

        <!-- Owner actions -->
        <div v-if="isOwner" class="flex gap-1">
          <button @click="isEditing = true" class="p-1.5 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition">
            <span class="material-icons text-base">edit</span>
          </button>
          <button @click="deletePost" class="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition">
            <span class="material-icons text-base">delete</span>
          </button>
        </div>
      </div>

      <!-- Media — full width, no padding -->
      <div v-if="post.mediaUrl" class="w-full cursor-pointer" @click="goToPost">
        <img
          v-if="post.mediaType === 'image'"
          :src="post.mediaUrl"
          alt="post media"
          class="w-full max-h-80 object-cover"
        />
        <video
          v-if="post.mediaType === 'video'"
          :src="post.mediaUrl"
          controls
          class="w-full max-h-80"
        ></video>
      </div>

      <!-- Body text -->
      <div class="px-5 pt-3 cursor-pointer" @click="goToPost">
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

      <!-- Action bar — Likes & Comments -->
      <div class="flex items-center gap-5 px-5 py-3 mt-1 border-t border-gray-50">
        <button class="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition">
          <span class="material-icons text-base">favorite_border</span>
          <span class="text-xs">Like</span>
        </button>
        <button class="flex items-center gap-1.5 text-gray-400 hover:text-emerald-600 transition">
          <span class="material-icons text-base">chat_bubble_outline</span>
          <span class="text-xs">Comment</span>
        </button>
      </div>

    </template>

    <!-- EDIT MODE -->
    <template v-else>
      <div class="p-5">

        <textarea
          v-model="editForm.body"
          rows="4"
          class="w-full text-gray-800 text-base resize-none outline-none border border-gray-200 rounded-xl p-3"
        ></textarea>

        <input
          type="text"
          v-model="editForm.tags"
          placeholder="Tags: vue, javascript"
          class="w-full mt-2 text-sm text-gray-500 outline-none border border-gray-200 rounded-xl px-3 py-2"
        />

        <div class="flex gap-2 mt-3 justify-end">
          <button @click="cancelEdit" class="text-sm text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="saveEdit" class="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-full">
            Save
          </button>
        </div>

      </div>
    </template>

  </div>
</template>