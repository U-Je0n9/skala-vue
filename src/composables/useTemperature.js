import { computed, toValue } from 'vue'
import { useConfigStore } from '@/stores/configStore'

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

  return {
    displayTemp,
    unitSymbol,
  }
}
