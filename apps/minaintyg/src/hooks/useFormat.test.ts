import { useFormat } from './useFormat'

it('Should format date', () => {
  const { date } = useFormat()
  expect(date('2023-09-06T11:00:00.000Z')).toBe('2023-09-06')
})

it('Should format time', () => {
  const { time } = useFormat()
  expect(time('2023-09-06T11:00:00.000Z')).toBe('11:00')
})

it('Should format datetime', () => {
  const { datetime } = useFormat()
  expect(datetime('2023-09-06T11:00:00.000Z')).toBe('2023-09-06 11:00')
})
