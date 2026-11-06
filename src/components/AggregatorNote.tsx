import { aggregatorPricingLaw, platforms } from '@/aggregators'

interface AggregatorNoteProps {
  /** The meter fare for this trip. */
  meterFare: number
}

const rupees = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`

/**
 * What happens to the fare when the ride is booked through an app: the
 * driver keeps all of it, and the app's price must stay inside a legal band.
 */
export function AggregatorNote({ meterFare }: AggregatorNoteProps) {
  const low = meterFare * aggregatorPricingLaw.minMultiplier
  const high = meterFare * aggregatorPricingLaw.maxMultiplier
  const allSubscription = platforms.every(
    (p) => p.driverChargeModel === 'subscription',
  )

  return (
    <section className="flex flex-col gap-3 text-sm">
      <p className="text-muted-foreground">
        {allSubscription
          ? 'No app takes a cut of your fare any more. Drivers pay a flat fee, so anything asked above the app price goes straight to the driver.'
          : 'Some apps still keep a share of the fare. See each platform below.'}
      </p>

      <ul className="flex flex-col gap-1 text-muted-foreground">
        {platforms.map((platform) => (
          <li key={platform.id} className="flex justify-between gap-4">
            <span className="text-foreground">{platform.name}</span>
            <a
              href={platform.source.url}
              target="_blank"
              rel="noreferrer"
              className="text-right underline-offset-2 hover:underline"
            >
              {platform.driverCharge}
            </a>
          </li>
        ))}
      </ul>

      <p className="rounded-lg bg-muted/60 px-3 py-2 text-muted-foreground">
        By{' '}
        <a
          href={aggregatorPricingLaw.source.url}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          law
        </a>{' '}
        an app may price this trip between{' '}
        <span className="text-foreground tabular-nums">{rupees(low)}</span> and{' '}
        <span className="text-foreground tabular-nums">{rupees(high)}</span>.
        Above that, question it.
      </p>
    </section>
  )
}
