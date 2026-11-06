import type { AggregatorPricingLaw, Platform } from './types'

/** Platforms that run autos. Update `driverCharge` and `verifiedOn` together. */
export const platforms: readonly Platform[] = [
  {
    id: 'rapido',
    name: 'Rapido',
    driverChargeModel: 'subscription',
    driverCharge: 'flat fee, reported at about ₹20–25 a day',
    source: {
      title: "Rapido's disruptive ride (Business Standard)",
      url: 'https://www.magzter.com/hi/stories/newspaper/Business-Standard/RAPIDOS-DISRUPTIVE-RIDE-025777',
      verifiedOn: '2026-11-06',
    },
  },
  {
    id: 'uber',
    name: 'Uber',
    driverChargeModel: 'subscription',
    driverCharge: 'flat daily or monthly fee since Feb 2025',
    source: {
      title: 'Uber ditches commissions for auto drivers in India (TechCrunch)',
      url: 'https://techcrunch.com/2025/02/19/uber-ditches-commissions-in-favor-of-fees-for-auto-rickshaw-drivers-in-india',
      verifiedOn: '2026-11-06',
    },
  },
  {
    id: 'ola',
    name: 'Ola',
    driverChargeModel: 'subscription',
    driverCharge: 'flat daily, monthly or annual fee since Jun 2025',
    source: {
      title: 'Ola rolls out zero commission rides pan-India (YourStory)',
      url: 'https://yourstory.com/2025/06/ola-rolls-0-commission-rides-pan-india-rapido-uber',
      verifiedOn: '2026-11-06',
    },
  },
  {
    id: 'namma-yatri',
    name: 'Namma Yatri',
    driverChargeModel: 'subscription',
    driverCharge: 'flat fee, no commission since 2023',
    source: {
      title: 'Namma Yatri subscription model',
      url: 'https://nammayatri.in/',
      verifiedOn: '2026-11-06',
    },
  },
]

export const aggregatorPricingLaw: AggregatorPricingLaw = {
  name: 'Motor Vehicle Aggregator Guidelines 2025',
  minMultiplier: 0.5,
  maxMultiplier: 2,
  maxPlatformShare: 0.2,
  source: {
    title: 'Govt permits surge fares of up to 2x base rate (Business Standard)',
    url: 'https://www.business-standard.com/india-news/cab-aggregators-surge-pricing-rapido-uber-ola-125070200228_1.html',
    verifiedOn: '2026-11-06',
  },
}
