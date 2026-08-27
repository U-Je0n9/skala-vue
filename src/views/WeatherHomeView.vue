<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeather } from '@/composables/useWeather'
import { useCityStore } from '@/stores/cityStore'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const cityStore = useCityStore()
const searchQuery = ref('')
const selectedCityInfo = ref('')
const { weatherData, isLoading, errorMessage, getWeather } = useWeather()

const weatherList = computed(() => {
  const allCities = [...(weatherData.value ?? []), ...cityStore.savedWeather]
  const uniqueCities = [...new Map(allCities.map((city) => [city.id, city])).values()]
  return cityStore.sortByFavorites(uniqueCities)
})
const cityNames = computed(() => weatherList.value.map((city) => city.name))

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이(가) 선택되었습니다.`
}

const moveToDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

const addCity = async (query) => {
  const city = await cityStore.searchAndAddCity(query)

  if (city) {
    searchQuery.value = city.name
    selectedCityInfo.value = `${city.name} 날씨를 추가하고 브라우저에 저장했습니다.`
  }
}

onMounted(() => {
  getWeather()
  cityStore.refreshSavedCities()
})
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar
        :search-query="searchQuery"
        :city-names="cityNames"
        @update-query="searchQuery = $event"
        @add-city="addCity"
      ></SearchBar>
    </BaseDashboardCard>

    <BaseDashboardCard title="🌁 지역별 날씨 현황">
      <div v-if="isLoading" class="state-message">
        <ProgressSpinner class="loading-spinner" stroke-width="5"></ProgressSpinner>
        <span>날씨 데이터를 불러오는 중입니다...</span>
      </div>
      <Message v-else-if="errorMessage || cityStore.errorMessage" severity="error">
        {{ errorMessage || cityStore.errorMessage }}
      </Message>
      <div v-else-if="filteredWeatherList.length" class="weather-list">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          :is-favorite="cityStore.isFavorite(weather.name)"
          @select-card="selectCity"
          @click-detail="moveToDetail"
          @toggle-favorite="cityStore.toggleFavorite(weather.name)"
        ></WeatherCard>
      </div>
      <p v-else class="empty-message">일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-message">
      {{ selectedCityInfo || '카드를 클릭하거나 검색해 보세요.' }}
    </p>
  </div>
</template>

<style scoped>
.weather-home {
  display: grid;
  gap: 18px;
}

.weather-list {
  display: grid;
  gap: 14px;
}

.empty-message {
  margin: 0;
  padding: 28px;
  color: #64748b;
  text-align: center;
}

.state-message,
.error-message {
  margin: 0;
  padding: 28px;
  border-radius: 10px;
  text-align: center;
}

.state-message {
  display: grid;
  justify-items: center;
  gap: 12px;
  background: #f1f5f9;
  color: #475569;
}

.loading-spinner {
  width: 32px;
  height: 32px;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
}

.status-message {
  margin: 0;
  padding: 16px;
  border-radius: 10px;
  background: #dcfce7;
  color: #15803d;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}
</style>
