<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <label for="weather-search">검색할 도시 이름 입력</label>
    <input
      id="weather-search"
      type="search"
      :value="searchQuery"
      placeholder="예: 서울"
      @input="emit('update-query', $event.target.value)"
    />
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

.search-bar input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  outline: none;
}

.search-bar input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.14);
}

.search-bar p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
</style>
