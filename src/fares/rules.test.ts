import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fareRules, vehicleTypes } from './index.ts'

/**
 * Sanity checks for every registered rule, so a typo in a data file is
 * caught by `npm test` before it reaches a traveller.
 */
const isIsoDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))

describe('fare rules registry', () => {
  it('has at least one rule with unique ids', () => {
    assert.ok(fareRules.length > 0)
    const ids = fareRules.map((rule) => rule.id)
    assert.equal(new Set(ids).size, ids.length, 'duplicate rule id')
  })

  it('has at most one rule per city + vehicle', () => {
    const keys = fareRules.map((rule) => `${rule.city}/${rule.vehicle}`)
    assert.equal(new Set(keys).size, keys.length, 'duplicate city + vehicle')
  })

  for (const rule of fareRules) {
    describe(rule.id, () => {
      it('uses a url-safe id', () => {
        assert.match(rule.id, /^[a-z0-9]+(-[a-z0-9]+)*$/)
      })

      it('names a known vehicle type', () => {
        assert.ok(rule.vehicle in vehicleTypes, `unknown vehicle "${rule.vehicle}"`)
      })

      it('has positive fare numbers', () => {
        assert.ok(rule.minimumFare > 0)
        assert.ok(rule.baseDistanceKm > 0)
        assert.ok(rule.perKmAfterBase > 0)
        if (rule.waitingPerMinute !== undefined) {
          assert.ok(rule.waitingPerMinute > 0)
        }
      })

      it('has a sane night window', () => {
        assert.ok(rule.night.multiplier >= 1)
        for (const hour of [rule.night.startHour, rule.night.endHour]) {
          assert.ok(Number.isInteger(hour) && hour >= 0 && hour <= 23)
        }
      })

      it('records a verifiable source', () => {
        const { source } = rule
        assert.ok(source.authority.trim().length > 0)
        assert.ok(source.title.trim().length > 0)
        assert.match(source.url, /^https:\/\//)
        assert.ok(isIsoDate(source.notifiedOn), 'notifiedOn must be YYYY-MM-DD')
        assert.ok(isIsoDate(source.verifiedOn), 'verifiedOn must be YYYY-MM-DD')
        assert.ok(
          source.verifiedOn >= source.notifiedOn,
          'verifiedOn must not be before notifiedOn',
        )
        assert.ok(
          Date.parse(source.verifiedOn) <= Date.now(),
          'verifiedOn must not be in the future',
        )
      })
    })
  }
})
