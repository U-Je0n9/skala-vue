<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <p class="status-bar">
    {{ message || '카드를 클릭하거나 검색해 보세요.' }}
  </p>
</template>

<style scoped>
.status-bar {
  margin: 0;
  padding: 16px 20px;
  background: #dcfce7;
  color: #15803d;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}
</style>
