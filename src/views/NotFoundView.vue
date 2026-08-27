<template>
  <section class="not-found">
    <div class="symbol">☀️❓</div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않습니다.</p>
    <RouterLink to="/">날씨 대시보드로 이동</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: 64px 24px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.symbol {
  font-size: 46px;
}

.not-found h2 {
  color: #0f172a;
}

.not-found p {
  color: #64748b;
}

.not-found a {
  display: inline-block;
  margin-top: 14px;
  padding: 11px 16px;
  border-radius: 7px;
  background: #0284c7;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
</style>
