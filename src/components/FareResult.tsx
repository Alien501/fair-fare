import { Separator } from '@/components/ui/separator'
import type { FareBreakdown } from '@/fares'

interface FareResultProps {
  breakdown: FareBreakdown
}

const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

export function FareResult({ breakdown }: FareResultProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Meter fare</span>
        <span className="font-heading text-4xl font-semibold tabular-nums">
          {rupees(breakdown.total)}
        </span>
      </div>

      <Separator />

      <ul className="flex flex-col gap-1.5 text-sm">
        {breakdown.lines.map((line) => (
          <li key={line.label} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{line.label}</span>
            <span className="tabular-nums">{rupees(line.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
