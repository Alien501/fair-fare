import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { FareRule, TripInput } from '@/fares'

interface TripFormProps {
  rule: FareRule
  trip: TripInput
  onChange: (trip: TripInput) => void
}

const formatHour = (hour: number) =>
  `${hour % 12 || 12} ${hour < 12 ? 'am' : 'pm'}`

export function TripForm({ rule, trip, onChange }: TripFormProps) {
  const update = (patch: Partial<TripInput>) => onChange({ ...trip, ...patch })
  const hasWaiting = rule.waitingPerMinute !== undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="distance">Distance from your maps app (km)</Label>
        <Input
          id="distance"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          placeholder="e.g. 6.5"
          autoFocus
          className="h-12 text-xl"
          value={trip.distanceKm || ''}
          onChange={(e) => update({ distanceKm: Number(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="night">Night</Label>
            <span className="text-[11px] leading-tight text-muted-foreground">
              {formatHour(rule.night.startHour)}–{formatHour(rule.night.endHour)},
              ×{rule.night.multiplier}
            </span>
          </div>
          <Switch
            id="night"
            checked={trip.isNight}
            onCheckedChange={(isNight) => update({ isNight })}
          />
        </div>

        {hasWaiting && (
          <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
            <Label htmlFor="waiting" className="flex-col items-start gap-0.5">
              Waiting
              <span className="text-[11px] font-normal leading-tight text-muted-foreground">
                ₹{rule.waitingPerMinute}/min
              </span>
            </Label>
            <Input
              id="waiting"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="0"
              className="h-8 w-16 text-center"
              value={trip.waitingMinutes || ''}
              onChange={(e) => update({ waitingMinutes: Number(e.target.value) })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
