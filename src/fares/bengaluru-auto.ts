import type { FareRule } from './types'

/**
 * Bengaluru auto-rickshaw fares.
 *
 * To update after a new notification: change the numbers, set
 * `source.notifiedOn` to the notification date, `source.verifiedOn` to today,
 * update the link, then run `npm test`.
 */
export const bengaluruAuto: FareRule = {
  id: 'bengaluru-auto',
  city: 'Bengaluru',
  vehicle: 'auto',
  region: 'BBMP limits',

  minimumFare: 36,
  baseDistanceKm: 2,
  perKmAfterBase: 18,

  // The 2025 notification's waiting rule could not be confirmed from press
  // coverage, so waiting charges are not offered for this city yet.
  waitingPerMinute: undefined,

  night: {
    multiplier: 1.5,
    startHour: 22,
    endHour: 5,
  },

  askForMeter: {
    native: 'ಮೀಟರ್ ಹಾಕಿ',
    romanised: 'Meter haaki',
  },

  source: {
    authority: 'Bangalore Urban Regional Transport Authority',
    title: 'Minimum auto fare in Bengaluru hiked to Rs 36 for first 2 km from Aug 1 (ThePrint)',
    url: 'https://theprint.in/india/minimum-auto-fare-in-bengaluru-hiked-to-rs-36-for-first-2-kms-from-aug-1/2690204',
    notifiedOn: '2025-07-14',
    verifiedOn: '2026-11-06',
    notes:
      'Effective 1 Aug 2025. Night rate reported as "half the normal fare added", i.e. 1.5x. Figures taken from press coverage, not the notification text.',
  },
}
