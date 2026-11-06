/**
 * How a ride-hailing platform charges the driver for auto rides.
 * Figures come from press coverage, so each entry carries its own source and
 * verification date, just like fare rules.
 */
export interface Platform {
  id: string
  name: string
  /**
   * "subscription": driver pays a flat fee, keeps the whole fare.
   * "commission": platform keeps a percentage of each fare.
   */
  driverChargeModel: 'subscription' | 'commission'
  /** Human-readable summary, e.g. "about ₹20–25 a day". */
  driverCharge: string
  source: {
    title: string
    url: string
    verifiedOn: string
  }
}

/** Legal limits on how far an app fare may stray from the base fare. */
export interface AggregatorPricingLaw {
  name: string
  /** Lowest allowed fare as a multiple of the base fare. */
  minMultiplier: number
  /** Highest allowed fare (surge) as a multiple of the base fare. */
  maxMultiplier: number
  /** Largest share of a fare a platform may keep from a driver-owned vehicle. */
  maxPlatformShare: number
  source: {
    title: string
    url: string
    verifiedOn: string
  }
}
