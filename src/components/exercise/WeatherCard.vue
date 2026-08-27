<script setup>
import { useTemperature } from '@/composables/useTemperature'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const { displayTemp, unitSymbol } = useTemperature(() => props.weather.temp)
</script>

<template>
  <Card class="weather-card" @click="emit('select-card', weather)">
    <template #title>
      <div class="card-header">
        <span>{{ weather.name }} ({{ weather.status }})</span>
        <Button
          type="button"
          label="상세보기"
          icon="pi pi-arrow-right"
          icon-pos="right"
          size="small"
          outlined
          @click.stop="emit('click-detail', weather)"
        ></Button>
      </div>
    </template>
    <template #content>
      <p>현재 기온: {{ displayTemp }}{{ unitSymbol }}</p>
      <Tag
        :severity="weather.temp < 25 ? 'info' : 'danger'"
        :value="weather.temp < 25 ? '❄️ 선선함' : '🔥 더움'"
      ></Tag>
    </template>
  </Card>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-header span {
  min-width: 0;
}

.weather-card p {
  margin: 0 0 12px;
  color: #475569;
  font-size: 14px;
}

@media (max-width: 480px) {
  .card-header {
    align-items: flex-start;
  }
}
</style>
