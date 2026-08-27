<script setup>
import { ref, watch, computed, watchEffect } from 'vue'
const searchQuery = ref('')
const selectedCityInfo = ref('')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const handleCard = (city) => {
  selectedCityInfo.value = city
  alert(`${city}이 선택되었습니다.`)
}
const showDetails = (name, status) => {
  window.alert(`${name}의 현재 날씨는 [${status}] 상태입니다.`)
}
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

watch(selectedCityInfo, (newValue) => {
  console.log(`🤖 [watch 감지] 상태 바 문구가 업데이트되었습니다 -> ${newValue}이 선택되었습니다.`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 검색합니다`,
  )
})
</script>

<template>
  <div class="title">
    <h2>과제 2: 날씨 (컴포지션)</h2>
  </div>
  <div class="search">
    <!--<input v-model="searchQuery" type="text" placeholder="검색할 도시 이름 입력" /> -->
    <!--한국어 user experience 개선-->
    <input
      type="text"
      :value="searchQuery"
      @input="(e) => (searchQuery = e.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>검색 중인 도시: {{ searchQuery }}</p>
  </div>
  <div class="cards">
    <h2>지역별 날씨 현황</h2>
    <div v-if="searchQuery === ''">
      <div v-for="weather in weatherList" :key="weather.id" @click="handleCard(weather.name)">
        <p>{{ weather.name }} ({{ weather.status }})</p>
        <p>현재 기온: {{ weather.temp }}ºC</p>
        <span v-if="weather.temp < 25">❄️ 선선함 (25도 미만)</span>
        <span v-else>🔥 더움 (25도 이상)</span>
        <button @click.stop="showDetails(weather.name, weather.status)">상세 보기</button>
      </div>
    </div>
    <div v-else-if="filteredWeatherList.length > 0">
      <div v-for="city in filteredWeatherList" :key="city.id">
        <p>{{ city.name }} ({{ city.status }})</p>
        <p>현재 기온: {{ city.temp }}ºC</p>
        <span v-if="city.temp < 25">❄️ 선선함 (25도 미만)</span>
        <span v-else>🔥 더움 (25도 이상)</span>
        <button @click.stop="showDetails(city.name, city.status)">상세 보기</button>
      </div>
    </div>
    <div v-else>
      <p>일치하는 도시가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.title,
.search,
.cards {
  width: min(100%, 720px);
  margin-inline: auto;
}

.title {
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.title h2 {
  margin: 0;
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
}

.search {
  margin-bottom: 32px;
}

.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #fff;
  color: #0f172a;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.search input::placeholder {
  color: #94a3b8;
}

.search p {
  margin: 10px 2px 0;
  color: #64748b;
  font-size: 14px;
}

.cards h2 {
  margin: 0 0 18px;
  color: #1e293b;
  font-size: 21px;
}

.cards > div {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
}

.cards > div > div {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.cards > div > div:hover {
  transform: translateY(-4px);
  border-color: #93c5fd;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  cursor: pointer;
}

.cards > div > p:only-child {
  grid-column: 1 / -1;
  margin: 0;
  padding: 28px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
  text-align: center;
}

.cards > div > div p {
  margin: 8px 0;
  color: #475569;
}

.cards > div > div p:first-child {
  margin-top: 0;
  color: #0f172a;
  font-size: 20px;
  font-weight: 700;
}

.cards span {
  display: inline-block;
  margin: 8px 0 16px;
  color: #334155;
  font-size: 14px;
}

.cards button {
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.cards button:hover {
  background-color: #1d4ed8;
}

.cards button:active {
  transform: scale(0.98);
}

@media (max-width: 520px) {
  .title h2 {
    font-size: 23px;
  }

  .cards > div {
    grid-template-columns: 1fr;
  }
}
</style>
