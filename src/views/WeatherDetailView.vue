<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'

const route = useRoute()
const router = useRouter()

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.5 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 78, wind: 3.8 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
]

const weather = computed(() => weatherList.find((city) => city.id === route.params.id))
const { displayTemp, unitSymbol } = useTemperature(() => weather.value.temp)
</script>

<template>
  <section class="detail-card">
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
</style>
