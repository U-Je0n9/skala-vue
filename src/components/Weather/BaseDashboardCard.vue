<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <main class="dashboard">
    <h1>{{ title }}</h1>

    <section class="dashboard-section search-section">
      <slot name="search" />
    </section>

    <section class="dashboard-section weather-section">
      <h2>🌁 지역별 날씨 현황</h2>
      <slot name="weather" />
    </section>

    <footer class="status-section">
      <slot name="status" />
    </footer>
  </main>
</template>

<style scoped>
.dashboard {
  width: min(100%, 720px);
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #f8fafc;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
}

.dashboard h1 {
  margin: 0;
  padding: 22px 24px;
  border-bottom: 1px solid #dbe4ee;
  background: #fff;
  color: #0f172a;
  font-size: 24px;
}

.dashboard-section {
  margin: 18px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
}

.weather-section h2 {
  margin: 0 0 16px;
  color: #1e293b;
  font-size: 19px;
}

.status-section {
  margin-top: 20px;
}

@media (max-width: 520px) {
  .dashboard {
    border-radius: 12px;
  }

  .dashboard h1 {
    padding: 18px;
    font-size: 20px;
  }

  .dashboard-section {
    margin: 12px;
    padding: 16px;
  }
}
</style>
