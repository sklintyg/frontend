import { expect, it, describe } from 'vitest'
import { getGenderText } from './statisticsUtils'
import { Gender } from '../../schemas/patientSchema'

describe('Statistics utils', () => {
  it('should return male text', () => {
    expect(getGenderText(Gender.M)).toEqual('för män')
  })

  it('should return female text', () => {
    expect(getGenderText(Gender.F)).toEqual('för kvinnor')
  })
})
