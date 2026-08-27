<script setup>
import { ref } from 'vue'
const handleCard = (city) => {
  alert(`${city}이 선택되었습니다.`)
}
const showDetails = (name, status) => {
  window.alert(`${name}의 현재 날씨는 [${status}] 상태입니다.`)
}
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const searchCity = ref('')
</script>

<template>
  <div class="title">
    <h2>과제 1: 날씨 (Mockup)</h2>
  </div>
  <div class="search">
    <input
      type="text"
      :value="searchCity"
      @input="(e) => (searchCity = e.target.value)"
      placehoder="검색할 도시 이름 입력"
    />
    <p>검색 중인 도시: {{ searchCity }}</p>
  </div>
  <div class="cards">
    <h2>지역별 날씨 현황</h2>
    <div v-for="weather in weatherList" :key="weather.id" @click="handleCard(weather.name)">
      <p>{{ weather.name }} ({{ weather.status }})</p>
      <p>현재 기온: {{ weather.temp }}ºC</p>
      <span v-if="weather.temp < 25">❄️ 선선함 (25도 미만)</span>
      <span v-else>🔥 더움 (25도 이상)</span>
      <button @click.stop="showDetails(weather.name, weather.status)">상세 보기</button>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin-bottom: 24px;
}

.title h2 {
  font-size: 28px;
  font-weight: 700;
}

.search {
  margin-bottom: 32px;
}

.search input {
  width: 280px;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}

.search input:focus {
  border-color: #666;
}

.search p {
  margin-top: 8px;
  font-size: 14px;
}

.cards h2 {
  margin-bottom: 16px;
}

.cards > div {
  width: 280px;
  padding: 20px;
  margin-bottom: 16px;

  border: 1px solid #ddd;
  border-radius: 12px;

  cursor: pointer;
  transition: 0.2s;
}

.cards > div:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cards p {
  margin: 8px 0;
}

.cards p:first-child {
  font-size: 20px;
  font-weight: 700;
}

.cards span {
  display: inline-block;
  margin: 8px 0 16px;
  font-size: 14px;
}

.cards button {
  display: block;
  padding: 8px 14px;

  border: none;
  border-radius: 6px;

  cursor: pointer;
}

.cards button:hover {
  opacity: 0.8;
}
</style>
