<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from '../Weather/BaseDashboardCard.vue'
import SearchBar from '../Weather/SearchBar.vue'
import WeatherCard from '../Weather/WeatherCard.vue'
import WeatherStatusBar from '../Weather/WeatherStatusBar.vue'

const searchQuery = ref('')
const selectedCityInfo = ref('')

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이(가) 선택되었습니다.`
}

const showDetails = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

watch(selectedCityInfo, (newValue) => {
  console.log(`🤖 [watch 감지] 상태 바 문구가 업데이트되었습니다. → ${newValue}`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 검색합니다.`,
  )
})
</script>

<template>
  <BaseDashboardCard title="과제 3: 날씨 (컴포넌트)">
    <template #search>
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" />
    </template>

    <template #weather>
      <div v-if="filteredWeatherList.length" class="weather-list">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCity"
          @click-detail="showDetails"
        />
      </div>
      <p v-else class="empty-message">일치하는 도시가 없습니다.</p>
    </template>

    <template #status>
      <WeatherStatusBar :message="selectedCityInfo" />
    </template>
  </BaseDashboardCard>
</template>

<style scoped>
.weather-list {
  display: grid;
  gap: 14px;
}

.empty-message {
  margin: 0;
  padding: 28px 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  color: #64748b;
  text-align: center;
}
</style>
