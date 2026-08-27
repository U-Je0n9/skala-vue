<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle">
    <span>날씨 단위: {{ configStore.unitSymbol }}</span>
    <button type="button" @click="configStore.toggleUnit()">
      {{ configStore.unit === 'celsius' ? '화씨로 변경' : '섭씨로 변경' }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unit-toggle span {
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.unit-toggle button {
  padding: 8px 12px;
  border: 0;
  border-radius: 7px;
  background: #334155;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.unit-toggle button:hover {
  background: #0f172a;
}
</style>
