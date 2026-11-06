import type { FareRule } from './types'

/**
 * Chennai auto-rickshaw fares.
 *
 * To update after a new notification: change the numbers, set
 * `source.notifiedOn` to the notification date, `source.verifiedOn` to today,
 * update the link, then run `npm test`.
 */
export const chennaiAuto: FareRule = {
  id: 'chennai-auto',
  city: 'Chennai',
  vehicle: 'auto',
  region: 'Chennai Metropolitan Area',

  minimumFare: 50,
  baseDistanceKm: 1.8,
  perKmAfterBase: 25,

  waitingPerMinute: 1,

  night: {
    multiplier: 1.5,
    startHour: 22,
    endHour: 5,
  },

  askForMeter: {
    native: 'மீட்டர் போடுங்க',
    romanised: 'Meter podunga',
  },

  source: {
    authority: 'Tamil Nadu Government',
    title: 'Tamil Nadu revises auto fares after 13 years (DT Next)',
    url: 'https://www.dtnext.in/news/tamilnadu/tamil-nadu-revises-auto-fares-after-13-years-minimum-charge-fixed-at-rs-50',
    notifiedOn: '2026-10-27',
    verifiedOn: '2026-11-06',
    notes:
      'Home (Transport-I) Department notification in the TN Gazette. Supersedes the August 2013 structure (Rs 25 for 1.8 km, Rs 12/km). Figures taken from press coverage, not the gazette text.',
  },
}
