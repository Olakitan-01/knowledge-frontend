import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])


  const hasMore = ref(true)
  const currentPage = ref(1)
  
  async function fetchPosts(page = 1) {
    const response = await api.get('/posts?page=${page}&limit=15')

    if (page === 1) {
      post.value = response.data.posts
    } else {
    posts.value = [...posts.value, ...response.data.posts]
    }

    hasMore.value = response.data.hasMore
    currentPage.value = page
  }

  async function loadMore() {
  if (hasMore.value) {
    await fetchPosts(currentPage.value + 1)
  }
}

  async function fetchUserPosts(userId) {
    const response = await api.get(`/posts/user/${userId}`)
    return response.data
  }

  async function createPost(postData) {
    const response = await api.post('/posts', postData)
    posts.value.unshift(response.data) // adds to top of feed
  }

  async function updatePost(id, updatedData) {
    const response = await api.patch(`/posts/${id}`, updatedData)
    const index = posts.value.findIndex(p => p._id === id)
    if (index !== -1) posts.value[index] = response.data
  }

  async function deletePost(id) {
    await api.delete(`/posts/${id}`)
    posts.value = posts.value.filter(p => p._id !== id)
  }

  return { posts, hasMore, fetchPosts, fetchUserPosts, loadMore, createPost, updatePost, deletePost }
})