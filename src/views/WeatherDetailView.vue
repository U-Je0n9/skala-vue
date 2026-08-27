<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeather } from '@/composables/useWeather'
import { useCityStore } from '@/stores/cityStore'
import { useAirQuality } from '@/composables/useAirQuality'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'

const router = useRouter()
const route = useRoute()
const cityStore = useCityStore()

const { weatherData: weatherList, isLoading, errorMessage, getWeather } = useWeather()
const weather = computed(() => {
  return [...(weatherList.value ?? []), ...cityStore.savedWeather].find(
    (city) => city.id === route.params.id,
  )
})
const { displayTemp, unitSymbol } = useTemperature(() => weather.value?.temp ?? 0)
const { airQuality, isAirLoading, airErrorMessage, getAirQuality } = useAirQuality()
const hasMissingAirData = computed(() => {
  if (!airQuality.value) return false
  return [airQuality.value.pm10Value, airQuality.value.pm25Value, airQuality.value.khaiValue].some(
    (value) => value === null,
  )
})

const formatDustValue = (value) => (value === null ? '미수신' : `${value}㎍/㎥`)
const gradeSeverity = (grade) => {
  return { 좋음: 'info', 보통: 'success', 나쁨: 'warn', '매우 나쁨': 'danger' }[grade]
}

watch(
  weather,
  (city) => {
    if (city) getAirQuality(city)
  },
  { immediate: true },
)

onMounted(() => {
  getWeather()
  cityStore.refreshSavedCities()
})
</script>

<template>
  <section v-if="isLoading" class="detail-card state-message">
    <ProgressSpinner class="loading-spinner" stroke-width="5"></ProgressSpinner>
    <span>날씨 데이터를 불러오는 중입니다...</span>
  </section>

  <section v-else-if="errorMessage" class="detail-card state-message error-message">
    <Message severity="error">{{ errorMessage }}</Message>
    <Button label="목록으로 돌아가기" @click="router.push('/')"></Button>
  </section>

  <section v-else-if="weather" class="detail-card">
    <h2>🌡️ {{ weather.name }} 상세 날씨</h2>
    <dl>
      <div>
        <dt>날씨</dt>
        <dd>{{ weather.status }}</dd>
      </div>
      <div>
        <dt>현재 기온</dt>
        <dd>{{ displayTemp }}{{ unitSymbol }}</dd>
      </div>
      <div>
        <dt>습도</dt>
        <dd>{{ weather.humidity }}%</dd>
      </div>
      <div>
        <dt>풍속</dt>
        <dd>{{ weather.wind }}m/s</dd>
      </div>
    </dl>

    <section class="air-quality">
      <div class="air-quality-title">
        <h3>🌿 현재 대기질</h3>
        <span v-if="airQuality">{{ airQuality.stationName }} 측정소 · {{ airQuality.dataTime }}</span>
      </div>

      <div v-if="isAirLoading" class="air-state">
        <ProgressSpinner class="air-spinner" stroke-width="5"></ProgressSpinner>
        <span>미세먼지 정보를 불러오는 중입니다...</span>
      </div>
      <Message v-else-if="airErrorMessage" severity="secondary">{{ airErrorMessage }}</Message>
      <template v-else-if="airQuality">
        <Message v-if="airQuality.isAutoSelected" severity="info" class="air-notice">
          검색 도시와 같은 시도의 측정 가능한 {{ airQuality.stationName }} 측정소 정보입니다.
        </Message>
        <Message v-if="hasMissingAirData" severity="warn" class="air-notice">
          측정소 점검 또는 통신 상태로 일부 대기질 값이 수신되지 않았습니다.
        </Message>
        <dl class="air-quality-list">
          <div>
            <dt>미세먼지</dt>
            <dd>
              {{ formatDustValue(airQuality.pm10Value) }}
              <Tag :severity="gradeSeverity(airQuality.pm10Grade)" :value="airQuality.pm10Grade"></Tag>
            </dd>
          </div>
          <div>
            <dt>초미세먼지</dt>
            <dd>
              {{ formatDustValue(airQuality.pm25Value) }}
              <Tag :severity="gradeSeverity(airQuality.pm25Grade)" :value="airQuality.pm25Grade"></Tag>
            </dd>
          </div>
          <div>
            <dt>통합대기환경지수</dt>
            <dd>
              {{ airQuality.khaiValue ?? '미수신' }}
              <Tag :severity="gradeSeverity(airQuality.khaiGrade)" :value="airQuality.khaiGrade"></Tag>
            </dd>
          </div>
        </dl>
      </template>
    </section>

    <Button label="목록으로 돌아가기" icon="pi pi-arrow-left" @click="router.push('/')"></Button>
  </section>
</template>

<style scoped>
.detail-card {
  padding: 28px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
}

.detail-card h2 {
  margin: 0 0 22px;
  color: #0f172a;
}

.detail-card dl {
  padding: 18px;
  border-radius: 10px;
  background: #f1f5f9;
}

.detail-card dl div {
  display: grid;
  grid-template-columns: 120px 1fr;
  padding: 8px 0;
}

.detail-card dt {
  color: #64748b;
}

.detail-card dd {
  margin: 0;
  color: #0f172a;
  font-weight: 700;
}

.detail-card button {
  padding: 10px 14px;
  border: 0;
  border-radius: 7px;
  background: #334155;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.air-quality {
  margin: 20px 0;
  padding: 18px;
  border: 1px solid #d1fae5;
  border-radius: 12px;
  background: #f0fdf4;
}

.air-quality-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.air-quality-title h3 { margin: 0; color: #14532d; }
.air-quality-title span { color: #64748b; font-size: 11px; }
.detail-card .air-quality-list { margin: 10px 0 0; background: rgba(255, 255, 255, 0.7); }
.air-quality-list dd { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.air-state { display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 13px; }
.air-spinner { width: 24px; height: 24px; }
.air-notice { margin-bottom: 10px; }

.state-message {
  display: grid;
  justify-items: center;
  gap: 14px;
  color: #475569;
  text-align: center;
}

.loading-spinner {
  width: 36px;
  height: 36px;
}

.error-message {
  color: #dc2626;
}
</style>
