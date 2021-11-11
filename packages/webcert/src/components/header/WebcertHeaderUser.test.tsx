import React from 'react'
import { render, screen } from '@testing-library/react'
import WebcertHeaderUser from './WebcertHeaderUser'
import * as redux from 'react-redux'
import { User } from '@frontend/common/src'
import userEvent from '@testing-library/user-event'

const setup = (protectedPerson: boolean) => {
  const spy = jest.spyOn(redux, 'useSelector')

  const mockUser: User = {
    name: 'Test Testsson',
    role: 'Läkare',
    protectedPerson: protectedPerson,
  }
  spy.mockReturnValue(mockUser)
}

describe('WebcertHeaderUser', () => {
  it('displays user role', () => {
    setup(false)
    render(<WebcertHeaderUser />)
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('displays users name and role', (): void => {
    setup(false)
    render(<WebcertHeaderUser />)
    expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('should not show protected person link', (): void => {
    setup(false)
    render(<WebcertHeaderUser />)
    expect(screen.queryByText(/Skyddade personuppgifter/i)).not.toBeInTheDocument()
  })

  it('should show protected person link', (): void => {
    setup(true)
    render(<WebcertHeaderUser />)
    expect(screen.getByText(/Skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should open protected person modal', (): void => {
    setup(true)
    render(<WebcertHeaderUser />)
    userEvent.click(screen.getByText(/Skyddade personuppgifter/i))
    expect(screen.getByText('Användning av Webcert med skyddade personuppgifter')).toBeInTheDocument()
  })
})
