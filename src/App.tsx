import { useState } from 'react'
import { FareCalculator } from '@/components/FareCalculator'
import { RulePicker } from '@/components/RulePicker'
import { defaultRule, findRule, type FareRule } from '@/fares'
import { Analytics } from "@vercel/analytics/react"

const STORAGE_KEY = 'fair-fare:rule'

/** Last chosen city + vehicle, if the browser lets us remember it. */
function readStoredRuleId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeRuleId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
}

export default function App() {
  const [rule, setRule] = useState(
    () => findRule(readStoredRuleId()) ?? defaultRule,
  )

  const selectRule = (next: FareRule) => {
    setRule(next)
    storeRuleId(next.id)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Fair Fare
        </h1>
        <p className="text-xs text-muted-foreground">
          Know the meter fare. Win the argument.
        </p>
      </header>

      <RulePicker rule={rule} onSelect={selectRule} />

      {/* Keyed so trip state resets when the city or vehicle changes. */}
      <FareCalculator key={rule.id} rule={rule} />
      <Analytics />
    </main>
  )
}
