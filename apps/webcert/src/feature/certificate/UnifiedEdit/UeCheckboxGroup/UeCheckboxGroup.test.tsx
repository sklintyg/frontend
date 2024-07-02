import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import { fakeCertificateConfig } from '../../../../faker'
import type { CertificateDataElement } from '../../../../types'
import { CertificateDataValueType } from '../../../../types'
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
  config: fakeCertificateConfig.checkboxMultipleCodes({
    text: '',
    description: '',
    list: CHECKBOXES,
  }),
}

const renderDefaultComponent = () => {
  render(<UeCheckboxGroup question={question} disabled={false} />)
}

beforeEach(() => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
  useSelectorSpy.mockReturnValue(vi.fn())
})

describe('Checkbox group component', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it.each(CHECKBOXES.map(({ label }) => label))('Disable checbox for option %s', async (label) => {
    render(<UeCheckboxGroup question={question} disabled />)
    await expect(screen.getByRole('checkbox', { name: label })).toBeDisabled()
  })

  it.each(CHECKBOXES.map(({ label }) => label))('allows user to check and uncheck checkbox for option %s', async (label) => {
    renderDefaultComponent()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(CHECKBOXES.length)
    await expect(screen.getByRole('checkbox', { name: label })).toBeEnabled()
    await expect(screen.getByRole('checkbox', { name: label })).not.toBeChecked()
    await userEvent.click(screen.getByRole('checkbox', { name: label }))
    await expect(screen.getByRole('checkbox', { name: label })).toBeChecked()
  })

  it.each(CHECKBOXES.map(({ label }) => label))('allows user to check and uncheck checkboxes by clicking on label %s', async (label) => {
    renderDefaultComponent()
    await expect(screen.getByRole('checkbox', { name: label })).not.toBeChecked()
    expect(screen.getByText(label)).toBeInTheDocument()
    await userEvent.click(screen.getByText(label))
    await expect(screen.getByRole('checkbox', { name: label })).toBeChecked()
  })
})
