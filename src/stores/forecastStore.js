import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchForecast } from '@/api/forecastApi'

export const useForecastStore = defineStore('forecast', () => {
  const forecastByCity = ref({})
  const isLoading = ref(false)
  const errorMessage = ref('')

  const getForecastByCity = computed(() => {
    return (cityName) => forecastByCity.value[cityName] ?? []
  })

  const fetchCityForecast = async (city) => {
    if (forecastByCity.value[city.name]) return

    isLoading.value = true
    errorMessage.value = ''

    try {
      forecastByCity.value[city.name] = await fetchForecast(city)
    } catch (error) {
      errorMessage.value = error.message || '주간 예보를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    forecastByCity,
    isLoading,
    errorMessage,
    getForecastByCity,
    fetchCityForecast,
  }
})
