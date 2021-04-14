import { getValidDate } from '@frontend/common'

describe('Date utils tests', () => {
  it('get valid date with valid dashes string', () => {
    const validDateStringDashes = '2021-04-08'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeTruthy()
  })

  it('get valid date without dashes string', () => {
    const validDateString = '20210408'
    const date = getValidDate(validDateString)
    console.log(date)
    expect(date).toBeTruthy()
  })
})
