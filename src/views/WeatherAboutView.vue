<template>
  <section class="about-card">
    <h2>📘 서비스 소개</h2>
    <p>Vue Router를 활용해 만든 지역별 날씨 확인 서비스입니다.</p>

    <ul>
      <li><strong>컴포넌트 기반:</strong> 검색창과 날씨 카드를 독립적으로 구성했습니다.</li>
      <li><strong>동적 라우팅:</strong> 도시별 상세 정보를 별도의 URL에서 확인할 수 있습니다.</li>
      <li><strong>반응형 검색:</strong> 입력한 도시 이름에 따라 목록이 바로 변경됩니다.</li>
    </ul>

    <RouterLink class="home-link" to="/">대시보드로 이동</RouterLink>
  </section>
</template>

<style scoped>
.about-card {
  padding: 28px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
}

.about-card h2 {
  margin-top: 0;
  color: #0f172a;
}

.about-card p,
.about-card li {
  color: #475569;
  line-height: 1.8;
}

.home-link {
  display: block;
  margin-top: 24px;
  padding: 11px;
  border-radius: 7px;
  background: #0284c7;
  color: #fff;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}
</style>
