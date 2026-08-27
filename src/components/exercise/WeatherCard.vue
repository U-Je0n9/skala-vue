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
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
const { displayTemp, unitSymbol } = useTemperature(() => props.weather.temp)
</script>

<template>
  <Card class="weather-card" @click="emit('select-card', weather)">
    <template #title>
      <div class="card-header">
        <span>{{ weather.name }} ({{ weather.status }})</span>
        <div class="card-actions">
          <Button
            type="button"
            :icon="isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"
            :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
            :severity="isFavorite ? 'warn' : 'secondary'"
            size="small"
            text
            rounded
            @click.stop="emit('toggle-favorite', weather)"
          ></Button>
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

.card-actions {
  display: flex;
  align-items: center;
  gap: 4px;
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
