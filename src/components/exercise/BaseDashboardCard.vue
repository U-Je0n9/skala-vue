<script setup>
import Panel from 'primevue/panel'

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Panel class="dashboard-card" :header="title">
    <slot></slot>
  </Panel>
</template>

<style scoped>
.dashboard-card {
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}
</style>
