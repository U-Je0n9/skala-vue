import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useForecastStore } from '@/stores/forecastStore'

const baseCity = { name: '판교', lat: 37.4058453, lon: 127.0998294 }

export const useWeatherTheme = () => {
  const forecastStore = useForecastStore()
  const currentTime = ref(new Date())
  let timeTimer

  const todayForecast = computed(() => {
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
    }).format(currentTime.value)

    return forecastStore.getForecastByCity(baseCity.name).find((day) => day.date === today)
  })

  const weatherMood = computed(() => {
    const forecast = todayForecast.value

    if (!forecast?.sunrise || !forecast?.sunset) return 'day'

    const now = currentTime.value.getTime()
    const sunrise = new Date(forecast.sunrise).getTime()
    const sunset = new Date(forecast.sunset).getTime()
    const thirtyMinutes = 30 * 60 * 1000
    const oneHour = 60 * 60 * 1000

    if (now >= sunrise - thirtyMinutes && now <= sunrise + thirtyMinutes) return 'sunrise'
    if (now >= sunset - oneHour && now <= sunset + oneHour) return 'sunset'
    if (now < sunrise - thirtyMinutes || now > sunset + oneHour) return 'night'

    const code = forecast.weatherCode
    const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95

    return isRainy ? 'rainy' : 'day'
  })

  const recommendation = computed(() => {
    const messages = {
      sunrise: '🌅 곧 해가 떠올라요. 가볍게 아침 산책을 나가볼까요?',
      sunset: '🌇 노을이 예쁜 시간이에요. 오늘 일몰을 보러 가면 어떨까요?',
      night: '🌙 밤공기가 찾아왔어요. 늦은 외출에는 얇은 겉옷을 챙겨보세요.',
      rainy: '☔ 비 소식이 있어요. 우산은 챙기셨나요?',
      day: '🌤️ 하늘을 확인하고 기분 좋은 하루를 시작해 보세요.',
    }

    return messages[weatherMood.value]
  })

  onMounted(() => {
    forecastStore.fetchCityForecast(baseCity)
    timeTimer = window.setInterval(() => {
      currentTime.value = new Date()
    }, 60 * 1000)
  })

  onUnmounted(() => {
    window.clearInterval(timeTimer)
  })

  return { todayForecast, weatherMood, recommendation }
}
