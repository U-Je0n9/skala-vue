<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeather } from '@/composables/useWeather'

const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref('')
const { weatherData, isLoading, errorMessage, getWeather } = useWeather()

const weatherList = computed(() => (weatherData.value ? [weatherData.value] : []))

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이(가) 선택되었습니다.`
}

const moveToDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

onMounted(() => {
  getWeather()
})
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar
        :search-query="searchQuery"
        @update-query="searchQuery = $event"
      ></SearchBar>
    </BaseDashboardCard>

    <BaseDashboardCard title="🌁 지역별 날씨 현황">
      <p v-if="isLoading" class="state-message">날씨 데이터를 불러오는 중입니다...</p>
      <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div v-else-if="filteredWeatherList.length" class="weather-list">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCity"
          @click-detail="moveToDetail"
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
  background: #f1f5f9;
  color: #475569;
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
