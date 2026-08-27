<script setup>
defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article class="weather-card" @click="emit('select-card', weather)">
    <div>
      <h3>{{ weather.name }} ({{ weather.status }})</h3>
      <p>현재 기온: {{ weather.temp }}°C</p>
      <span :class="weather.temp < 25 ? 'cool' : 'hot'">
        {{ weather.temp < 25 ? '❄️ 선선함' : '🔥 더움' }}
      </span>
    </div>
    <button type="button" @click.stop="emit('click-detail', weather)">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.weather-card:hover {
  transform: translateY(-2px);
  border-color: #7dd3fc;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.weather-card h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 17px;
}

.weather-card p {
  margin: 0 0 9px;
  color: #475569;
  font-size: 14px;
}

.weather-card span {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
}

.cool {
  background: #e0f2fe;
  color: #0369a1;
}

.hot {
  background: #fee2e2;
  color: #dc2626;
}

.weather-card button {
  flex-shrink: 0;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #fff;
  color: #334155;
  font-weight: 700;
  cursor: pointer;
}

.weather-card button:hover {
  border-color: #0284c7;
  color: #0284c7;
}

@media (max-width: 480px) {
  .weather-card {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
