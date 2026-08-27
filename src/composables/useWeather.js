import { ref } from 'vue'
import { fetchWeather } from '@/api/weatherApi'

export const useWeather = () => {
  const weatherData = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const runRequest = async (request) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      weatherData.value = await request()
      return weatherData.value
    } catch (error) {
      weatherData.value = null

      if (error.response?.status === 404) {
        errorMessage.value = '일치하는 도시를 찾을 수 없습니다.'
      } else {
        errorMessage.value = error.message || '날씨 데이터를 가져오지 못했습니다.'
      }

      return null
    } finally {
      isLoading.value = false
    }
  }

  const getWeather = () => {
    return runRequest(fetchWeather)
  }

  return {
    weatherData,
    isLoading,
    errorMessage,
    getWeather,
  }
}
