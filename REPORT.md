# Vue 날씨 프로젝트 실습 보고서

## 1. 프로젝트 개요

이 프로젝트는 하나의 날씨 목업 화면에서 시작해 Vue 3의 주요 기능을 단계적으로 적용해 본 실습 프로젝트입니다. 처음에는 한 파일 안에서 임시 날씨 데이터를 출력했지만, 이후 Composition API, 컴포넌트 통신, Vue Router, Pinia와 composable을 차례대로 적용하며 실제 애플리케이션에 가까운 구조로 확장했습니다.

실습 과정은 다음과 같습니다.

```text
Day 1: 날씨 목업
  ↓
Day 2: Composition API와 검색 기능
  ↓
Day 3: 컴포넌트 분리와 props/emits/slot
  ↓
Day 4: Vue Router와 여러 페이지 구성
  ↓
Day 5: Pinia 전역 상태와 composable
  ↓
Day 6: OpenWeather API 연동
  ↓
Day 7: 대표 5지역 확장과 PrimeVue 적용
```

Day 1부터 Day 5까지는 다음과 같은 Mock Data를 사용했고, Day 6부터 실제 OpenWeather API 데이터로 교체했습니다.

```js
[
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]
```

---

## 2. Day 1 - 날씨 목업 구현

### 2.1 구현 내용

첫 단계에서는 `WeatherMockup1.vue` 한 파일 안에 데이터, 화면, 이벤트, CSS를 모두 작성했습니다.

- `ref`로 날씨 목록과 검색어 상태 관리
- `v-for`로 도시별 날씨 카드 반복 출력
- `v-if`, `v-else`로 기온에 따른 상태 표시
- 카드 클릭과 상세 보기 버튼 이벤트 처리
- 검색창에 입력한 문자를 화면에 출력
- `<style scoped>`로 목업 디자인 작성

```js
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
```

이 단계에서는 먼저 화면을 빠르게 완성하고, Vue의 기본 디렉티브가 실제 DOM에 어떻게 적용되는지 확인하는 데 집중했습니다.

### 2.2 주의했던 점

`v-for`를 사용할 때 배열의 index가 아닌 고유한 도시 ID를 `key`로 지정했습니다.

```html
<div v-for="weather in weatherList" :key="weather.id">
```

고유한 `key`가 있어야 데이터의 순서가 변경되거나 항목이 추가·삭제될 때 Vue가 각 DOM 요소를 안정적으로 구분할 수 있습니다.

### 2.3 트러블슈팅

#### 이벤트 버블링

카드 전체와 카드 안의 상세 보기 버튼에 각각 클릭 이벤트가 있었습니다. 버튼을 클릭했을 때 부모 카드의 클릭 이벤트까지 함께 실행되는 문제가 발생할 수 있었습니다.

```html
<button @click.stop="showDetails(weather.name, weather.status)">
  상세 보기
</button>
```

`.stop` 이벤트 수식어를 사용해 버튼 클릭 이벤트가 부모 요소로 전파되지 않도록 처리했습니다.

#### 검색창 placeholder 오타

`placeholder`를 `placehoder`로 작성해 안내 문구가 표시되지 않는 문제가 있었습니다. HTML 속성명은 빌드 오류로 잡히지 않을 수 있기 때문에 화면에서 직접 확인해야 한다는 점을 배웠습니다.

#### 온도 기호

처음에는 `ºC`를 사용했지만, 정확한 온도 기호는 `°C` 또는 `℃`라는 점을 확인했습니다.

---

## 3. Day 2 - Composition API와 검색 기능

### 3.1 구현 내용

두 번째 단계에서는 기존 목업에 `computed`, `watch`, `watchEffect`를 추가했습니다.

```js
const searchQuery = ref('')
const selectedCityInfo = ref('')

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) =>
    city.name.includes(searchQuery.value),
  )
})
```

- `ref`: 검색어, 선택한 도시, 날씨 목록처럼 직접 변경되는 상태
- `computed`: 검색어를 기준으로 계산되는 날씨 목록
- `watch`: 선택한 도시가 변경됐을 때 실행되는 작업
- `watchEffect`: 검색어처럼 내부에서 참조한 반응형 값이 변경될 때 자동 실행되는 작업

검색어를 입력하면 `filteredWeatherList`가 자동으로 다시 계산되고, 결과가 없으면 안내 문구가 표시되도록 구성했습니다.

### 3.2 주의했던 점

`computed`는 원본 데이터를 직접 수정하는 용도가 아니라 기존 상태에서 새로운 값을 계산하는 용도로 사용했습니다. 따라서 `weatherList`는 유지하면서 별도의 `filteredWeatherList`를 만들었습니다.

또한 검색어 앞뒤의 공백 때문에 검색이 실패하지 않도록 이후 단계에서는 `trim()`을 적용했습니다.

```js
city.name.includes(searchQuery.value.trim())
```

### 3.3 트러블슈팅

#### `e.target`과 `e.target.value`의 차이

검색 이벤트에서 다음처럼 작성한 적이 있었습니다.

```html
@input="(e) => (searchQuery = e.target)"
```

이 코드는 문자열이 아니라 `<input>` DOM 요소 전체를 `searchQuery`에 저장합니다. 그 결과 `includes()` 검색이 정상적으로 동작하지 않았습니다.

```html
@input="(e) => (searchQuery = e.target.value)"
```

입력 요소의 실제 문자열은 `event.target.value`로 가져와야 한다는 점을 확인했습니다.

#### `selectedCityInfo`의 watcher가 실행되지 않음

처음에는 `selectedCityInfo`와 watcher만 만들고 값을 변경하는 코드를 넣지 않았습니다. 반응형 변수가 선언되어 있어도 값이 바뀌지 않으면 watcher는 실행되지 않습니다.

```js
const handleCard = (city) => {
  selectedCityInfo.value = city
}
```

카드 클릭 함수에서 `.value`를 변경하도록 연결한 뒤 watcher가 정상적으로 실행됐습니다.

#### 상세 보기 버튼이 작동하지 않음

템플릿에서 `showDetails()`를 호출하면서 `<script setup>`에 함수를 선언하지 않아 실행 중 오류가 발생한 적이 있었습니다. Vue 템플릿에서 사용하는 함수와 상태는 반드시 같은 컴포넌트의 script 영역에 존재해야 합니다.

#### 중첩된 카드 CSS 선택자

조건부 렌더링을 위한 바깥쪽 `<div>`와 실제 카드 `<div>`가 중첩되면서 `.cards > div` 스타일이 카드가 아니라 목록 wrapper에 적용됐습니다.

```css
.cards > div > div {
  /* 실제 카드 스타일 */
}
```

템플릿의 DOM 계층을 확인한 뒤 실제 카드 깊이에 맞게 선택자를 수정했습니다.

---

## 4. Day 3 - 컴포넌트 분리

### 4.1 구현 내용

한 파일에 모여 있던 기능을 역할에 따라 분리했습니다.

```text
WeatherParent.vue
├── BaseDashboardCard.vue
├── SearchBar.vue
├── WeatherCard.vue
└── WeatherStatusBar.vue
```

- `WeatherParent`: 모든 반응형 데이터와 이벤트 처리
- `BaseDashboardCard`: 공통 레이아웃과 slot 제공
- `SearchBar`: 검색어를 props로 받고 변경된 입력값을 emits로 전달
- `WeatherCard`: 날씨 데이터를 props로 받고 카드 선택과 상세 보기 이벤트 전달
- `WeatherStatusBar`: 선택 상태 안내 문구 출력

### 4.2 props와 emits 데이터 흐름

부모에서 자식으로 전달되는 데이터에는 props를 사용했습니다.

```html
<SearchBar :search-query="searchQuery"></SearchBar>
<WeatherCard :weather="weather"></WeatherCard>
```

자식에서 부모로 전달되는 사용자 동작에는 emits를 사용했습니다.

```js
const emit = defineEmits(['update-query'])
emit('update-query', event.target.value)
```

```html
<SearchBar @update-query="searchQuery = $event"></SearchBar>
```

이 과정을 통해 Vue의 데이터 흐름은 기본적으로 부모에서 자식으로 내려가고, 자식은 이벤트를 통해 부모에게 변경을 요청한다는 점을 배웠습니다.

### 4.3 slot 사용

공통 카드 내부에 서로 다른 검색창이나 날씨 목록을 넣기 위해 기본 slot을 사용했습니다.

```html
<section class="dashboard-card">
  <h2>{{ title }}</h2>
  <slot></slot>
</section>
```

부모에서는 다음과 같이 내용을 전달했습니다.

```html
<BaseDashboardCard title="도시 검색">
  <SearchBar></SearchBar>
</BaseDashboardCard>
```

slot에 전달된 요소는 화면상으로는 `BaseDashboardCard` 안에 배치되지만, 데이터와 이벤트는 작성된 부모 컴포넌트의 scope를 기준으로 처리된다는 점을 주의했습니다.

### 4.4 트러블슈팅

#### 이벤트 이름 불일치

자식에서는 `updateQuery`를 emit하고 부모에서는 `update-query`를 듣는 등 이름이 일치하지 않으면 이벤트가 전달되지 않습니다. 실습에서는 이벤트 이름을 kebab-case인 `update-query`, `select-card`, `click-detail`로 통일했습니다.

#### `<script setup>` 중복

`WeatherCard.vue`를 작성하는 과정에서 기존 미완성 코드 아래에 새로운 `<script setup>`과 `<template>`이 추가되어 한 파일에 script와 template이 두 개씩 존재하는 문제가 있었습니다.

Vue SFC에는 하나의 `<script setup>`과 하나의 `<template>`만 둘 수 있기 때문에 중복된 미완성 블록을 제거하고 하나의 컴포넌트로 합쳤습니다.

#### 자식 컴포넌트에서 부모 상태 직접 변경 금지

`SearchBar`가 전달받은 `searchQuery` props를 직접 변경하지 않도록 했습니다. props는 읽기 전용이므로 입력값을 `update-query` 이벤트 payload로 전달하고 실제 상태 변경은 부모에서 처리했습니다.

---

## 5. Day 4 - Vue Router 적용

### 5.1 구현 내용

한 화면에서 alert로 상세 정보를 보여주던 방식을 여러 페이지로 확장했습니다.

```text
/
└── WeatherHomeView.vue

/about
└── WeatherAboutView.vue

/weather/:id
└── WeatherDetailView.vue

일치하지 않는 주소
└── NotFoundView.vue
```

`App.vue`에는 공통 내비게이션과 `<RouterView>`를 배치했습니다.

```html
<RouterLink to="/">날씨 대시보드</RouterLink>
<RouterLink to="/about">서비스 소개</RouterLink>
<RouterView></RouterView>
```

### 5.2 프로그래매틱 내비게이션

기존에는 상세 보기 버튼을 누르면 `window.alert()`가 실행됐습니다. Router 단계에서는 부모 화면에서 카드의 `click-detail` 이벤트를 받아 상세 주소로 이동하도록 변경했습니다.

```js
const router = useRouter()

const moveToDetail = (city) => {
  router.push(`/weather/${city.id}`)
}
```

상세 화면에서는 `useRoute()`로 URL의 동적 파라미터를 읽었습니다.

```js
const route = useRoute()

const weather = computed(() => {
  return weatherList.find((city) => city.id === route.params.id)
})
```

### 5.3 Lazy Loading

각 화면을 동적 import로 불러오도록 설정했습니다.

```js
component: () => import('../views/WeatherHomeView.vue')
```

빌드 결과에서도 각 view가 별도의 JavaScript와 CSS 파일로 분리되는 것을 확인했습니다.

### 5.4 라우트 가드와 Catch-all Route

존재하지 않는 도시 ID로 상세 화면에 접근하면 `weather`가 `undefined`가 되고 템플릿에서 속성을 읽을 때 오류가 발생할 수 있습니다. 이를 방지하기 위해 상세 라우트에 `beforeEnter` 가드를 적용했습니다.

```js
beforeEnter: (to) => {
  if (!validCityIds.includes(to.params.id)) {
    return {
      name: 'not-found',
      params: { pathMatch: ['weather', to.params.id] },
    }
  }
}
```

정의되지 않은 모든 주소는 Catch-all Route가 처리합니다.

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
}
```

### 5.5 주의했던 점

- 고정 경로보다 Catch-all Route를 항상 마지막에 배치했습니다.
- `useRouter()`는 이동할 때, `useRoute()`는 현재 주소 정보를 읽을 때 사용했습니다.
- 상세 화면이 직접 새로고침되어도 동작하도록 URL의 ID만으로 데이터를 다시 찾게 했습니다.
- 기존 실습 파일은 삭제하지 않고 `components/exercise`와 새로운 views를 별도로 만들었습니다.

---

## 6. Day 5 - Pinia 날씨 단위 Store

### 6.1 구현 내용

날씨 카드와 상세 화면에서 공통으로 사용하는 섭씨·화씨 단위를 Pinia store로 관리했습니다.

```js
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
```

Pinia 요소의 역할은 다음과 같습니다.

- state `unit`: 현재 선택한 날씨 단위
- getter `unitSymbol`: 현재 상태에 맞는 `℃`, `℉` 기호
- action `toggleUnit`: `celsius`와 `fahrenheit` 상태 전환

`UnitToggle.vue`는 버튼 클릭 시 `configStore.toggleUnit()`을 호출합니다.

```html
<button type="button" @click="configStore.toggleUnit()">
  {{ configStore.unit === 'celsius' ? '화씨로 변경' : '섭씨로 변경' }}
</button>
```

### 6.2 트러블슈팅

#### Store 함수명 오타

처음에는 store export 이름을 `useCongigStore`로 작성해 import 이름과 일치하지 않았습니다. 이를 `useConfigStore`로 수정했습니다.

#### 화씨 문자열 오타

`fahrenheit`를 `fahrenhit`로 작성해 단위 조건이 일치하지 않는 문제가 있었습니다. 상태값은 여러 컴포넌트의 조건문에서 사용되므로 문자열을 동일하게 유지해야 합니다.

#### Store 생성 함수 호출 누락

```js
const configStore = useConfigStore
```

위 코드는 store 인스턴스가 아니라 함수 자체를 변수에 저장합니다. 다음처럼 반드시 호출해야 합니다.

```js
const configStore = useConfigStore()
```

---

## 7. Day 5 확장 - 온도 변환 composable

### 7.1 composable이 필요했던 이유

처음에는 `WeatherCard.vue` 안에 화씨 변환용 `displayTemp` computed를 작성했습니다.

```js
const displayTemp = computed(() => {
  const rawTemp = props.weather.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})
```

하지만 같은 변환 로직이 `WeatherDetailView.vue`에도 필요했습니다. 두 파일에 같은 코드를 복사하면 변환 방식이 바뀔 때 두 곳을 모두 수정해야 하므로 composable로 분리했습니다.

### 7.2 `useTemperature` 구현

```js
export const useTemperature = (temperatureSource) => {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const rawTemp = toValue(temperatureSource)

    if (configStore.unit === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }

    return rawTemp
  })

  const unitSymbol = computed(() => configStore.unitSymbol)

  return { displayTemp, unitSymbol }
}
```

컴포넌트에서는 온도값을 getter 형태로 전달합니다.

```js
const { displayTemp, unitSymbol } = useTemperature(
  () => props.weather.temp,
)
```

상세 화면에서도 같은 composable을 사용합니다.

```js
const { displayTemp, unitSymbol } = useTemperature(
  () => weather.value.temp,
)
```

### 7.3 `toValue()`를 사용한 이유

composable이 일반 숫자뿐 아니라 ref나 getter도 받을 수 있도록 `toValue()`를 사용했습니다. getter를 전달하면 props 또는 computed가 변경되었을 때 최신 온도를 다시 읽을 수 있습니다.

### 7.4 주의했던 점

원본 Mock Data의 `temp`는 항상 섭씨로 유지했습니다. 화씨로 변경할 때 원본 데이터 자체를 덮어쓰면 토글할 때마다 변환 오차가 누적될 수 있습니다.

```text
원본 데이터: 항상 섭씨
표시 데이터: computed에서 현재 단위에 맞게 계산
```

또한 `선선함`, `더움` 판정은 원본 섭씨 온도를 기준으로 유지했습니다. 표시 단위가 화씨로 바뀌더라도 기준 자체가 달라지지 않도록 하기 위해서입니다.

---

## 8. Day 6 - OpenWeather API 연동

### 8.1 구현 목표

이전 단계까지는 직접 작성한 Mock Data를 사용했습니다. 이번 단계에서는 기존 컴포넌트와 검색 구조를 최대한 유지하면서 고정된 위도와 경도의 실제 날씨 데이터를 OpenWeather API로 받아오도록 확장했습니다.

사용한 요청 조건은 다음과 같습니다.

- 위도: `37.4058453`
- 경도: `127.0998294`
- 단위: `metric`
- 응답 언어: `kr`

API 요청은 Axios를 사용했습니다.

```js
export const fetchWeather = async () => {
  const response = await axios.get(WEATHER_URL)
  return normalizeWeather(response.data)
}
```

### 8.2 파일 역할 분리

API 코드를 모두 `WeatherHomeView.vue`에 넣을 수도 있지만, 상세 화면에서도 같은 요청이 필요하기 때문에 다음과 같이 역할을 나눴습니다.

```text
api/weatherApi.js
└── 실제 Axios 요청과 응답 데이터 변환

composables/useWeather.js
└── weatherData, isLoading, errorMessage 상태 관리

WeatherHomeView.vue
└── API 결과를 카드 목록으로 표시하고 검색

WeatherDetailView.vue
└── 같은 API 결과를 상세 정보로 표시
```

`useWeather`에서는 요청 성공, 실패, 종료 시점에 맞춰 상태를 변경합니다.

```js
const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
```

이를 통해 View 컴포넌트는 Axios의 세부 처리보다 로딩 화면, 오류 화면, 성공 화면을 표시하는 데 집중할 수 있었습니다.

### 8.3 API 응답 구조 변환

기존 `WeatherCard`는 다음과 같은 평평한 데이터 구조를 사용합니다.

```js
{
  id,
  name,
  temp,
  status,
  humidity,
  wind,
}
```

그러나 OpenWeather의 온도, 습도, 날씨 상태는 `main.temp`, `main.humidity`, `weather[0]`처럼 중첩되어 있습니다. 기존 컴포넌트를 수정하지 않고 사용하기 위해 API 계층에서 응답을 변환했습니다.

```js
const normalizeWeather = (data) => ({
  id: String(data.id),
  name: '판교',
  temp: Math.round(data.main.temp),
  status:
    weatherStatusMap[data.weather[0]?.main] ??
    data.weather[0]?.description ??
    '정보 없음',
  humidity: data.main.humidity,
  wind: data.wind.speed,
})
```

이 방법을 사용하면 API 응답 구조가 바뀌더라도 `WeatherCard`와 View를 모두 수정할 필요 없이 변환 함수만 확인할 수 있습니다.

### 8.4 기존 검색 기능 유지

고정 위도·경도 API 요청 하나는 한 지역의 데이터만 반환합니다. 처음에는 검색어를 API의 도시명 파라미터로 보내도록 변경했지만, 이것은 지정된 좌표를 사용한다는 실습 조건과 맞지 않았습니다. 또한 기존의 반응형 목록 검색 기능도 사라졌습니다.

따라서 API는 화면 진입 시 한 번 호출하고, 결과를 기존 `weatherList` 형태의 배열로 만든 뒤 `filteredWeatherList` computed가 검색을 담당하도록 복구했습니다.

```js
const weatherList = computed(() => weatherData.value ?? [])

const filteredWeatherList = computed(() => {
  return weatherList.value.filter((city) =>
    city.name.includes(searchQuery.value.trim()),
  )
})
```

```js
onMounted(() => {
  getWeather()
})
```

이후 대표 5지역으로 확장한 뒤에도 검색어를 입력할 때 API를 다시 호출하지 않고, 처음 받아온 다섯 지역 배열을 computed로 필터링하는 구조를 유지했습니다.

### 8.5 트러블슈팅

#### 지역 이름이 영어로 표시됨

요청 URL에 `lang=kr`을 넣었지만 지역 이름은 영어로 반환됐습니다. `lang` 옵션은 주로 날씨 설명에 적용되며 좌표 기반 지역명까지 항상 한글로 바꾸지는 않습니다.

이번 실습의 좌표가 고정되어 있으므로 화면 표시용 이름을 `판교`로 변환했습니다.

```js
name: '판교'
```

좌표가 동적으로 바뀌는 서비스라면 이름을 고정하면 안 되며, 별도의 역지오코딩 결과나 도시 이름 매핑 데이터가 필요합니다.

#### 날씨 상태가 `온흐림`으로 표시됨

OpenWeather의 `description`을 그대로 출력했을 때 `overcast clouds`가 `온흐림`처럼 어색하게 번역되어 반환됐습니다. 사람이 읽기 쉬운 표현을 사용하기 위해 `weather[0].main` 값을 기준으로 상태를 매핑했습니다.

```js
const weatherStatusMap = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '천둥번개',
  Snow: '눈',
  Mist: '안개',
  Fog: '안개',
  Haze: '실안개',
}
```

API에서 받은 문장을 무조건 그대로 출력하기보다 화면 요구사항에 맞는 표시용 데이터로 변환하는 과정이 필요하다는 점을 배웠습니다.

#### API를 연결하면서 검색 기능이 사라짐

API 검색 버튼을 추가하면서 기존 `filteredWeatherList`가 제거된 적이 있었습니다. 새로운 기능을 추가할 때 기존 기능을 대체해 버린 것이 원인이었습니다.

이후 다음 원칙으로 다시 수정했습니다.

```text
기존 searchQuery 유지
기존 update-query 이벤트 유지
기존 filteredWeatherList computed 유지
API 호출만 onMounted에 최소 추가
```

기능을 확장할 때는 먼저 기존 데이터 흐름을 확인하고, 필요한 지점에만 새로운 로직을 추가해야 한다는 점을 확인했습니다.

#### 로딩과 오류 상태

API 요청은 즉시 완료된다는 보장이 없으므로 로딩 중에는 카드를 표시하지 않고 안내 문구를 보여줬습니다. 요청 실패 시에는 빈 화면 대신 `errorMessage`를 표시했습니다.

```html
<p v-if="isLoading">날씨 데이터를 불러오는 중입니다...</p>
<p v-else-if="errorMessage">{{ errorMessage }}</p>
```

### 8.6 API 키 관련 주의사항

현재 실습에서는 제공받은 URL을 그대로 사용하기 위해 API 키가 URL에 포함되어 있습니다. 하지만 프런트엔드 코드는 브라우저로 전달되므로 소스 코드나 환경변수에 넣더라도 사용자가 키를 확인할 수 있습니다.

실제 배포 서비스에서는 백엔드 서버가 OpenWeather에 요청하도록 구성하고, 프런트엔드는 백엔드 API만 호출하는 방식으로 키를 보호해야 합니다.

---

## 9. Day 7 - 대표 5지역 날씨 확장

### 9.1 확장한 이유

판교 한 지역만 API로 받아오면 검색창에 서울이나 부산을 입력했을 때 항상 결과가 없었습니다. 그렇다고 전국의 모든 지역을 미리 요청하면 API 호출 수가 너무 많아집니다.

따라서 실습 화면에서 사용할 대표 지역 다섯 곳만 선정했습니다.

```js
const cities = [
  { name: '판교', lat: 37.4058453, lon: 127.0998294 },
  { name: '서울', lat: 37.5665, lon: 126.978 },
  { name: '수원', lat: 37.2636, lon: 127.0286 },
  { name: '부산', lat: 35.1796, lon: 129.0756 },
  { name: '제주', lat: 33.4996, lon: 126.5312 },
]
```

### 9.2 기존 판교 요청 방식 재사용

기존 API URL과 API 키, 단위와 언어 설정을 그대로 유지하고 도시별 위도·경도만 바꿔 요청했습니다.

```js
const requests = cities.map(async (city) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return normalizeWeather(response.data, city.name)
})

return Promise.all(requests)
```

각 요청 결과를 `Promise.all()`로 모아 `weatherData`에 배열로 저장했습니다. 홈 화면에서는 기존 코드 중 한 줄만 배열에 맞게 변경했습니다.

```js
const weatherList = computed(() => weatherData.value ?? [])
```

### 9.3 검색 시 API를 다시 호출하지 않는 구조

대표 지역의 API 요청은 화면 진입 시 수행됩니다. 검색창에 한 글자를 입력할 때마다 API를 호출하는 방식이 아니라, 이미 받은 다섯 지역을 기존 computed가 필터링합니다.

```text
최초 화면 진입
→ 대표 5지역 API 요청
→ weatherData 배열 저장

검색어 입력
→ searchQuery 변경
→ filteredWeatherList 재계산
→ 추가 API 요청 없음
```

이 방식으로 기존 검색 기능을 유지하면서 API 요청이 입력 횟수만큼 증가하는 문제를 피했습니다.

### 9.4 상세 화면 처리

API 응답이 단일 객체에서 배열로 바뀌었기 때문에 상세 화면에서는 URL의 도시 ID와 일치하는 항목을 찾아야 했습니다.

```js
const weather = computed(() => {
  return weatherList.value?.find(
    (city) => city.id === route.params.id,
  )
})
```

기존 동적 라우팅 구조를 유지하면서 데이터 선택 부분만 최소한으로 수정했습니다.

---

## 10. Day 7 확장 - PrimeVue UI 적용

### 10.1 적용 목표

직접 작성한 HTML 요소와 CSS를 모두 없애기보다, 기존 기능과 데이터 흐름을 유지하면서 화면의 주요 요소만 PrimeVue 컴포넌트로 교체했습니다.

적용한 컴포넌트는 다음과 같습니다.

| 기존 요소 | PrimeVue 컴포넌트 |
| --- | --- |
| 공통 대시보드 영역 | `Panel` |
| 검색 입력창 | `AutoComplete` |
| 날씨 카드 | `Card` |
| 온도 상태 표시 | `Tag` |
| 상세보기·단위 변경 버튼 | `Button` |
| 로딩 애니메이션 | `ProgressSpinner` |
| 오류 안내 | `Message` |

`main.js`에는 PrimeVue 플러그인과 Aura 테마를 등록했습니다.

```js
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
})
```

아이콘을 사용하기 위해 `primeicons` 스타일도 불러왔습니다.

```js
import 'primeicons/primeicons.css'
```

### 10.2 자동완성 검색창

기존 검색창은 입력한 문자를 화면에 반영하고 목록을 필터링하는 기능만 있었습니다. PrimeVue `AutoComplete`로 교체해 현재 불러온 대표 지역 이름을 추천 목록으로 표시했습니다.

홈 화면에서 API 결과의 도시 이름만 추출했습니다.

```js
const cityNames = computed(() => {
  return weatherList.value.map((city) => city.name)
})
```

이 배열을 `SearchBar`에 props로 전달했습니다.

```html
<SearchBar
  :search-query="searchQuery"
  :city-names="cityNames"
  @update-query="searchQuery = $event"
></SearchBar>
```

`SearchBar`에서는 AutoComplete의 `complete` 이벤트가 발생할 때 추천 목록을 계산합니다.

```js
const searchCities = (event) => {
  const query = event.query.trim().toLowerCase()

  suggestions.value = props.cityNames.filter((cityName) => {
    return cityName.toLowerCase().includes(query)
  })
}
```

자동완성은 검색 UI를 보조할 뿐 기존 `searchQuery`와 `filteredWeatherList` 구조는 변경하지 않았습니다. 추천 도시를 선택하거나 직접 입력해도 기존 computed 검색이 실행됩니다.

### 10.3 트러블슈팅 - `Invalid PrimeUI License`

처음 다음 명령으로 버전을 지정하지 않고 PrimeVue를 설치했습니다.

```sh
npm install primevue @primeuix/themes primeicons
```

2026년 현재 이 명령은 다음 버전을 설치했습니다.

```text
primevue@5.0.1
@primeuix/themes@3.0.0
primeicons@8.0.0
```

PrimeVue 5에는 새로운 PrimeUI 라이선스 검증이 적용되어 화면에 `Invalid PrimeUI License` 안내가 나타났습니다. 무료 실습 프로젝트에서 라이선스 배너가 나타나지 않도록 기존 MIT 버전인 PrimeVue 4로 버전을 고정했습니다.

```sh
npm install primevue@4.5.5 @primeuix/themes@1.2.5 primeicons@7.0.0
```

최종 사용 버전은 다음과 같습니다.

```text
primevue@4.5.5
@primeuix/themes@1.2.5
primeicons@7.0.0
```

이 문제를 통해 패키지를 설치할 때 단순히 최신 버전을 사용하는 것보다 프로젝트의 라이선스, 문서 버전, 호환성을 함께 확인해야 한다는 점을 배웠습니다.

### 10.4 PrimeVue 적용 시 주의한 점

- 기존 props와 emits 이름을 유지해 부모·자식 데이터 흐름을 바꾸지 않았습니다.
- 컴포넌트를 전역 등록하지 않고 사용하는 파일에서 개별 import했습니다.
- PrimeVue가 제공하는 스타일은 그대로 사용하고 필요한 배치 CSS만 남겼습니다.
- `AutoComplete` 추천 목록은 이미 받아온 도시 배열에서 만들기 때문에 추가 API 요청이 발생하지 않습니다.
- 단위 변경과 상세 페이지 이동 같은 기존 이벤트는 PrimeVue `Button`의 click 이벤트에 그대로 연결했습니다.

---

## 11. 전체 데이터 흐름

최종적으로 데이터는 다음과 같이 흐릅니다.

```text
SearchBar 입력
  → update-query emit
  → WeatherHomeView의 searchQuery 변경
  → filteredWeatherList computed 재계산
  → WeatherCard 목록 갱신

WeatherHomeView 화면 진입
  → onMounted 실행
  → useWeather.getWeather()
  → weatherApi에서 대표 5지역 좌표 API 호출
  → 각 OpenWeather 응답을 카드 데이터 형태로 변환
  → weatherData 배열 변경
  → weatherList와 filteredWeatherList 재계산

AutoComplete 입력 또는 추천 도시 선택
  → SearchBar의 update-query emit
  → searchQuery 변경
  → filteredWeatherList 재계산
  → 추가 API 요청 없이 카드 목록 갱신

WeatherCard 상세보기
  → click-detail emit
  → WeatherHomeView의 router.push()
  → /weather/:id 이동
  → WeatherDetailView에서 대표 5지역 API 호출
  → route.params.id와 일치하는 도시 선택

UnitToggle 클릭
  → configStore.toggleUnit()
  → Pinia unit 상태 변경
  → useTemperature의 displayTemp 재계산
  → WeatherCard와 WeatherDetailView 온도 표시 갱신
```

---

## 12. 개발 과정에서 특히 주의한 점

### 상태의 위치

한 컴포넌트에서만 사용하는 값은 지역 상태로 두고, 여러 화면에서 공유해야 하는 날씨 단위는 Pinia로 이동했습니다. 모든 값을 무조건 store에 넣는 것이 아니라 공유 범위를 기준으로 판단했습니다.

### 원본 데이터와 계산 데이터 구분

`weatherList`, `temp`는 원본 데이터이고 `filteredWeatherList`, `displayTemp`, `unitSymbol`은 원본으로부터 계산되는 값입니다. 계산 결과를 별도의 ref에 다시 저장하기보다 computed를 사용해 상태의 중복을 줄였습니다.

### 컴포넌트 책임 분리

- View는 페이지 상태와 라우팅 담당
- 공통 컴포넌트는 화면 표현 담당
- Store는 전역 설정 담당
- Composable은 재사용 가능한 반응형 로직 담당
- API 모듈은 HTTP 요청과 응답 형식 변환 담당
- UI 라이브러리는 화면 표현을 담당하고 기존 상태 흐름은 유지

역할을 구분해 특정 기능을 수정할 때 여러 파일을 동시에 고쳐야 하는 상황을 줄였습니다.

### 기존 실습 보존

Day 1부터 발전 과정을 비교할 수 있도록 기존 파일을 삭제하지 않고 `components/day1-3`과 `components/exercise`로 구분했습니다.

### 정적 검사와 빌드 검사

작업 후 다음 명령으로 문법과 빌드 오류를 확인했습니다.

```sh
npx eslint <수정한 파일>
npx oxlint <수정한 파일>
npm run build
```

빌드가 성공해도 입력 속성 오타나 실행 중 이벤트 문제는 남을 수 있으므로 브라우저 동작 확인도 필요하다는 점을 배웠습니다.

---

## 13. 배운 점과 회고

처음에는 한 파일에 모든 코드를 작성하는 것이 간단해 보였습니다. 하지만 검색, 상세 화면, 전역 단위 설정이 추가되면서 상태와 UI의 역할을 분리할 필요가 생겼습니다.

이번 실습을 통해 다음 내용을 이해할 수 있었습니다.

- `ref`는 직접 변경되는 상태를 관리한다.
- `computed`는 기존 상태로부터 파생된 값을 관리한다.
- `watch`는 특정 상태 변경에 따른 부수 효과를 처리한다.
- props는 부모에서 자식으로 데이터를 전달한다.
- emits는 자식의 동작을 부모에게 전달한다.
- slot은 공통 레이아웃 안에 서로 다른 내용을 배치한다.
- Vue Router는 URL과 화면을 연결한다.
- Pinia는 여러 컴포넌트와 페이지가 공유하는 상태를 관리한다.
- composable은 여러 곳에서 반복되는 반응형 로직을 재사용한다.
- 외부 API 데이터는 기존 UI가 사용하는 형태로 변환해 전달한다.
- 비동기 요청에는 성공뿐 아니라 로딩과 실패 상태도 필요하다.
- UI 라이브러리도 버전과 라이선스를 확인하고 설치해야 한다.
- 자동완성은 기존 검색 상태를 대체하지 않고 보조할 수 있다.

특히 기능이 확장될수록 단순히 코드를 여러 파일로 나누는 것보다 각 파일이 어떤 책임을 가져야 하는지 결정하는 것이 더 중요하다는 점을 배웠습니다.

## 14. 이후 개선 계획

- 대표 지역 목록을 별도 데이터 파일 또는 Store로 분리
- 고정 좌표가 아닌 현재 위치 또는 사용자가 선택한 지역 조회
- API 요청 결과 캐싱으로 홈과 상세 화면의 중복 요청 감소
- 백엔드 프록시를 사용해 API 키 보호
- 검색어 대소문자 및 초성 검색 개선
- Pinia 상태를 localStorage에 저장해 새로고침 후에도 단위 유지
- 컴포넌트 및 라우터 동작 테스트 추가

## 15. 실행 방법

```sh
npm install
npm run dev
```

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```sh
npm run build
```
