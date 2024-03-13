import { fc, test } from '@fast-check/vitest'
import { expect } from 'vitest'
import { groupBy } from './groupBy'

function uniqueFromList(list: string[]) {
  return [...new Set(list)]
}

test.prop([
  fc.array(
    fc.record({
      group: fc.string(),
    })
  ),
])('Should have the expected number of keys', (list) => {
  const expected = uniqueFromList(list.map((item) => item.group.toString())).length
  expect(Object.keys(groupBy(list, (item) => item.group)).length).toBe(expected)
})

test.prop([
  fc.array(
    fc.record({
      group: fc.date(),
    })
  ),
])('Should support grouping on dates', (list) => {
  const expected = uniqueFromList(list.map((item) => item.group.toString())).length
  expect(Object.keys(groupBy(list, (item) => item.group)).length).toBe(expected)
})

test.prop([
  fc.array(
    fc.record({
      group: fc.integer(),
    })
  ),
])('Should support grouping on number', (list) => {
  const expected = uniqueFromList(list.map((item) => item.group.toString())).length
  expect(Object.keys(groupBy(list, (item) => item.group)).length).toBe(expected)
})
