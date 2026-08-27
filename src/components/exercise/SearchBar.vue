<script setup>
import { ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  cityNames: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update-query', 'add-city'])
const suggestions = ref([])

const searchCities = (event) => {
  const query = event.query.trim().toLowerCase()

  suggestions.value = props.cityNames.filter((cityName) => {
    return cityName.toLowerCase().includes(query)
  })
}
</script>

<template>
  <form class="search-bar" @submit.prevent="emit('add-city', searchQuery)">
    <label for="weather-search">검색할 도시 이름 입력</label>
    <div class="search-input-row">
      <AutoComplete
        input-id="weather-search"
        :model-value="searchQuery"
        :suggestions="suggestions"
        placeholder="예: 대전"
        dropdown
        complete-on-focus
        @complete="searchCities"
        @update:model-value="emit('update-query', $event)"
      ></AutoComplete>
      <Button type="submit" label="도시 추가" icon="pi pi-plus"></Button>
    </div>
    <p>검색 중인 도시: {{ searchQuery || '없음' }}</p>
  </form>
</template>

<style scoped>
.search-bar {
  display: grid;
  gap: 8px;
}

.search-bar label {
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.search-input-row {
  display: flex;
  gap: 8px;
}

.search-bar :deep(.p-autocomplete),
.search-bar :deep(.p-autocomplete-input) {
  width: 100%;
}

.search-input-row :deep(.p-autocomplete) {
  flex: 1;
}

.search-bar p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 520px) {
  .search-input-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
