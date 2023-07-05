import { IDSHeader } from '@frontend/ids-react-ts'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { AboutHeaderItem } from './AboutHeaderItem'

it('Should update about dialog state when pressed', async () => {
  store.dispatch(updateShowAboutDialog(false))
  renderWithRouter(
    <IDSHeader>
      <AboutHeaderItem />
    </IDSHeader>
  )
  await userEvent.click(screen.getByRole('button'))
  expect(store.getState().settings.showAboutDialog).toBe(true)
})
