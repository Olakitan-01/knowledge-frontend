<script setup>
import { ref, reactive } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useRouter } from 'vue-router'

const store = usePostsStore()
const router = useRouter()

const form = reactive({
  body: '',
  tags: '',
  mediaType: null
})

const preview = ref(null)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  form.mediaType = file.type.startsWith('image/') ? 'image' : 'video'
  preview.value = URL.createObjectURL(file)
  form.mediaUrl = preview.value
}

async function submitPost() {
  if (!form.body.trim()) return alert('Post cannot be empty!')

  await store.createPost({
    body: form.body,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    mediaUrl: form.mediaUrl,
    mediaType: form.mediaType,
  })

  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6">
    
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <router-link to="/" class="text-gray-500 hover:text-gray-800">
        <span class="material-icons">arrow_back</span>
      </router-link>
      <h2 class="text-lg font-bold text-gray-800">Create Knowledge</h2>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-lg mx-auto">
      
      <!-- Body -->
      <textarea
        v-model="form.body"
        placeholder="Share your knowledge..."
        rows="5"
        class="w-full text-gray-800 text-base resize-none outline-none placeholder-gray-400"
      ></textarea>

      <!-- Media Preview -->
      <div v-if="preview" class="mt-3 rounded-xl overflow-hidden">
        <img v-if="form.mediaType === 'image'" :src="preview" alt="preview" class="w-full max-h-64 object-cover" />
        <video v-if="form.mediaType === 'video'" :src="preview" controls class="w-full max-h-64"></video>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
        
        <!-- Left actions -->
        <div class="flex items-center gap-3">

          <!-- File upload -->
          <label class="cursor-pointer text-emerald-600 hover:text-emerald-700">
            <span class="material-icons">photo_camera</span>
            <input type="file" accept="image/*,video/*" @change="handleFileUpload" class="hidden" />
          </label>

          <!-- Tags input -->
          <input
            type="text"
            v-model="form.tags"
            placeholder="Add tags..."
            class="text-sm text-gray-500 outline-none placeholder-gray-400 w-36"
          />
        </div>

        <!-- Post button -->
        <button
        @click="submitPost"
        class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
        >
            Post
        </button>

      </div>
    </div>

  </div>
</template>