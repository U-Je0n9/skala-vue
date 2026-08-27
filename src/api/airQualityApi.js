import axios from 'axios'

const AIR_QUALITY_URL =
  'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'
const encodedApiKey = import.meta.env.VITE_AIRKOREA_API_KEY
const API_KEY = encodedApiKey ? decodeURIComponent(encodedApiKey) : ''

const gradeMap = { 1: '좋음', 2: '보통', 3: '나쁨', 4: '매우 나쁨' }
const normalizeValue = (value) => (value && value !== '-' ? value : null)
const normalizeGrade = (grade) => gradeMap[grade] ?? '정보 없음'

const requestSidoAirQuality = async (params) => {
  try {
    return await axios.get(AIR_QUALITY_URL, { params })
  } catch (error) {
    if (error.response?.status !== 504) throw error
    return axios.get(AIR_QUALITY_URL, { params })
  }
}

export const fetchAirQuality = async ({ sidoName, stationName }) => {
  if (!API_KEY) throw new Error('에어코리아 API 인증키가 없습니다.')
  if (!sidoName) throw new Error('검색 도시의 시도 정보를 확인하지 못했습니다.')

  const response = await requestSidoAirQuality({
    serviceKey: API_KEY,
    returnType: 'json',
    numOfRows: 200,
    pageNo: 1,
    sidoName,
    ver: '1.0',
  })

  const items = response.data?.response?.body?.items ?? []
  const selectedStation = stationName
    ? items.find((item) => item.stationName === stationName)
    : items.find((item) => normalizeValue(item.pm10Value) || normalizeValue(item.pm25Value))

  if (!selectedStation) throw new Error('현재 측정 가능한 대기질 측정소를 찾지 못했습니다.')

  return {
    stationName: selectedStation.stationName,
    dataTime: selectedStation.dataTime,
    pm10Value: normalizeValue(selectedStation.pm10Value),
    pm25Value: normalizeValue(selectedStation.pm25Value),
    khaiValue: normalizeValue(selectedStation.khaiValue),
    pm10Grade: normalizeGrade(selectedStation.pm10Grade),
    pm25Grade: normalizeGrade(selectedStation.pm25Grade),
    khaiGrade: normalizeGrade(selectedStation.khaiGrade),
    isAutoSelected: !stationName,
  }
}
