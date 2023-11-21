import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../../store/store'
import { ReadMoreAboutAction } from './ReadMoreAboutAction'
import userEvent from '@testing-library/user-event'

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
    await userEvent.click(screen.getAllByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' })[0])
    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'true')
  })

  it('Should be able to close dialog with button', async () => {
    renderComponent()
    await userEvent.click(screen.getAllByRole('button', { name: 'Läs mer om vad du kan göra i Intyg' })[0])
    await userEvent.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'false')
  })
})
