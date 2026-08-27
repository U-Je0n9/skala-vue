<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeather } from '@/composables/useWeather'

const router = useRouter()

const { weatherData: weather, isLoading, errorMessage, getWeather } = useWeather()
const { displayTemp, unitSymbol } = useTemperature(() => weather.value?.temp ?? 0)

onMounted(() => {
  getWeather()
})
</script>

<template>
  <section v-if="isLoading" class="detail-card state-message">
    날씨 데이터를 불러오는 중입니다...
  </section>

  <section v-else-if="errorMessage" class="detail-card state-message error-message">
    <p>{{ errorMessage }}</p>
    <button type="button" @click="router.push('/')">목록으로 돌아가기</button>
  </section>

  <section v-else-if="weather" class="detail-card">
    <h2>🌡️ {{ weather.name }} 상세 날씨</h2>
    <dl>
      <div><dt>날씨</dt><dd>{{ weather.status }}</dd></div>
      <div><dt>현재 기온</dt><dd>{{ displayTemp }}{{ unitSymbol }}</dd></div>
      <div><dt>습도</dt><dd>{{ weather.humidity }}%</dd></div>
      <div><dt>풍속</dt><dd>{{ weather.wind }}m/s</dd></div>
    </dl>
    <button type="button" @click="router.push('/')">목록으로 돌아가기</button>
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

.state-message {
  color: #475569;
  text-align: center;
}

.error-message {
  color: #dc2626;
}
</style>
