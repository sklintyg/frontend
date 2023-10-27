import { CertificateDataElement, CertificateDataValueType, ConfigUeRadioBoolean, ValueBoolean } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import UeRadio from './UeRadio'

it('displays two radio buttons that toggle checked mode correctly', async () => {
  const mockQuestion = {
    value: {
      type: CertificateDataValueType.BOOLEAN,
      selected: true,
      id: 'test',
    } as ValueBoolean,
    config: {
      id: 'test',
      selectedText: 'ja',
      unselectedText: 'nej',
    } as ConfigUeRadioBoolean,
  } as unknown as CertificateDataElement

  renderWithStore(<UeRadio disabled={false} question={mockQuestion} />)

  const radioButton = screen.getByLabelText('ja')
  await userEvent.click(radioButton)

  expect(radioButton).toBeChecked()
  expect(screen.getByRole('radio', { name: 'nej' })).not.toBeChecked()
})
