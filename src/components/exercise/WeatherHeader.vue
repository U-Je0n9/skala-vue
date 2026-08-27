<script setup>
import UnitToggle from '@/components/exercise/UnitToggle.vue'

defineProps({
  recommendation: { type: String, required: true },
  todayForecast: { type: Object, default: null },
})

const formatTime = (dateTime) => dateTime?.slice(11, 16) ?? '--:--'
</script>

<template>
  <header>
    <div class="weather-summary">
      <p class="weather-recommendation">{{ recommendation }}</p>
      <p v-if="todayForecast" class="today-sun-times">
        <span>🌅 오늘 일출 {{ formatTime(todayForecast.sunrise) }}</span>
        <span>🌇 오늘 일몰 {{ formatTime(todayForecast.sunset) }}</span>
      </p>
    </div>
    <div class="service-title">
      <h1>🌤️ 오늘의 하늘</h1>
      <p>내 도시의 날씨와 대기질을 한눈에 확인하세요.</p>
    </div>
    <nav>
      <div class="nav-links">
        <RouterLink to="/">🌤️ 날씨 대시보드</RouterLink>
        <RouterLink to="/forecast">📅 주간 예보</RouterLink>
        <RouterLink to="/about">📘 서비스 소개</RouterLink>
      </div>
      <UnitToggle></UnitToggle>
    </nav>
  </header>
</template>

<style scoped>
header { margin-bottom: 22px; }
h1 { margin: 0; color: #0f172a; font-size: 27px; }
.service-title { margin-bottom: 20px; }
.service-title p { margin: 6px 0 0 42px; color: #64748b; font-size: 13px; }
.weather-summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 12px; }
.weather-recommendation { margin: 0; color: #0369a1; font-size: 14px; font-weight: 700; }
.today-sun-times { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px 14px; margin: 0 0 0 auto; color: #64748b; font-size: 11px; font-weight: 600; }
nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
.nav-links { display: flex; gap: 8px; }
nav a { padding: 8px 13px; border-radius: 7px; color: #64748b; font-weight: 700; text-decoration: none; }
nav a:hover, nav a.router-link-exact-active { background: #e0f2fe; color: #0284c7; }

@media (max-width: 520px) {
  h1 { font-size: 22px; }
  .service-title p { margin-left: 0; }
  .weather-summary { align-items: flex-start; flex-direction: column; gap: 6px; }
  .today-sun-times { align-self: flex-end; }
  nav { align-items: stretch; flex-direction: column; gap: 12px; }
  .nav-links { flex-wrap: wrap; }
}
</style>
