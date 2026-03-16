// import {defineStore} from 'pinia';
// import {ref} from 'vue';


// export const usePostsStore = defineStore('posts', () => {
//     const posts = ref([]);

//     let nextId = 1

//     const currentUser = ref({ id: 1, 
//         name: 'Emmananuel',
//         username: 'Emman',
//         bio: 'A software Engineer interestedd in sharing the knowledge gained over the years. Also a Barcerlona fan',
//         avatar: null,
//      })

//     function createPost(newPost) {
//         posts.value.push({id : nextId++,
//             createdAt : new Date().toLocaleString(),
//             userId: currentUser.value.id,
//             username: currentUser.value.name, 
//             avatar: currentUser.value.avatar,
//             ...newPost});
//     }

//     function updatePost(id, updatedPost) {
//         const index = posts.value.findIndex(post => post.id === id);
//         if (index !== -1) {
//             posts.value[index] = {...posts.value[index], ...updatedPost};
//         };
//     }

//     function deletePost(id) {
//         posts.value = posts.value.filter(post => post.id !== id);
    
//     }

//     return{ posts, currentUser, createPost, updatePost, deletePost};
// }); 

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])

  async function fetchPosts() {
    const response = await api.get('/posts')
    posts.value = response.data
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

  return { posts, fetchPosts, fetchUserPosts, createPost, updatePost, deletePost }
})