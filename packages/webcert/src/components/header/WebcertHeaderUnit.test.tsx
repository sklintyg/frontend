import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { Unit, User, UserStatistics } from '@frontend/common'
import WebcertHeaderUnit from './WebcertHeaderUnit'

const createUserMock = ({ inactiveUnit = false } = {}): User =>
  ({
    name: 'Test Testsson',
    role: 'Läkare',
    loggedInUnit: { unitId: 'unit', unitName: 'Unit', isInactive: inactiveUnit } as Unit,
    loggedInCareProvider: { unitName: 'Care provider' } as Unit,
  } as User)

const createUserStatisticsMock = (): UserStatistics => ({
  nbrOfDraftsOnSelectedUnit: 5,
  nbrOfUnhandledQuestionsOnSelectedUnit: 12,
  totalDraftsAndUnhandledQuestionsOnOtherUnits: 23,
  unitStatistics: {
    '1234a': {
      draftsOnUnit: 3,
      questionsOnUnit: 1,
      draftsOnSubUnits: 0,
      questionsOnSubUnits: 2,
    },
  },
})

describe('Webcert header unit', () => {
  it('displays care provider and unit that user is logged into', (): void => {
    const spy = jest.spyOn(redux, 'useSelector')

    const mockUser: User = createUserMock()
    const mockSomething: UserStatistics = createUserStatisticsMock()
    spy.mockReturnValue(mockUser)
    spy.mockReturnValue(mockSomething)

    render(<WebcertHeaderUnit />)

    expect(screen.getByText(/Unit/i)).toBeInTheDocument()
    expect(screen.getByText(/Care provider/i)).toBeInTheDocument()
  })

  describe('Inactive unit', () => {
    it('should not display inactive message for active unit', (): void => {
      const spy = jest.spyOn(redux, 'useSelector')

      const mockUser: User = createUserMock()
      spy.mockReturnValue(mockUser)

      render(<WebcertHeaderUnit />)
      expect(screen.queryByText(/Inaktiv enhet/i)).not.toBeInTheDocument()
    })

    it('should display inactive message for inactive unit', (): void => {
      const spy = jest.spyOn(redux, 'useSelector')

      const mockUser: User = createUserMock({ inactiveUnit: true })
      spy.mockReturnValue(mockUser)

      render(<WebcertHeaderUnit />)
      expect(screen.getByText(/Inaktiv enhet/i)).toBeInTheDocument()
    })
  })
})
