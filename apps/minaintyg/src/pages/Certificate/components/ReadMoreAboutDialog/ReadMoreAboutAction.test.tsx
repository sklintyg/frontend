import { render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('dialog')).not.toHaveAttribute('show', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'true')
  })

  it('Should be able to close dialog with button', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' }))
    await userEvent.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'false')
  })
})
