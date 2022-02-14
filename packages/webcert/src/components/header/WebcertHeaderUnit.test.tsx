import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { User } from '@frontend/common'
import WebcertHeaderUnit from './WebcertHeaderUnit'

const createUserMock = ({ inactiveUnit = false } = {}): User => ({
  name: 'Test Testsson',
  role: 'Läkare',
  loggedInUnit: { unitName: 'Unit', isInactive: inactiveUnit },
  loggedInCareProvider: { unitName: 'Care provider' },
})

describe('Webcert header unit', () => {
  it('displays care provider and unit that user is logged into', (): void => {
    const spy = jest.spyOn(redux, 'useSelector')

    const mockUser: User = createUserMock()
    spy.mockReturnValue(mockUser)

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
