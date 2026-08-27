import axios from 'axios'

const API_KEY = 'd3b51deaad04ca859fd5f05b408de52a'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cities = [
  { name: '판교', lat: 37.4058453, lon: 127.0998294 },
  { name: '서울', lat: 37.5665, lon: 126.978 },
  { name: '수원', lat: 37.2636, lon: 127.0286 },
  { name: '부산', lat: 35.1796, lon: 129.0756 },
  { name: '제주', lat: 33.4996, lon: 126.5312 },
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

const normalizeWeather = (data, cityName) => ({
  id: String(data.id),
  name: cityName,
  temp: Math.round(data.main.temp),
  status: weatherStatusMap[data.weather[0]?.main] ?? data.weather[0]?.description ?? '정보 없음',
  humidity: data.main.humidity,
  wind: data.wind.speed,
})

export const fetchWeather = async () => {
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
}
