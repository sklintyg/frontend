import React from 'react'
import { render, screen } from '@testing-library/react'
import WebcertHeaderUser from './WebcertHeaderUser'
import * as redux from 'react-redux'
import { User } from '@frontend/common'

it('displays users name and role', (): void => {
  const spy = jest.spyOn(redux, 'useSelector')

  // @ts-expect-error: We don't need to fill the whole object with data
  const mockUser: User = {
    name: 'Test Testsson',
    role: 'Läkare',
  }
  spy.mockReturnValue(mockUser)

  render(<WebcertHeaderUser />)
  screen.getByText(/Test Testsson/i)
  screen.getByText(/Läkare/i)
})
