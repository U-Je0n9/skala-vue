import axios from 'axios'

const WEATHER_URL =
  'https://api.openweathermap.org/data/2.5/weather?lat=37.4058453&lon=127.0998294&appid=d3b51deaad04ca859fd5f05b408de52a&units=metric&lang=kr'

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

const normalizeWeather = (data) => ({
  id: String(data.id),
  name: '판교',
  temp: Math.round(data.main.temp),
  status: weatherStatusMap[data.weather[0]?.main] ?? data.weather[0]?.description ?? '정보 없음',
  humidity: data.main.humidity,
  wind: data.wind.speed,
})

export const fetchWeather = async () => {
  const response = await axios.get(WEATHER_URL)

  return normalizeWeather(response.data)
}
