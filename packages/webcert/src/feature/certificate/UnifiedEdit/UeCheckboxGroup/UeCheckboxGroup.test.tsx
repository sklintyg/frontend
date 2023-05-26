import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import UeCheckboxGroup from './UeCheckboxGroup'

const CHECKBOXES = [
  { label: 'Checkbox1', id: 'Checkbox_1' },
  { label: 'Checkbox-2', id: 'Checkbox_2' },
  { label: 'Checkbox 3', id: 'Checkbox_3' },
]

const question: CertificateDataElement = {
  id: 'checkbox',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.CODE_LIST, list: [] },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
    list: CHECKBOXES,
  },
}

const renderDefaultComponent = () => {
  renderWithStore(<UeCheckboxGroup question={question} disabled={false} />)
}

describe('Checkbox group component', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('disables correctly all checkboxes', () => {
    renderWithStore(<UeCheckboxGroup question={question} disabled={true} />)
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(CHECKBOXES.length)
    checkboxes.forEach((c) => expect(c).toBeDisabled())
  })

  it.each(CHECKBOXES)('allows user to check and uncheck checkbox $label by clicking on label', async ({ label }) => {
    renderDefaultComponent()
    expect(screen.getByRole('checkbox', { name: label })).not.toBeChecked()
    expect(screen.getByText(label)).not.toBeNull()
    await userEvent.click(screen.getByText(label))
    expect(screen.getByRole('checkbox', { name: label })).toBeChecked()
  })
})
