import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateServiceAvailability } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { withRouter } from '../../utils/withRouter'
import { SessionEnded } from './SessionEnded'

it('Should render as expected', () => {
  const { container } = render(<Provider store={store}>{withRouter(<SessionEnded />)}</Provider>)
  expect(screen.getByRole('heading', { level: 1, name: 'Du är utloggad' })).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it('Should display unavailable service error', () => {
  store.dispatch(updateServiceAvailability({ ...new Error('unavailable'), id: '152336e7-41a5-4ef7-abae-c2663c143591' }))
  const { container } = render(<Provider store={store}>{withRouter(<SessionEnded />)}</Provider>)
  expect(screen.getByRole('heading', { level: 1, name: 'Tjänsten är inte tillgänglig just nu' })).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
