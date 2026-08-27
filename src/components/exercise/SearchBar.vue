<script setup>
import { ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'

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

const emit = defineEmits(['update-query'])
const suggestions = ref([])

const searchCities = (event) => {
  const query = event.query.trim().toLowerCase()

  suggestions.value = props.cityNames.filter((cityName) => {
    return cityName.toLowerCase().includes(query)
  })
}
</script>

<template>
  <div class="search-bar">
    <label for="weather-search">검색할 도시 이름 입력</label>
    <AutoComplete
      input-id="weather-search"
      :model-value="searchQuery"
      :suggestions="suggestions"
      placeholder="예: 서울"
      dropdown
      complete-on-focus
      @complete="searchCities"
      @update:model-value="emit('update-query', $event)"
    ></AutoComplete>
    <p>검색 중인 도시: {{ searchQuery || '없음' }}</p>
  </div>
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

.search-bar :deep(.p-autocomplete),
.search-bar :deep(.p-autocomplete-input) {
  width: 100%;
}

.search-bar p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
</style>
