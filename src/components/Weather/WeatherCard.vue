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
  <article
    class="weather-card"
    tabindex="0"
    @click="emit('select-card', weather)"
    @keydown.enter="emit('select-card', weather)"
    @keydown.space.prevent="emit('select-card', weather)"
  >
    <div class="weather-info">
      <h3>{{ weather.name }} ({{ weather.status }})</h3>
      <p>현재 기온: {{ weather.temp }}°C</p>
      <span :class="weather.temp < 25 ? 'cool' : 'hot'">
        {{ weather.temp < 25 ? '❄️ 선선함 (25도 미만)' : '🔥 더움 (25도 이상)' }}
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
  gap: 20px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.weather-card:hover,
.weather-card:focus-visible {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
  outline: none;
}

.weather-info h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 17px;
}

.weather-info p {
  margin: 0 0 8px;
  color: #475569;
  font-size: 14px;
}

.weather-info span {
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
  font-weight: 600;
  cursor: pointer;
}

.weather-card button:hover {
  border-color: #2563eb;
  color: #2563eb;
}

@media (max-width: 480px) {
  .weather-card {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
