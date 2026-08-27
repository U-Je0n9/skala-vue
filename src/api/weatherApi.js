import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'

const sidoNameMap = {
  Seoul: '서울', Busan: '부산', Daegu: '대구', Incheon: '인천', Gwangju: '광주',
  Daejeon: '대전', Ulsan: '울산', Sejong: '세종', 'Gyeonggi-do': '경기',
  'Gangwon-do': '강원', 'Chungcheongbuk-do': '충북', 'Chungcheongnam-do': '충남',
  'Jeollabuk-do': '전북', 'Jeollanam-do': '전남', 'Gyeongsangbuk-do': '경북',
  'Gyeongsangnam-do': '경남', 'Jeju-do': '제주', 서울특별시: '서울', 부산광역시: '부산',
  대구광역시: '대구', 인천광역시: '인천', 광주광역시: '광주', 대전광역시: '대전',
  울산광역시: '울산', 세종특별자치시: '세종', 경기도: '경기', 강원도: '강원',
  강원특별자치도: '강원', 충청북도: '충북', 충청남도: '충남', 전라북도: '전북',
  전북특별자치도: '전북', 전라남도: '전남', 경상북도: '경북', 경상남도: '경남',
  제주도: '제주', 제주특별자치도: '제주',
}

const getSidoName = (location) => sidoNameMap[location.state] ?? sidoNameMap[location.name]

export const defaultCities = [
  { name: '판교', lat: 37.4058453, lon: 127.0998294, sidoName: '경기', stationName: '운중동' },
  { name: '서울', lat: 37.5665, lon: 126.978, sidoName: '서울', stationName: '중구' },
  { name: '수원', lat: 37.2636, lon: 127.0286, sidoName: '경기', stationName: '인계동' },
  { name: '부산', lat: 35.1796, lon: 129.0756, sidoName: '부산', stationName: '광복동' },
  { name: '제주', lat: 33.4996, lon: 126.5312, sidoName: '제주', stationName: '연동' },
]

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

const normalizeWeather = (data, city) => ({
  id: String(data.id),
  name: city.name,
  lat: data.coord.lat,
  lon: data.coord.lon,
  temp: Math.round(data.main.temp),
  status: weatherStatusMap[data.weather[0]?.main] ?? data.weather[0]?.description ?? '정보 없음',
  humidity: data.main.humidity,
  wind: data.wind.speed,
  sidoName: city.sidoName,
  stationName: city.stationName,
})

export const fetchCityWeather = async (city) => {
  if (!API_KEY) throw new Error('OpenWeather API 인증키가 없습니다.')

  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return normalizeWeather(response.data, city)
}

export const searchCityLocation = async (query) => {
  if (!API_KEY) throw new Error('OpenWeather API 인증키가 없습니다.')

  const response = await axios.get(GEOCODING_URL, {
    params: {
      q: `${query},KR`,
      limit: 1,
      appid: API_KEY,
    },
  })

  const location = response.data[0]

  if (!location) throw new Error('검색한 국내 지역을 찾지 못했습니다.')

  return {
    name: location.local_names?.ko ?? location.name,
    lat: location.lat,
    lon: location.lon,
    sidoName: getSidoName(location),
  }
}

export const fetchWeather = async () => {
  const requests = defaultCities.map((city) => fetchCityWeather(city))

  return Promise.all(requests)
}
