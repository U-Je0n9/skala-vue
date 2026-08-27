<script setup>
import { computed, ref, watch } from 'vue'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import ForecastCard from '@/components/exercise/ForecastCard.vue'
import ForecastFilter from '@/components/exercise/ForecastFilter.vue'
import { useForecastStore } from '@/stores/forecastStore'
import { useCityStore } from '@/stores/cityStore'
import { defaultCities } from '@/api/weatherApi'

const dayOptions = [
  { label: '3일', value: 3 },
  { label: '5일', value: 5 },
  { label: '7일', value: 7 },
]

const forecastStore = useForecastStore()
const cityStore = useCityStore()
const cities = computed(() => {
  const allCities = [...defaultCities, ...cityStore.savedLocations]
  const uniqueCities = [
    ...new Map(allCities.map((city) => [city.name, city])).values(),
  ]

  return cityStore.sortByFavorites(uniqueCities)
})
const selectedCity = ref(cities.value[0])
const selectedDays = ref(5)

const forecastList = computed(() => {
  return forecastStore.getForecastByCity(selectedCity.value.name)
})

const visibleForecast = computed(() => {
  return forecastList.value.slice(0, selectedDays.value)
})

const rainyDays = computed(() => {
  return visibleForecast.value.filter((day) => day.precipitationProbability >= 50).length
})

watch(
  selectedCity,
  (city) => {
    forecastStore.fetchCityForecast(city)
  },
  { immediate: true },
)
</script>

<template>
  <div class="forecast-view">
    <BaseDashboardCard title="📅 주간 날씨 예보 설정">
      <ForecastFilter
        :selected-city="selectedCity"
        :selected-days="selectedDays"
        :cities="cities"
        :day-options="dayOptions"
        @update-city="selectedCity = $event"
        @update-days="selectedDays = $event"
      ></ForecastFilter>
    </BaseDashboardCard>

    <section v-if="visibleForecast.length" class="forecast-summary">
      <span class="summary-icon">☂️</span>
      <div>
        <strong>{{ selectedCity.name }}의 {{ selectedDays }}일 날씨 요약</strong>
        <p>강수확률 50% 이상인 날은 {{ rainyDays }}일입니다.</p>
      </div>
    </section>

    <div v-if="forecastStore.isLoading" class="forecast-state">
      <ProgressSpinner class="loading-spinner" stroke-width="5"></ProgressSpinner>
      <span>주간 예보를 불러오는 중입니다...</span>
    </div>

    <Message v-else-if="forecastStore.errorMessage" severity="error">
      {{ forecastStore.errorMessage }}
    </Message>

    <div v-else class="forecast-grid">
      <ForecastCard
        v-for="forecast in visibleForecast"
        :key="forecast.date"
        :forecast="forecast"
      ></ForecastCard>
    </div>
  </div>
</template>

<style scoped>
.forecast-view {
  display: grid;
  gap: 20px;
}

.forecast-summary {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border: 1px solid #bae6fd;
  border-radius: 14px;
  background: linear-gradient(90deg, #f0f9ff, #eff6ff);
  color: #0c4a6e;
}

.forecast-summary p {
  margin: 3px 0 0;
  color: #0369a1;
  font-size: 14px;
}

.summary-icon {
  font-size: 28px;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.forecast-state {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 36px;
  color: #475569;
}

.loading-spinner {
  width: 36px;
  height: 36px;
}

</style>
