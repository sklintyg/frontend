import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import store from '../../../store/store'
import { SrsInformationChoice } from '../../../types'
import SrsInformationChoices, { SRS_RECOMMENDATIONS_BUTTON_TEXT, SRS_STATISTICS_BUTTON_TEXT } from './SrsInformationChoices'

let onChange = () => {}

const renderComponent = () => {
  onChange = vi.fn()
  render(
    <Provider store={store}>
      <SrsInformationChoices onChange={onChange} currentChoice={SrsInformationChoice.RECOMMENDATIONS} />
    </Provider>
  )
}

describe('SRS Information Choice', () => {
  it('should render component without problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render recommendation choice', () => {
    renderComponent()
    expect(screen.getByText(SRS_RECOMMENDATIONS_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('should render statistics choice', () => {
    renderComponent()
    expect(screen.getByText(SRS_STATISTICS_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('should call on change when clicking recommendations button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText(SRS_RECOMMENDATIONS_BUTTON_TEXT))
    expect(onChange).toHaveBeenCalledWith(SrsInformationChoice.RECOMMENDATIONS)
  })

  it('should call on change when clicking statistics button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText(SRS_STATISTICS_BUTTON_TEXT))
    expect(onChange).toHaveBeenCalledWith(SrsInformationChoice.STATISTICS)
  })
})
