import React from 'react'
import { render, screen } from '@testing-library/react'
import WebcertHeaderUser from './WebcertHeaderUser'
import * as redux from 'react-redux'
import { User } from '@frontend/common/src'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import store from '../../store/store'

const setup = (protectedPerson: boolean, approvedTerms?: string) => {
  const spy = jest.spyOn(redux, 'useSelector')

  const mockUser: User = ({
    name: 'Test Testsson',
    role: 'Läkare',
    protectedPerson: protectedPerson,
    preferences: { 'wc.vardperson.sekretess.approved': approvedTerms ? approvedTerms : '' },
  } as unknown) as User
  spy.mockReturnValue(mockUser)
}

const renderComponent = () => {
  render(
    <Provider store={store}>
      <WebcertHeaderUser />
    </Provider>
  )
}

describe('WebcertHeaderUser', () => {
  it('displays user role', () => {
    setup(false)
    renderComponent()
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('displays users name and role', (): void => {
    setup(false)
    renderComponent()
    expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('should not show protected person link', (): void => {
    setup(false)
    renderComponent()
    expect(screen.queryByText(/Skyddade personuppgifter/i)).not.toBeInTheDocument()
  })

  it('should show protected person modal if approval is not saved in preferences', (): void => {
    setup(true)
    renderComponent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Du har skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should show protected person link when approval modal is closed', (): void => {
    setup(true)
    renderComponent()
    userEvent.click(screen.getByRole('checkbox'))
    userEvent.click(screen.getByText('Till Webcert'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should not show protected person modal if approval is saved in preferences', (): void => {
    setup(true, 'true')
    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText(/Du har skyddade personuppgifter/i)).not.toBeInTheDocument()
  })

  it('should show protected person link when approval modal is closed', (): void => {
    setup(true, 'true')
    renderComponent()
    expect(screen.getByText(/Skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should open protected person modal when clicking on link', (): void => {
    setup(true, 'true')
    renderComponent()
    userEvent.click(screen.getByText(/Skyddade personuppgifter/i))
    expect(screen.getByText('Användning av Webcert med skyddade personuppgifter')).toBeInTheDocument()
  })
})
