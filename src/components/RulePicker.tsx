import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  cities,
  findRuleFor,
  rulesForCity,
  vehicleTypes,
  type FareRule,
  type VehicleType,
} from '@/fares'

interface RulePickerProps {
  rule: FareRule
  onSelect: (rule: FareRule) => void
}

/** City and vehicle pickers. Only combinations with a fare rule are offered. */
export function RulePicker({ rule, onSelect }: RulePickerProps) {
  const vehicles = rulesForCity(rule.city).map((r) => r.vehicle)

  const selectCity = (city: string) => {
    // Keep the vehicle if the new city has it, else fall back to its first.
    const next = findRuleFor(city, rule.vehicle) ?? rulesForCity(city)[0]
    if (next) onSelect(next)
  }

  const selectVehicle = (vehicle: string) => {
    const next = findRuleFor(rule.city, vehicle as VehicleType)
    if (next) onSelect(next)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="city">City</Label>
        <Select value={rule.city} onValueChange={selectCity}>
          <SelectTrigger id="city" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities().map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="vehicle">Vehicle</Label>
        <Select value={rule.vehicle} onValueChange={selectVehicle}>
          <SelectTrigger id="vehicle" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle} value={vehicle}>
                {vehicleTypes[vehicle].emoji} {vehicleTypes[vehicle].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
