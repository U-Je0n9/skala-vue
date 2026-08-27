<script setup>
import { useConfigStore } from '@/stores/configStore'
import Button from 'primevue/button'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle">
    <span>날씨 단위: {{ configStore.unitSymbol }}</span>
    <Button
      type="button"
      size="small"
      severity="secondary"
      :label="configStore.unit === 'celsius' ? '화씨로 변경' : '섭씨로 변경'"
      @click="configStore.toggleUnit()"
    ></Button>
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

</style>
