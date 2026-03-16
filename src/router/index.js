import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import Signup from '@/views/signup.vue'
import Home from '@/views/home.vue'
import Profile from '@/views/profile.vue'
import Notification from '@/views/notification.vue'
import Create from '@/views/createPost.vue'
import PostDetail from '@/views/postDetail.vue'
import { useUserStore } from '@/stores/user'


const publicRoutes = ['/login', '/signup']


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signup',
      component: Signup
    },
    {
      path: '/',
      component: Home
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/create',
      component: Create
    },
    {
      path: '/post/:id',
      component: PostDetail
    },
    {
      path: '/notifications',
      component: Notification
    }
  ],
});

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const isPublic = publicRoutes.includes(to.path)

  if (!isPublic && !userStore.isAuthenticated) {
    return '/login'
  }
  else if (isPublic && userStore.isAuthenticated) {
    return '/'
  } 
})


export default router
