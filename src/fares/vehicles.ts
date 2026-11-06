/**
 * Vehicle types the app can describe. A fare rule names one of these.
 * Adding a type here does not add any fares; it only makes the vocabulary
 * available so a rule file can use it.
 */
export const vehicleTypes = {
  auto: { label: 'Auto rickshaw', emoji: '🛺', driver: 'Auto driver' },
  taxi: { label: 'Taxi', emoji: '🚕', driver: 'Taxi driver' },
  bike: { label: 'Bike taxi', emoji: '🏍️', driver: 'Rider' },
} as const

export type VehicleType = keyof typeof vehicleTypes

export const vehicleLabel = (type: VehicleType) => vehicleTypes[type].label
