import type { FareBreakdown, FareRule, TripInput } from '@/fares'

export type Speaker = 'driver' | 'you' | 'referee'

export interface ChatMessage {
  from: Speaker
  text: string
}

/** How the driver's ask compares with the meter fare. */
export type Verdict = 'fair' | 'close' | 'high' | 'wild'

export interface BargainScript {
  verdict: Verdict
  /** Short comic headline for the verdict. */
  headline: string
  /** Most you should agree to before walking away. */
  ceiling: number
  messages: ChatMessage[]
}

/** Round up to the next ₹10 so the number sounds natural when spoken. */
const roundUpToTen = (amount: number) => Math.ceil(amount / 10) * 10

const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

/**
 * How much over the meter fare is still worth paying to skip the argument:
 * ten percent, rounded to a round number.
 */
export function walkAwayCeiling(meterFare: number): number {
  // Integer maths first: 100 * 1.1 is 110.00000000000001 in floating point.
  return roundUpToTen(Math.round(meterFare * 11) / 10)
}

export function judge(meterFare: number, asked: number): Verdict {
  if (asked <= meterFare) return 'fair'
  if (asked <= walkAwayCeiling(meterFare)) return 'close'
  if (asked <= meterFare * 1.5) return 'high'
  return 'wild'
}

const headlines: Record<Verdict, string> = {
  fair: 'Honest driver spotted. Rare. Get in before they change their mind.',
  close: 'A small tourist tax. Pay it and keep your afternoon.',
  high: 'Classic tourist tax. Time to negotiate.',
  wild: 'Legendary ask. Someone is financing a new auto with your trip.',
}

/**
 * Build the chat a traveller can follow, given what the driver asked.
 * Pure function so it can be tested without React.
 */
export function buildBargainScript(
  rule: FareRule,
  trip: TripInput,
  breakdown: FareBreakdown,
  asked: number,
): BargainScript {
  const fare = breakdown.total
  const ceiling = walkAwayCeiling(fare)
  const verdict = judge(fare, asked)
  const extra = asked - fare
  const extraPct = Math.round((extra / fare) * 100)
  const km = trip.distanceKm

  const meterPlease = rule.askForMeter
    ? `${rule.askForMeter.romanised}! (${rule.askForMeter.native})`
    : 'Meter, please.'

  const lawLine =
    `As per the ${rule.source.authority} notification of ${formatDate(rule.source.notifiedOn)}, ` +
    `${km} km is ${rupees(fare)}. ${rupees(rule.minimumFare)} for the first ${rule.baseDistanceKm} km, ` +
    `then ${rupees(rule.perKmAfterBase)} a km.` +
    (trip.isNight ? ` Night charge is already in that.` : '')

  const driverOpens: ChatMessage = {
    from: 'driver',
    text: `${km} km? ${rupees(asked)}. Fixed price. No meter.`,
  }

  let messages: ChatMessage[]

  switch (verdict) {
    case 'fair':
      messages = [
        { from: 'driver', text: `${km} km? ${rupees(asked)}.` },
        { from: 'you', text: 'Deal. Wait, really?' },
        {
          from: 'referee',
          text: `That is at or below the meter fare of ${rupees(fare)}. Pay, say thanks, maybe take a photo for posterity.`,
        },
      ]
      break

    case 'close':
      messages = [
        driverOpens,
        { from: 'you', text: `Meter says ${rupees(fare)}, but fine, ${rupees(asked)}.` },
        {
          from: 'referee',
          text: `Only ${rupees(extra)} over the meter. Inside the hassle-free zone (meter + 10%). Not worth your afternoon.`,
        },
      ]
      break

    case 'high':
    case 'wild':
      messages = [
        driverOpens,
        { from: 'you', text: meterPlease },
        { from: 'driver', text: 'Meter not working. Since 2013.' },
        { from: 'you', text: lawLine },
        {
          from: 'referee',
          text: `You are being asked ${rupees(extra)} extra. That is ${extraPct}% over the meter.`,
        },
        {
          from: 'driver',
          text: 'Traffic, boss. Petrol price. One way. Also my cousin is getting married.',
        },
        {
          from: 'you',
          text: `${rupees(ceiling)}, final. That is ${rupees(ceiling - fare)} over the meter for your trouble. Otherwise I take the next one.`,
        },
        { from: 'driver', text: '...Okay okay. Get in.' },
        {
          from: 'referee',
          text: `If they still say no, walk. Drivers often call you back before you reach the next ${rule.vehicle === 'bike' ? 'rider' : 'driver'}. An app ride will land near ${rupees(fare)} anyway.`,
        },
      ]
      break
  }

  return { verdict, headline: headlines[verdict], ceiling, messages }
}
