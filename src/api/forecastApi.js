import axios from 'axios'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const weatherCodeMap = {
  0: '맑음',
  1: '대체로 맑음',
  2: '부분적으로 흐림',
  3: '흐림',
  45: '안개',
  48: '서리 안개',
  51: '약한 이슬비',
  53: '이슬비',
  55: '강한 이슬비',
  61: '약한 비',
  63: '비',
  65: '강한 비',
  71: '약한 눈',
  73: '눈',
  75: '강한 눈',
  80: '약한 소나기',
  81: '소나기',
  82: '강한 소나기',
  95: '천둥번개',
  96: '우박을 동반한 천둥번개',
  99: '강한 우박과 천둥번개',
}

export const fetchForecast = async (city) => {
  const response = await axios.get(FORECAST_URL, {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),
      timezone: 'Asia/Seoul',
      forecast_days: 7,
    },
  })

  const daily = response.data.daily

  return daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    status: weatherCodeMap[daily.weather_code[index]] ?? '정보 없음',
    maxTemp: Math.round(daily.temperature_2m_max[index]),
    minTemp: Math.round(daily.temperature_2m_min[index]),
    precipitationProbability: daily.precipitation_probability_max[index],
  }))
}
