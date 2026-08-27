import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //전부 동적으로 (lazy)
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/forecast',
      name: 'weather-forecast',
      component: () => import('../views/WeatherForecastView.vue'),
    },
    {
      path: '/weather/:id',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
      beforeEnter: (to) => {
        if (!/^\d+$/.test(String(to.params.id))) {
          return { name: 'not-found', params: { pathMatch: ['weather', to.params.id] } }
        }
      },
    },
    //아래는 catch-all route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
