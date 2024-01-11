import { expect, it, describe } from 'vitest'
import { fakeUser } from './fake/fakeUser'
import { isUserDoctor } from './isUserDoctor'
import { UserUrval } from '../schemas'

describe('isUserDoctor', () => {
  it('should return true if urval is issued by me', () => {
    expect(isUserDoctor(fakeUser({ urval: UserUrval.ISSUED_BY_ME }))).toBeTruthy()
  })

  it('should return false if urval is not issued by me', () => {
    expect(isUserDoctor(fakeUser({ urval: '' }))).toBeFalsy()
  })
})
