import type { FareBreakdown, FareLine, FareRule, TripInput } from './types'

/** Round to the nearest rupee, the way a fare meter displays it. */
const toRupees = (amount: number) => Math.round(amount)

/**
 * Compute the fare a traveller should pay under a government-notified rule.
 *
 * Assumptions, matching how meters are calibrated:
 * - Distance beyond the base is charged pro-rata, not rounded up to a full km.
 * - The night multiplier applies to the distance fare only, not to waiting.
 * - Waiting is charged only when the rule defines a per-minute rate.
 * - Each line is rounded to the rupee and the total is the sum of the lines,
 *   so the breakdown always adds up when shown to a driver.
 */
export function calculateFare(rule: FareRule, trip: TripInput): FareBreakdown {
  const distanceKm = Math.max(0, trip.distanceKm)
  const waitingMinutes = Math.max(0, Math.floor(trip.waitingMinutes))

  const extraKm = Math.max(0, distanceKm - rule.baseDistanceKm)
  const extraFare = extraKm * rule.perKmAfterBase
  const distanceFare = rule.minimumFare + extraFare

  const lines: FareLine[] = [
    {
      label: `Minimum fare (first ${rule.baseDistanceKm} km)`,
      amount: rule.minimumFare,
    },
  ]

  if (extraKm > 0) {
    lines.push({
      label: `Extra ${formatKm(extraKm)} km × ₹${rule.perKmAfterBase}`,
      amount: toRupees(extraFare),
    })
  }

  if (trip.isNight) {
    lines.push({
      label: `Night charge (×${rule.night.multiplier})`,
      amount: toRupees(distanceFare * (rule.night.multiplier - 1)),
    })
  }

  if (rule.waitingPerMinute !== undefined && waitingMinutes > 0) {
    lines.push({
      label: `Waiting ${waitingMinutes} min × ₹${rule.waitingPerMinute}`,
      amount: toRupees(waitingMinutes * rule.waitingPerMinute),
    })
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  return { lines, total }
}

/** True if `hour` (0-23) falls inside the rule's night window. */
export function isNightHour(rule: FareRule, hour: number): boolean {
  const { startHour, endHour } = rule.night
  // Window wraps past midnight (e.g. 22 → 5) when start is after end.
  return startHour > endHour
    ? hour >= startHour || hour < endHour
    : hour >= startHour && hour < endHour
}

function formatKm(km: number): string {
  return Number.isInteger(km) ? String(km) : km.toFixed(1)
}
