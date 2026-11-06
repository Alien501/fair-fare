import { useState } from 'react'
import { buildBargainScript, type ChatMessage, type Verdict } from '@/bargain'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { vehicleTypes, type FareBreakdown, type FareRule, type TripInput } from '@/fares'
import { cn } from '@/lib/utils'

interface BargainChatProps {
  rule: FareRule
  trip: TripInput
  breakdown: FareBreakdown
}

const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

/**
 * "Driver asking extra?" Enter the ask and the negotiation plays out as a
 * chat you can follow line by line.
 */
export function BargainChat({ rule, trip, breakdown }: BargainChatProps) {
  const [asked, setAsked] = useState(0)
  const script = asked > 0 ? buildBargainScript(rule, trip, breakdown, asked) : null
  const vehicle = vehicleTypes[rule.vehicle]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="asked">What did the driver ask for?</Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            ₹
          </span>
          <Input
            id="asked"
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            placeholder={String(Math.round(breakdown.total * 1.7))}
            className="h-11 pl-7 text-lg"
            value={asked || ''}
            onChange={(e) => setAsked(Number(e.target.value))}
          />
        </div>
      </div>

      {script ? (
        <>
          <VerdictBanner verdict={script.verdict} headline={script.headline} />
          <ol className="flex flex-col gap-2.5">
            {script.messages.map((message, index) => (
              <Bubble
                key={index}
                message={message}
                driverEmoji={vehicle.emoji}
              />
            ))}
          </ol>
          <p className="text-center text-xs text-muted-foreground">
            Meter {rupees(breakdown.total)} · walk away above {rupees(script.ceiling)}
          </p>
        </>
      ) : (
        <ol className="flex flex-col gap-2.5">
          <Bubble
            driverEmoji={vehicle.emoji}
            message={{ from: 'driver', text: `${trip.distanceKm} km? That will be... ₹ ___` }}
          />
          <Bubble
            driverEmoji={vehicle.emoji}
            message={{ from: 'referee', text: 'Type the number above and we will handle the rest.' }}
          />
        </ol>
      )}
    </section>
  )
}

const verdictStyles: Record<Verdict, string> = {
  fair: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  close: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  wild: 'bg-destructive/10 text-destructive',
}

function VerdictBanner({ verdict, headline }: { verdict: Verdict; headline: string }) {
  return (
    <p className={cn('rounded-lg px-3 py-2 text-sm font-medium', verdictStyles[verdict])}>
      {headline}
    </p>
  )
}

function Bubble({ message, driverEmoji }: { message: ChatMessage; driverEmoji: string }) {
  if (message.from === 'referee') {
    return (
      <li className="mx-6 my-1 text-center text-xs leading-relaxed text-muted-foreground">
        {message.text}
      </li>
    )
  }

  const isDriver = message.from === 'driver'
  return (
    <li className={cn('flex items-end gap-2', isDriver ? 'justify-start' : 'justify-end')}>
      {isDriver && <span className="text-xl leading-none" aria-hidden>{driverEmoji}</span>}
      <p
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug',
          isDriver
            ? 'rounded-bl-sm bg-muted text-foreground'
            : 'rounded-br-sm bg-primary text-primary-foreground',
        )}
      >
        {message.text}
      </p>
      {!isDriver && <span className="text-xl leading-none" aria-hidden>🧳</span>}
    </li>
  )
}
