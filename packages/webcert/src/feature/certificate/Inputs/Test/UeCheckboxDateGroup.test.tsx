import React from 'react'
import '@testing-library/jest-dom'
import { format } from 'date-fns'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'
import UeCheckboxDateGroup from '../UeCheckboxDateGroup'

const _format = 'yyyy-MM-dd'
const DATE_CHECKBOXES = [
  {
    id: 'undersokningAvPatienten',
    label: 'min undersökning av patienten',
  },
  {
    id: 'telefonkontaktMedPatienten',
    label: 'min telefonkontakt med patienten',
  },
  {
    id: 'journaluppgifter',
    label: 'journaluppgifter från den',
  },
  {
    id: 'annatGrundForMU',
    label: 'annat',
  },
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
  value: { type: CertificateDataValueType.DATE_LIST, list: [] },
  config: {
    text: '',
    list: DATE_CHECKBOXES,
    description: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
  },
}

const renderComponent = () => {
  render(
    <>
      <UeCheckboxDateGroup question={question} disabled={false} />
    </>
  )
}

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
useDispatchSpy.mockReturnValue(jest.fn())
useSelectorSpy.mockReturnValue(jest.fn())

const testClick = (label: boolean) => {
  const checkboxes = screen.queryAllByRole('checkbox')
  const inputs = screen.queryAllByRole('textbox')
  let clickable
  expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
  expect(inputs).toHaveLength(DATE_CHECKBOXES.length)
  checkboxes.forEach((checkbox: any, index: number) => {
    if (label) {
      clickable = screen.queryByText(DATE_CHECKBOXES[index].label)
    } else {
      clickable = checkbox
    }

    expect(clickable).not.toBeNull()
    expect(checkbox).not.toBeNull()
    expect(inputs[index]).not.toBeNull()

    expect(checkbox).not.toBeChecked()
    expect(inputs[index]).toHaveValue('')
    userEvent.click(clickable)
    expect(checkbox).toBeChecked()
    expect(inputs[index]).toHaveValue(format(new Date(), _format))
    userEvent.click(clickable)
    expect(checkbox).not.toBeChecked()
    expect(inputs[index]).toHaveValue('')
  })
}

describe('CheckboxDateGroup component', () => {
  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all components with correct default values & labels', () => {
    renderComponent()
    const checkboxes = screen.queryAllByRole('checkbox')
    const inputs = screen.queryAllByRole('textbox')
    expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
    expect(inputs).toHaveLength(DATE_CHECKBOXES.length)
    checkboxes.forEach((c: any, index: number) => {
      expect(screen.queryByText(DATE_CHECKBOXES[index].label)).not.toBeNull()
      expect(c).not.toBeDisabled()
      expect(inputs[index]).not.toBeDisabled()
      expect(c).not.toBeChecked()
      expect(inputs[index]).toHaveValue('')
    })
  })

  it('checks checkbox and sets date when user clicks on checkbox', () => {
    renderComponent()
    testClick(false)
  })

  it('checks checkbox and sets date when user clicks on label', () => {
    renderComponent()
    testClick(true)
  })

  it('checks checkbox if user writes date', () => {
    renderComponent()
    const inputString = 'Hello, World!'
    const inputDate = '20200202'
    const index = 2
    const secondIndex = 0
    const checkboxes = screen.queryAllByRole('checkbox')
    const inputs = screen.queryAllByRole('textbox')
    expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
    expect(inputs).toHaveLength(DATE_CHECKBOXES.length)
    userEvent.type(inputs[index], inputString)
    checkboxes.forEach((c: HTMLInputElement, i: number) => {
      if (i === index) {
        expect(c).toBeChecked()
        expect(inputs[i]).toHaveValue(inputString)
      } else {
        expect(c).not.toBeChecked()
        expect(inputs[i]).toHaveValue('')
      }
    })
    userEvent.type(inputs[secondIndex], inputDate)
    expect(checkboxes[index]).toBeChecked()
    expect(checkboxes[secondIndex]).toBeChecked()
    expect(inputs[index]).toHaveValue(inputString)
    expect(inputs[secondIndex]).toHaveValue(inputDate)
  })
})
