import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCityWeather, searchCityLocation } from '@/api/weatherApi'

const STORAGE_KEY = 'weather-saved-cities'
const FAVORITES_KEY = 'weather-favorite-cities'

const readSavedLocations = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

const readFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? []
  } catch {
    return []
  }
}

export const useCityStore = defineStore('city', () => {
  const savedLocations = ref(readSavedLocations())
  const favoriteCityNames = ref(readFavorites())
  const savedWeather = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const saveLocations = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations.value))
  }

  const toggleFavorite = (cityName) => {
    const favoriteIndex = favoriteCityNames.value.indexOf(cityName)

    if (favoriteIndex === -1) favoriteCityNames.value.push(cityName)
    else favoriteCityNames.value.splice(favoriteIndex, 1)

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteCityNames.value))
  }

  const isFavorite = (cityName) => favoriteCityNames.value.includes(cityName)

  const sortByFavorites = (cities) => {
    return [...cities].sort((cityA, cityB) => {
      const indexA = favoriteCityNames.value.indexOf(cityA.name)
      const indexB = favoriteCityNames.value.indexOf(cityB.name)
      const orderA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
      const orderB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB

      return orderA - orderB
    })
  }

  const refreshSavedCities = async () => {
    if (!savedLocations.value.length) return

    isLoading.value = true
    errorMessage.value = ''

    try {
      savedWeather.value = await Promise.all(savedLocations.value.map(fetchCityWeather))
    } catch (error) {
      errorMessage.value = error.message || '저장한 도시의 날씨를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const searchAndAddCity = async (query) => {
    const keyword = query.trim()
    if (!keyword) return null

    isLoading.value = true
    errorMessage.value = ''

    try {
      const location = await searchCityLocation(keyword)
      const weather = await fetchCityWeather(location)
      const alreadySaved = savedLocations.value.some(
        (city) => city.lat === location.lat && city.lon === location.lon,
      )

      if (!alreadySaved) {
        savedLocations.value.push(location)
        saveLocations()
      }

      const weatherIndex = savedWeather.value.findIndex((city) => city.id === weather.id)
      if (weatherIndex === -1) savedWeather.value.push(weather)
      else savedWeather.value[weatherIndex] = weather

      return weather
    } catch (error) {
      errorMessage.value = error.message || '도시를 검색하지 못했습니다.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    savedLocations,
    savedWeather,
    favoriteCityNames,
    isLoading,
    errorMessage,
    refreshSavedCities,
    searchAndAddCity,
    toggleFavorite,
    isFavorite,
    sortByFavorites,
  }
})
