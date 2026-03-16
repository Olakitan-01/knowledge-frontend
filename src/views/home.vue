<script setup>
import { onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostCard from '@/components/postCard.vue'

const store = usePostsStore()

onMounted(async () => {
  await store.fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6 max-w-lg mx-auto">

    <div v-if="store.posts.length === 0" class="text-center mt-20 text-gray-400">
      <span class="material-icons text-5xl">auto_stories</span>
      <p class="mt-2 text-sm">No posts yet. Be the first to share knowledge!</p>
    </div>

    <PostCard
      v-for="post in store.posts"
      :key="post._id"
      :post="post"
    />

    <!-- Load more button -->
    <div v-if="store.hasMore" class="text-center py-4">
      <button
        @click="loadMore"
        class="text-sm text-emerald-600 border border-emerald-600 px-6 py-2 rounded-full hover:bg-emerald-50 transition"
      >
        Load more
      </button>
    </div>

    <div v-else-if="store.posts.length > 0" class="text-center py-4 text-gray-400 text-sm">
      You're all caught up!
    </div>

  </div>
</template>