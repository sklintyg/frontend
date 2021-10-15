import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { User } from '@frontend/common'
import WebcertHeaderUnit from './WebcertHeaderUnit'

describe('Webcert header unit', () => {
  it('displays care provider and unit that user is logged into', (): void => {
    const spy = jest.spyOn(redux, 'useSelector')

    const mockUser: User = {
      name: 'Test Testsson',
      role: 'Läkare',
      loggedInUnit: { unitName: 'Unit' },
      loggedInCareProvider: { unitName: 'Care provider' },
    }
    spy.mockReturnValue(mockUser)

    render(<WebcertHeaderUnit />)
    expect(screen.getByText(/Unit/i)).toBeInTheDocument()
    expect(screen.getByText(/Care provider/i)).toBeInTheDocument()
  })
})
