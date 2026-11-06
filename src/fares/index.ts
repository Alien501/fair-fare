import { bengaluruAuto } from './bengaluru-auto.ts'
import { chennaiAuto } from './chennai-auto.ts'
import type { FareRule } from './types'
import type { VehicleType } from './vehicles.ts'

/**
 * Registry of every fare rule the app knows about, in display order.
 * To add a city or vehicle: create a rule file next to these and list it here.
 */
export const fareRules: readonly FareRule[] = [chennaiAuto, bengaluruAuto]

export const defaultRule: FareRule = fareRules[0]

export function findRule(id: string | null | undefined): FareRule | undefined {
  return fareRules.find((rule) => rule.id === id)
}

/** Cities that have at least one rule, in registry order, without duplicates. */
export function cities(): string[] {
  return [...new Set(fareRules.map((rule) => rule.city))]
}

/** Rules for one city, in registry order. */
export function rulesForCity(city: string): FareRule[] {
  return fareRules.filter((rule) => rule.city === city)
}

/** The rule for a city + vehicle, if one exists. */
export function findRuleFor(city: string, vehicle: VehicleType): FareRule | undefined {
  return fareRules.find((rule) => rule.city === city && rule.vehicle === vehicle)
}

export { calculateFare, isNightHour } from './calculate.ts'
export type { FareBreakdown, FareLine, FareRule, TripInput } from './types'
export { vehicleLabel, vehicleTypes, type VehicleType } from './vehicles.ts'
