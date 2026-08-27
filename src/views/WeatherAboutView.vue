<template>
  <section class="about-card">
    <div class="about-intro">
      <span class="about-label">MY WEATHER SERVICE</span>
      <h2>오늘부터 일주일까지,<br />내가 궁금한 도시의 날씨를 한눈에</h2>
      <p>
        자주 확인하는 지역은 빠르게 살펴보고, 새로운 도시는 직접 검색해 추가할 수 있는
        맞춤형 날씨 서비스입니다.
      </p>
    </div>

    <div class="feature-grid">
      <article class="feature-item">
        <span class="feature-icon">🔍</span>
        <div>
          <h3>원하는 도시 검색</h3>
          <p>기본 5지역 외에도 국내 도시를 검색해 내 대시보드에 추가할 수 있습니다.</p>
        </div>
      </article>
      <article class="feature-item">
        <span class="feature-icon">⭐</span>
        <div>
          <h3>즐겨찾기와 브라우저 저장</h3>
          <p>자주 보는 도시는 상단에 고정되며, 새로고침 후에도 추가한 도시와 순서가 유지됩니다.</p>
        </div>
      </article>
      <article class="feature-item">
        <span class="feature-icon">🌡️</span>
        <div>
          <h3>현재 날씨 상세 정보</h3>
          <p>도시별 현재 기온과 날씨 상태는 물론 습도와 풍속까지 자세히 확인할 수 있습니다.</p>
        </div>
      </article>
      <article class="feature-item">
        <span class="feature-icon">📅</span>
        <div>
          <h3>최대 7일 주간 예보</h3>
          <p>최고·최저 기온, 강수확률, 일출·일몰 시간을 확인하고 미리 일정을 준비할 수 있습니다.</p>
        </div>
      </article>
      <article class="feature-item">
        <span class="feature-icon">🌅</span>
        <div>
          <h3>날씨와 시간에 맞춘 화면</h3>
          <p>낮과 밤, 비, 일출과 일몰에 따라 배경과 추천 문구가 자연스럽게 달라집니다.</p>
        </div>
      </article>
      <article class="feature-item">
        <span class="feature-icon">°C</span>
        <div>
          <h3>섭씨·화씨 단위 변경</h3>
          <p>한 번의 버튼 조작으로 현재 날씨와 주간 예보의 온도 단위를 함께 변경할 수 있습니다.</p>
        </div>
      </article>
    </div>

    <div class="about-message">
      <span>☂️</span>
      <p><strong>외출 전 잠깐 확인해 보세요.</strong> 오늘 필요한 준비를 날씨가 먼저 알려드립니다.</p>
    </div>

    <div class="about-actions">
      <RouterLink class="home-link" to="/">내 도시 날씨 보기</RouterLink>
      <RouterLink class="forecast-link" to="/forecast">주간 예보 확인하기</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.about-card { padding: 32px; border: 1px solid #dbe4ee; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07); }
.about-intro { padding-bottom: 26px; border-bottom: 1px solid #e2e8f0; }
.about-label { color: #0284c7; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; }
.about-intro h2 { margin: 10px 0 12px; color: #0f172a; font-size: 29px; line-height: 1.35; }
.about-intro p { max-width: 610px; margin: 0; color: #64748b; line-height: 1.75; }
.feature-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 26px 0; }
.feature-item { display: flex; gap: 13px; padding: 18px; border: 1px solid #e0f2fe; border-radius: 13px; background: linear-gradient(135deg, #f8fcff, #f0f9ff); }
.feature-icon { display: grid; flex: 0 0 38px; width: 38px; height: 38px; place-items: center; border-radius: 11px; background: #e0f2fe; color: #0369a1; font-size: 16px; font-weight: 800; }
.feature-item h3 { margin: 1px 0 6px; color: #1e293b; font-size: 15px; }
.feature-item p { margin: 0; color: #64748b; font-size: 13px; line-height: 1.65; }
.about-message { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-radius: 12px; background: #eff6ff; color: #1e3a8a; }
.about-message span { font-size: 24px; }
.about-message p { margin: 0; font-size: 14px; line-height: 1.6; }
.about-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 22px; }
.home-link, .forecast-link { display: block; padding: 12px; border-radius: 8px; font-weight: 700; text-align: center; text-decoration: none; }
.home-link, .forecast-link { background: #0284c7; color: #fff; }

@media (max-width: 620px) {
  .about-card { padding: 22px; }
  .about-intro h2 { font-size: 24px; }
  .feature-grid, .about-actions { grid-template-columns: 1fr; }
}
</style>
