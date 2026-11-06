# Fair Fare

Government-set auto fare for a distance you type in, a bargaining chat built
from that fare, and what ride apps charge drivers. Chennai and Bengaluru autos
so far.

## Run

```sh
npm install
npm run dev
```

`npm test` runs the fare maths and data checks. `npm run build` type-checks
and builds to `dist/`.

If `npm install` fails with `EALLOWREMOTE` (npm 12 default), run
`npm install --allow-remote=all` once. The lockfile is already audited.

## Layout

```
src/fares/        fare rules (one file per city + vehicle), calculator, tests
src/bargain/      the negotiation script, pure function + tests
src/aggregators/  what Rapido / Uber / Ola charge drivers, legal fare band
src/components/   React. ui/ is shadcn.
```

## Update a fare

1. Edit the city file in `src/fares/`, e.g. `chennai-auto.ts`.
2. Set `source.notifiedOn` to the notification date and `source.verifiedOn`
   to today. Update `source.url`.
3. `npm test`

Only re-checked the numbers and nothing changed? Bump `verifiedOn` alone.

## Add a city

1. Copy `src/fares/chennai-auto.ts` to `<city>-<vehicle>.ts`.
2. Fill in the numbers from the official notification, with the link.
   Unknown waiting charge? Leave `waitingPerMinute` out; the input is hidden.
3. Add it to `fareRules` in `src/fares/index.ts`.
4. `npm test`

It appears in the city picker. `id` is stored in the browser, so don't rename
it later.

## Add a vehicle

1. Add a key to `vehicleTypes` in `src/fares/vehicles.ts`: label, emoji,
   what to call the driver.
2. Add a rule file for a city with `vehicle: '<key>'` and register it.

The vehicle picker only lists types that have a rule for the chosen city.

If a vehicle's fare has a different shape (per-minute component, tiered
per-km), extend `FareRule` and `calculateFare` with a test. Don't branch on
vehicle type in components.

## Update aggregator info

`src/aggregators/platforms.ts`. Each entry has a `source` and `verifiedOn`;
change them together.

## Assumptions

- Extra distance is pro-rated, not rounded up to the km.
- Night multiplier applies to the distance fare, not waiting.
- Each line is rounded to the rupee; the total is their sum.
- Walk-away ceiling is meter + 10%, rounded up to ₹10. Verdicts: at or
  below meter is fair, up to the ceiling is close, up to 1.5× is high,
  beyond is wild.

## Stack

Vite, React 19, TypeScript, Tailwind 4, shadcn (Radix). shadcn is used via
`npx` only; it is not a runtime dependency.
