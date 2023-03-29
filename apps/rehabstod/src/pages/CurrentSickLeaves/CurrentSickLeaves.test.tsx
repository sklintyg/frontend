import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CURRENT_SICK_LEAVES_TITLE, CurrentSickLeaves } from './CurrentSickLeaves'
import { CURRENT_SICK_LEAVES_TABLE_HEADERS } from '../../utils/listUtils'
import { store } from '../../store/store'

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Provider store={store}>
        <CurrentSickLeaves />
      </Provider>
    </MemoryRouter>
  )

describe.skip('CurrentSickLeaves', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    expect(screen.getByText(CURRENT_SICK_LEAVES_TITLE)).toBeInTheDocument()
  })

  it.skip('should show sub title', () => {
    expect(screen.getByText('ENHETSNAMN')).toBeInTheDocument()
  })

  it.each(CURRENT_SICK_LEAVES_TABLE_HEADERS)('should show table headers', (header) => {
    expect(screen.getByText(header)).toBeInTheDocument()
  })
})
