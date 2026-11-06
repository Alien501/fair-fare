import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { calculateFare, isNightHour } from './calculate.ts'
import { chennaiAuto as rule } from './chennai-auto.ts'

const trip = (distanceKm: number, isNight = false, waitingMinutes = 0) =>
  calculateFare(rule, { distanceKm, isNight, waitingMinutes })

describe('calculateFare (Chennai auto)', () => {
  it('charges the minimum fare for trips within the base distance', () => {
    assert.equal(trip(0).total, 50)
    assert.equal(trip(1).total, 50)
    assert.equal(trip(1.8).total, 50)
    assert.equal(trip(1.8).lines.length, 1)
  })

  it('charges per km beyond the base distance, pro-rata', () => {
    assert.equal(trip(2.8).total, 75) // 50 + 1 × 25
    assert.equal(trip(5).total, 130) // 50 + 3.2 × 25
    assert.equal(trip(10).total, 255) // 50 + 8.2 × 25
  })

  it('applies the 1.5× night multiplier to the distance fare', () => {
    assert.equal(trip(5, true).total, 195) // 130 × 1.5
    assert.equal(trip(1, true).total, 75) // 50 × 1.5
  })

  it('adds waiting charges without the night multiplier', () => {
    assert.equal(trip(5, false, 10).total, 140) // 130 + 10
    assert.equal(trip(5, true, 10).total, 205) // 195 + 10
  })

  it('treats negative or fractional-minute inputs safely', () => {
    assert.equal(trip(-3).total, 50)
    assert.equal(trip(5, false, 2.9).total, 132)
  })

  it('rounds each line to the rupee so the breakdown adds up', () => {
    assert.equal(trip(2.01).total, 55) // 50 + round(0.21 × 25 = 5.25)
    const night = trip(6.5, true) // 50 + round(117.5) + round(83.75)
    assert.deepEqual(
      night.lines.map((l) => l.amount),
      [50, 118, 84],
    )
    assert.equal(night.total, 252)
  })
})

describe('isNightHour', () => {
  it('treats 10 pm to 5 am as night', () => {
    assert.equal(isNightHour(rule, 22), true)
    assert.equal(isNightHour(rule, 0), true)
    assert.equal(isNightHour(rule, 4), true)
    assert.equal(isNightHour(rule, 5), false)
    assert.equal(isNightHour(rule, 12), false)
    assert.equal(isNightHour(rule, 21), false)
  })
})
