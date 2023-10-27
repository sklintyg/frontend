import { getTableSorter } from './getTableSorter'

it('Should sort a list of objects', () => {
  const sorter = getTableSorter('a', false)
  const list = [{ column: 'a' }, { column: 'c' }, { column: 'b' }]

  expect(sorter(list, (_, data) => data.column)).toEqual([{ column: 'c' }, { column: 'b' }, { column: 'a' }])
})

it('Should sort list of objects in ascending order', () => {
  const sorter = getTableSorter('a', true)
  const list = [{ column: 'a' }, { column: 'c' }, { column: 'b' }]

  expect(sorter(list, (_, data) => data.column)).toEqual([{ column: 'a' }, { column: 'b' }, { column: 'c' }])
})
