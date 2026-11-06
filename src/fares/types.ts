import type { VehicleType } from './vehicles'

/**
 * A government-notified fare rule for one vehicle type in one city.
 *
 * Every number here must come from an official notification. The `source`
 * block records where it came from and when we last checked it, and is shown
 * to the user so a stale rate is never presented as current.
 *
 * `src/fares/rules.test.ts` validates every registered rule, so run
 * `npm test` after editing one.
 */
export interface FareRule {
  /** Stable identifier, e.g. "chennai-auto". Used in URLs and storage. */
  id: string
  city: string
  /** One of the keys in `vehicles.ts`. */
  vehicle: VehicleType
  /** Area the notification applies to, e.g. "Chennai Metropolitan Area". */
  region: string

  /** Fare charged for any trip up to `baseDistanceKm`. */
  minimumFare: number
  /** Distance covered by the minimum fare. */
  baseDistanceKm: number
  /** Rate for every km beyond `baseDistanceKm`. Fractions are pro-rated. */
  perKmAfterBase: number

  /**
   * Charged per minute the auto waits at the passenger's request.
   * Leave undefined if the notification's waiting rule is unknown or not
   * per-minute; the app then hides the waiting input.
   */
  waitingPerMinute?: number

  /** Night surcharge applied to the distance fare. */
  night: {
    multiplier: number
    /** Hour (0-23) at which night rates begin. */
    startHour: number
    /** Hour (0-23) at which night rates end. May wrap past midnight. */
    endHour: number
  }

  /** How to ask the driver to use the meter, in the local language. */
  askForMeter?: {
    /** In the local script. */
    native: string
    /** Romanised, so a visitor can say it. */
    romanised: string
  }

  source: {
    /** Who issued the notification, e.g. "Tamil Nadu Government". */
    authority: string
    title: string
    url: string
    /** ISO date the notification was issued. */
    notifiedOn: string
    /** ISO date we last confirmed these numbers. */
    verifiedOn: string
    /** Anything a future maintainer should know. */
    notes?: string
  }
}

export interface TripInput {
  distanceKm: number
  isNight: boolean
  waitingMinutes: number
}

/** One row of the fare breakdown shown to the user. */
export interface FareLine {
  label: string
  amount: number
}

export interface FareBreakdown {
  lines: FareLine[]
  /** Sum of the rounded lines, so the breakdown always adds up. */
  total: number
}
