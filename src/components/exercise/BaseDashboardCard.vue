<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h2>{{ title }}</h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-card {
  padding: 22px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.dashboard-card h2 {
  margin: 0 0 18px;
  color: #1e293b;
  font-size: 19px;
}
</style>
