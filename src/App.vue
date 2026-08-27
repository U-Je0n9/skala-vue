<script setup>
import UnitToggle from '@/components/exercise/UnitToggle.vue'
</script>

<template>
  <div class="app-shell">
    <header>
      <h1>🌤️ 종합실습 5: 스토어적용</h1>
      <nav>
        <div class="nav-links">
          <RouterLink to="/">🌤️ 날씨 대시보드</RouterLink>
          <RouterLink to="/about">📘 서비스 소개</RouterLink>
        </div>

        <UnitToggle></UnitToggle>
      </nav>
    </header>

    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.app-shell {
  width: min(100% - 32px, 760px);
  margin: 36px auto;
}

header {
  margin-bottom: 22px;
}

header h1 {
  margin: 0 0 20px;
  color: #0f172a;
  font-size: 27px;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.nav-links {
  display: flex;
  gap: 8px;
}

nav a {
  padding: 8px 13px;
  border-radius: 7px;
  color: #64748b;
  font-weight: 700;
  text-decoration: none;
}

nav a:hover,
nav a.router-link-exact-active {
  background: #e0f2fe;
  color: #0284c7;
}

@media (max-width: 520px) {
  .app-shell {
    margin-block: 20px;
  }

  header h1 {
    font-size: 22px;
  }

  nav {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}
</style>
