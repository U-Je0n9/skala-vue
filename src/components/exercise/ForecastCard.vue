<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  forecast: {
    type: Object,
    required: true,
  },
})

const { displayTemp: maxTemp, unitSymbol } = useTemperature(() => props.forecast.maxTemp)
const { displayTemp: minTemp } = useTemperature(() => props.forecast.minTemp)

const weatherVisual = computed(() => {
  const code = props.forecast.weatherCode

  if (code === 0) return { icon: '☀️', theme: 'sunny' }
  if (code <= 3) return { icon: '⛅', theme: 'cloudy' }
  if (code === 45 || code === 48) return { icon: '🌫️', theme: 'foggy' }
  if (code >= 51 && code <= 67) return { icon: '🌧️', theme: 'rainy' }
  if (code >= 71 && code <= 77) return { icon: '🌨️', theme: 'snowy' }
  if (code >= 80 && code <= 82) return { icon: '🌦️', theme: 'rainy' }
  if (code >= 95) return { icon: '⛈️', theme: 'stormy' }

  return { icon: '🌤️', theme: 'cloudy' }
})

const rainVisual = computed(() => {
  const probability = props.forecast.precipitationProbability ?? 0

  if (probability >= 80) {
    return { background: '#1d4ed8', color: '#ffffff', border: '#1d4ed8' }
  }

  if (probability >= 60) {
    return { background: '#93c5fd', color: '#1e3a8a', border: '#60a5fa' }
  }

  if (probability >= 40) {
    return { background: '#dbeafe', color: '#1e40af', border: '#bfdbfe' }
  }

  if (probability >= 20) {
    return { background: '#eff6ff', color: '#1d4ed8', border: '#dbeafe' }
  }

  return { background: '#ffffff', color: '#475569', border: '#dbe4ee' }
})

const rainColor = computed(() => {
  const probability = props.forecast.precipitationProbability ?? 0

  if (probability >= 80) return '#1d4ed8'
  if (probability >= 60) return '#3b82f6'
  if (probability >= 40) return '#60a5fa'
  if (probability >= 20) return '#93c5fd'
  return '#dbeafe'
})

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T00:00:00`))
}
</script>

<template>
  <Card class="forecast-card" :class="`forecast-card--${weatherVisual.theme}`">
    <template #title>
      <div class="card-heading">
        <span class="weather-icon" aria-hidden="true">{{ weatherVisual.icon }}</span>
        <span>{{ formatDate(forecast.date) }}</span>
      </div>
    </template>
    <template #subtitle>
      <span class="weather-status">{{ forecast.status }}</span>
    </template>
    <template #content>
      <div class="temperature">
        <span><small>최고</small>{{ maxTemp }}{{ unitSymbol }}</span>
        <span><small>최저</small>{{ minTemp }}{{ unitSymbol }}</span>
      </div>
      <div class="rain-info">
        <Tag
          class="rain-tag"
          :style="{
            background: rainVisual.background,
            color: rainVisual.color,
            borderColor: rainVisual.border,
          }"
          :value="`💧 강수확률 ${forecast.precipitationProbability ?? 0}%`"
        ></Tag>
        <ProgressBar
          class="rain-progress"
          :style="{ '--rain-color': rainColor }"
          :value="forecast.precipitationProbability ?? 0"
          :show-value="false"
        ></ProgressBar>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.forecast-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.22);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.forecast-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12);
}

.forecast-card--sunny {
  background: linear-gradient(145deg, #fffdf4 0%, #fff7d6 100%);
}

.forecast-card--cloudy,
.forecast-card--foggy {
  background: linear-gradient(145deg, #f8fafc 0%, #e9f1f8 100%);
}

.forecast-card--rainy {
  background: linear-gradient(145deg, #f5faff 0%, #dceeff 100%);
}

.forecast-card--snowy {
  background: linear-gradient(145deg, #fbfdff 0%, #e8f7ff 100%);
}

.forecast-card--stormy {
  background: linear-gradient(145deg, #f4f1ff 0%, #ddd6fe 100%);
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-icon {
  font-size: 32px;
  filter: drop-shadow(0 4px 5px rgba(15, 23, 42, 0.12));
}

.weather-status {
  color: #475569;
  font-weight: 600;
}

.temperature {
  display: flex;
  gap: 20px;
  margin: 4px 0 18px;
}

.temperature span {
  color: #0f172a;
  font-size: 19px;
  font-weight: 800;
}

.temperature small {
  display: block;
  margin-bottom: 2px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.rain-info {
  display: grid;
  gap: 9px;
}

.rain-progress {
  height: 6px;
}

.rain-progress :deep(.p-progressbar-value) {
  background: var(--rain-color);
}

.rain-tag {
  width: fit-content;
  border: 1px solid;
}
</style>
