import { ref } from 'vue'
import { fetchAirQuality } from '@/api/airQualityApi'
import { searchCityLocation } from '@/api/weatherApi'

export const useAirQuality = () => {
  const airQuality = ref(null)
  const isAirLoading = ref(false)
  const airErrorMessage = ref('')

  const getAirQuality = async (city) => {
    isAirLoading.value = true
    airErrorMessage.value = ''

    try {
      const airCity = city.sidoName ? city : { ...city, ...(await searchCityLocation(city.name)) }
      airQuality.value = await fetchAirQuality(airCity)
    } catch (error) {
      airQuality.value = null
      airErrorMessage.value =
        error.response?.status === 504
          ? '에어코리아 서버 응답이 지연되고 있습니다. 잠시 후 다시 확인해 주세요.'
          : error.message || '대기질 정보를 불러오지 못했습니다.'
    } finally {
      isAirLoading.value = false
    }
  }

  return { airQuality, isAirLoading, airErrorMessage, getAirQuality }
}
