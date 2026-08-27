<script setup>
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'

defineProps({
  selectedCity: {
    type: Object,
    required: true,
  },
  selectedDays: {
    type: Number,
    required: true,
  },
  cities: {
    type: Array,
    required: true,
  },
  dayOptions: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update-city', 'update-days'])
</script>

<template>
  <div class="forecast-filter">
    <div class="filter-field">
      <label for="forecast-city">도시</label>
      <Select
        input-id="forecast-city"
        :model-value="selectedCity"
        :options="cities"
        option-label="name"
        @update:model-value="emit('update-city', $event)"
      ></Select>
    </div>

    <div class="filter-field">
      <span>예보 기간</span>
      <SelectButton
        :model-value="selectedDays"
        :options="dayOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        @update:model-value="emit('update-days', $event)"
      ></SelectButton>
    </div>
  </div>
</template>

<style scoped>
.forecast-filter {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 4px;
}

.filter-field {
  display: grid;
  gap: 8px;
}

.filter-field label,
.filter-field span {
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.filter-field :deep(.p-select) {
  min-width: 150px;
}

@media (max-width: 560px) {
  .forecast-filter {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
