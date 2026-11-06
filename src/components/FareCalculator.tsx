import { useState } from 'react'
import { AggregatorNote } from '@/components/AggregatorNote'
import { BargainChat } from '@/components/BargainChat'
import { FareResult } from '@/components/FareResult'
import { SourceNote } from '@/components/SourceNote'
import { TripForm } from '@/components/TripForm'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculateFare, isNightHour, type FareRule, type TripInput } from '@/fares'

interface FareCalculatorProps {
  rule: FareRule
}

export function FareCalculator({ rule }: FareCalculatorProps) {
  const [trip, setTrip] = useState<TripInput>(() => ({
    distanceKm: 0,
    isNight: isNightHour(rule, new Date().getHours()),
    waitingMinutes: 0,
  }))

  const hasDistance = trip.distanceKm > 0
  const breakdown = calculateFare(rule, trip)

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-5">
        <TripForm rule={rule} trip={trip} onChange={setTrip} />

        {hasDistance && (
          <>
            <div className="rounded-lg bg-muted/60 p-4">
              <FareResult breakdown={breakdown} />
            </div>

            <Tabs defaultValue="bargain" className="gap-4">
              <TabsList className="w-full">
                <TabsTrigger value="bargain">Driver asking extra?</TabsTrigger>
                <TabsTrigger value="apps">Booking via app?</TabsTrigger>
              </TabsList>
              <TabsContent value="bargain">
                <BargainChat rule={rule} trip={trip} breakdown={breakdown} />
              </TabsContent>
              <TabsContent value="apps">
                <AggregatorNote meterFare={breakdown.total} />
              </TabsContent>
            </Tabs>
          </>
        )}

        <SourceNote rule={rule} />
      </CardContent>
    </Card>
  )
}
