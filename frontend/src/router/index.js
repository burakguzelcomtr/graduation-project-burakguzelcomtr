import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/passport',
      name: 'passport',
      component: () => import('../views/PassportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path : '/globals',
      name: 'globals',
      component: () => import('../views/GlobalsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/global-diary',
      name: 'global-diary',
      component: () => import('../views/GlobalDiaryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/units',
      name: 'units',
      component: () => import('../views/UnitsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/lesson/:lessonId',
      name: 'lesson-detail',
      component: () => import('../views/LessonDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/premun',
      name: 'premun',
      component: () => import('../views/PremunHub.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/TeacherStudents.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

let sessionFetched = false

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!sessionFetched) {
    await auth.fetchSession()
    sessionFetched = true
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login' }
  }

  // Already logged in → skip login page, go to dashboard
  if ((to.name === 'login') && auth.user) {
    return { name: 'dashboard' }
  }
})

export default router
