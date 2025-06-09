import { IDSHeader1177Admin } from '@inera/ids-react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { AboutHeaderItem } from './AboutHeaderItem'

it('Should update about dialog state when pressed', async () => {
  store.dispatch(updateShowAboutDialog(false))
  renderWithRouter(
    <IDSHeader1177Admin>
      <AboutHeaderItem />
    </IDSHeader1177Admin>
  )
  await userEvent.click(screen.getByTestId('ICON'))
  expect(store.getState().settings.showAboutDialog).toBe(true)
})
