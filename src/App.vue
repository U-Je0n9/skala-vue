<script setup>
import WeatherHeader from '@/components/exercise/WeatherHeader.vue'
import { useWeatherTheme } from '@/composables/useWeatherTheme'

const { todayForecast, weatherMood, recommendation } = useWeatherTheme()
</script>

<template>
  <div class="weather-page" :class="`weather-page--${weatherMood}`">
    <div class="app-shell">
      <WeatherHeader
        :recommendation="recommendation"
        :today-forecast="todayForecast"
      ></WeatherHeader>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>
.weather-page {
  min-height: 100vh;
  padding: 1px 0 44px;
  transition: background 0.8s ease;
}

.weather-page--day { background: linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 42%, #ffffff 100%); }
.weather-page--rainy { background: linear-gradient(180deg, #64748b 0%, #cbd5e1 44%, #f8fafc 100%); }
.weather-page--night { background: linear-gradient(180deg, #0f172a 0%, #312e81 42%, #e2e8f0 100%); }
.weather-page--sunset { background: linear-gradient(180deg, #f97316 0%, #f9a8d4 42%, #fff7ed 100%); }
.weather-page--sunrise { background: linear-gradient(180deg, #fb7185 0%, #fdba74 42%, #fff7ed 100%); }

.app-shell {
  width: min(100% - 32px, 760px);
  box-sizing: border-box;
  margin: 36px auto;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(14px);
}

@media (max-width: 520px) {
  .app-shell {
    margin-block: 20px;
    padding: 20px;
    border-radius: 18px;
  }
}
</style>
