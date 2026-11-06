import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { calculateFare } from '../fares/calculate.ts'
import { chennaiAuto as rule } from '../fares/chennai-auto.ts'
import { buildBargainScript, judge, walkAwayCeiling } from './script.ts'

const trip = { distanceKm: 8, isNight: false, waitingMinutes: 0 }
const breakdown = calculateFare(rule, trip) // ₹205
const script = (asked: number) => buildBargainScript(rule, trip, breakdown, asked)

describe('walkAwayCeiling', () => {
  it('adds ten percent and rounds up to the next ₹10', () => {
    assert.equal(walkAwayCeiling(205), 230) // 225.5 → 230
    assert.equal(walkAwayCeiling(100), 110)
    assert.equal(walkAwayCeiling(50), 60) // 55 → 60
  })
})

describe('judge', () => {
  it('grades the ask against the meter fare', () => {
    assert.equal(judge(205, 200), 'fair')
    assert.equal(judge(205, 205), 'fair')
    assert.equal(judge(205, 230), 'close')
    assert.equal(judge(205, 300), 'high')
    assert.equal(judge(205, 400), 'wild')
  })
})

describe('buildBargainScript', () => {
  it('quotes the meter fare, the ask and the ceiling in a negotiation', () => {
    const s = script(350)
    const text = s.messages.map((m) => m.text).join('\n')
    assert.equal(s.verdict, 'wild')
    assert.equal(s.ceiling, 230)
    assert.match(text, /₹350/)
    assert.match(text, /₹205/)
    assert.match(text, /₹230, final/)
    assert.match(text, /Tamil Nadu Government notification/)
    assert.match(text, /Meter podunga/)
  })

  it('reports how much extra is being asked', () => {
    const s = script(350)
    const referee = s.messages.filter((m) => m.from === 'referee')
    assert.match(referee[0].text, /₹145 extra/)
    assert.match(referee[0].text, /71%/)
  })

  it('keeps a fair ask short and sweet', () => {
    const s = script(200)
    assert.equal(s.verdict, 'fair')
    assert.ok(s.messages.length <= 3)
  })

  it('mentions the night charge only on night trips', () => {
    const night = { ...trip, isNight: true }
    const nightScript = buildBargainScript(rule, night, calculateFare(rule, night), 500)
    assert.match(nightScript.messages.map((m) => m.text).join(), /Night charge/)
    assert.doesNotMatch(script(350).messages.map((m) => m.text).join(), /Night charge/)
  })
})
