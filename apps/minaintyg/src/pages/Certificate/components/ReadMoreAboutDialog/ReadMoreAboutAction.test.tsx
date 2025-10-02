import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '../../../../store/store'
import { ReadMoreAboutAction } from './ReadMoreAboutAction'

function renderComponent() {
  return render(
    <Provider store={store}>
      <ReadMoreAboutAction />
    </Provider>
  )
}

describe('READ_MORE_DIALOG', () => {
  it('Should be able to open dialog', async () => {
    renderComponent()
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-open', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' }))
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveAttribute('data-open', 'true'))
  })

  it('Should be able to close dialog with button', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' }))
    await userEvent.click(screen.getByTestId('close-btn'))
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveAttribute('data-open', 'false'))
  })
})
