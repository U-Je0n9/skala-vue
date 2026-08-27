<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const updateSearchQuery = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search">
    <label for="city-search">도시 검색</label>
    <input
      id="city-search"
      type="search"
      :value="searchQuery"
      placeholder="검색할 도시 이름 입력"
      @input="updateSearchQuery"
    />
    <p>검색 중인 도시: {{ searchQuery }}</p>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search label {
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.search input::placeholder {
  color: #94a3b8;
}

.search p {
  min-height: 20px;
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
</style>
