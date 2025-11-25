import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fakeUser } from '../../faker'
import { WebcertUserDetails } from './WebcertUserDetails'

const renderComponent = (status: 'normal' | 'notAuthorized' | 'notRegistered', editLinkEnabled: boolean) => {
  const user = fakeUser({ name: 'Test Testsson', role: 'Läkare' })
  render(
    <MemoryRouter>
      <WebcertUserDetails user={user} label="Läkare" status={status} editLinkEnabled={editLinkEnabled} />
    </MemoryRouter>
  )
}

describe('WebcertUserDetails', () => {
  describe('Normal status', () => {
    it('displays user name and role on same line', () => {
      renderComponent('normal', false)
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('- Läkare')).toBeInTheDocument()
    })

    it('displays edit link when enabled', () => {
      renderComponent('normal', true)
      expect(screen.getByRole('link', { name: /Ändra uppgifter/i })).toBeInTheDocument()
    })

    it('does not display edit link when disabled', () => {
      renderComponent('normal', false)
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })

  describe('Not authorized status', () => {
    it('displays user name and label separately', () => {
      renderComponent('notAuthorized', false)
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('Läkare')).toBeInTheDocument()
    })

    it('displays edit link with separator when enabled', () => {
      renderComponent('notAuthorized', true)
      expect(screen.getByText('|')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Ändra uppgifter/i })).toBeInTheDocument()
    })

    it('does not display edit link or separator when disabled', () => {
      renderComponent('notAuthorized', false)
      expect(screen.queryByText('|')).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })

  describe('Not registered status', () => {
    it('displays user name and label separately', () => {
      renderComponent('notRegistered', false)
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('Läkare')).toBeInTheDocument()
    })

    it('does not display edit link even when enabled', () => {
      renderComponent('notRegistered', true)
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })

    it('does not display edit link when disabled', () => {
      renderComponent('notRegistered', false)
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })
})
