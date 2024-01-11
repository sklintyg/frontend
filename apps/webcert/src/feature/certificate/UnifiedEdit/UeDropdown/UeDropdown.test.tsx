import { CertificateDataElement, ConfigTypes, fakeCertificateConfig, fakeCertificateValue } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { expect, it, describe, vi, beforeEach } from 'vitest'
import UeDropdown from './UeDropdown'

const OPTIONS = [
  { label: 'Option1', id: 'Option_1' },
  { label: 'Option-2', id: 'Option_2' },
  { label: 'Option 3', id: 'Option_3' },
]

const LABEL = 'Example label'

const question: CertificateDataElement = {
  id: 'dropdown',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: fakeCertificateValue.code(),
  config: fakeCertificateConfig.dropdown({
    text: '',
    description: '',
    type: ConfigTypes.UE_DROPDOWN,
    list: OPTIONS,
    label: LABEL,
  }),
}

const renderComponent = () => {
  render(<UeDropdown question={question} disabled={false} />)
}

beforeEach(() => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
  useSelectorSpy.mockReturnValue(vi.fn())
})

describe('Dropdown component', () => {
  it('renders label and all options', () => {
    renderComponent()
    expect(screen.getByText(LABEL)).toBeInTheDocument()
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeEnabled()
    expect(dropdown).toBeInTheDocument()
    const options = screen.queryAllByRole('option')
    expect(options).toHaveLength(OPTIONS.length)
  })

  it('sets label and id correctly for all options', () => {
    renderComponent()
    const options = screen.queryAllByRole('option') as HTMLOptionElement[]
    expect(options).toHaveLength(OPTIONS.length)
    options.forEach((option: HTMLOptionElement, key: number) => {
      expect(option.label === OPTIONS[key].label).toBeTruthy()
      expect(option.value === OPTIONS[key].id).toBeTruthy()
    })
  })

  it('lets user choose option', async () => {
    renderComponent()
    const dropdown = screen.getByRole('combobox')
    const options = screen.queryAllByRole('option') as HTMLOptionElement[]
    expect(dropdown).toHaveValue(OPTIONS[0].id)
    expect(options[0].selected).toBeTruthy()
    expect(options[1].selected).toBeFalsy()
    await userEvent.click(dropdown)
    await userEvent.selectOptions(dropdown, OPTIONS[1].id)
    expect(dropdown).toHaveValue(OPTIONS[1].id)
    expect(options[1].selected).toBeTruthy()
    expect(options[0].selected).toBeFalsy()
  })

  it('gets disabled correctly', () => {
    render(<UeDropdown question={question} disabled />)
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeDisabled()
  })
})
