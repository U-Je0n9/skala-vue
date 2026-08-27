import { createRouter, createWebHistory } from 'vue-router'

const validCityIds = ['city_01', 'city_02', 'city_03']

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
      path: '/weather/:id',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
      beforeEnter: (to) => {
        if (!validCityIds.includes(to.params.id)) {
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
