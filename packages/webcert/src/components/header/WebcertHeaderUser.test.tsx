import React from 'react'
import { render, screen } from '@testing-library/react'
import WebcertHeaderUser from './WebcertHeaderUser'
import * as redux from 'react-redux'
import { User } from '@frontend/common'

it('displays users name and role', (): void => {
  const spy = jest.spyOn(redux, 'useSelector')

  const mockUser: User = {
    name: 'Test Testsson',
    role: 'Läkare',
  }
  spy.mockReturnValue(mockUser)

  render(<WebcertHeaderUser />)
  expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
  expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
})
