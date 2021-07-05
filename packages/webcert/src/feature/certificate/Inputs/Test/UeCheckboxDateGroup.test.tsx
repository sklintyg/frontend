import React from 'react'
import '@testing-library/jest-dom'
import { format } from 'date-fns'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
} from '@frontend/common/src/types/certificate'
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

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'checkbox'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  value: { type: CertificateDataValueType.DATE_LIST, list: [] },
  config: {
    text: '',
    list: DATE_CHECKBOXES,
    description: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
  },
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: 'checkbox',
      expression: `!$undersokningAvPatienten && ($telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU)`,
    },
  ],
  validationErrors: [{ category: 'category', field: '', text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
}

const renderComponent = (disabled: boolean, isShowValidationError: boolean) => {
  render(
    <>
      <UeCheckboxDateGroup question={question} disabled={disabled} isShowValidationError={isShowValidationError} />
    </>
  )
}

const dispatchSpy = jest.fn()
beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(dispatchSpy)
  useSelectorSpy.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CheckboxDateGroup component', () => {
  it('renders without crashing', () => {
    renderComponent(false, false)
  })

  it('renders all components', () => {
    renderComponent(false, false)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DATE_CHECKBOXES.length)
    expect(screen.getAllByRole('textbox')).toHaveLength(DATE_CHECKBOXES.length)
    expect(screen.getAllByRole('button')).toHaveLength(DATE_CHECKBOXES.length)
  })

  it('renders all components with correct labels', () => {
    renderComponent(false, false)
    DATE_CHECKBOXES.forEach((checkboxDate) => {
      expect(screen.getByText(checkboxDate.label)).toBeInTheDocument()
    })
  })

  describe('disables component correctly', () => {
    it('disables all checkboxes when disabled is set', () => {
      renderComponent(true, false)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled()
      })
    })

    it('disables all textboxes when disabled is set', () => {
      renderComponent(true, false)
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).toBeDisabled()
      })
    })

    it('disables all buttons when disabled is set', () => {
      renderComponent(true, false)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('does not disable all checkboxes when disabled is not set', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled()
      })
    })

    it('does not disable all textboxes when disabled is not set', () => {
      renderComponent(false, false)
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).not.toBeDisabled()
      })
    })

    it('does not disable all buttons when disabled is not set', () => {
      renderComponent(false, false)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('default values', () => {
    it('sets correct default values for all checkboxes', () => {
      renderComponent(true, false)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked()
      })
    })

    it('sets correct default values for all textboxes', () => {
      renderComponent(true, false)
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).toHaveValue('')
      })
    })
  })

  const verifyClickOnCheckbox = (clickable: HTMLElement, checkbox: HTMLElement, textbox: HTMLElement) => {
    userEvent.click(clickable)
    expect(checkbox).toBeChecked()
    expect(textbox).toHaveValue(format(new Date(), _format))
  }

  const verifyTextInput = (textbox: HTMLElement, checkbox: HTMLElement, input: string) => {
    userEvent.type(textbox, input)
    expect(checkbox).toBeChecked()
    expect(textbox).toHaveValue(input)
  }

  const verifyValuesAreNotSet = (checkbox: HTMLElement, textbox: HTMLElement) => {
    expect(checkbox).not.toBeChecked()
    expect(textbox).toHaveValue('')
  }

  describe('input values', () => {
    it('checks checkbox and sets date when user clicks on checkbox', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      checkboxes.forEach((checkbox, index) => {
        verifyClickOnCheckbox(checkbox, checkbox, textboxes[index])
      })
    })

    it('checks checkbox and sets date when user clicks on label', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      checkboxes.forEach((checkbox, index) => {
        const label = screen.getByText(DATE_CHECKBOXES[index].label)
        verifyClickOnCheckbox(label, checkbox, textboxes[index])
      })
    })

    it('checks checkbox and sets date if user writes date', () => {
      const inputString = '2020-02-02'
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox, index) => {
        verifyTextInput(textbox, checkboxes[index], inputString)
      })
    })

    it('only checks one checkbox and sets one value when clicking on label', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      const label = screen.getByText(DATE_CHECKBOXES[0].label)
      userEvent.click(label)
      verifyValuesAreNotSet(checkboxes[1], textboxes[1])
      verifyValuesAreNotSet(checkboxes[2], textboxes[2])
    })

    it('only checks one checkbox and sets one value when clicking on checkbox', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      userEvent.click(checkboxes[1])
      verifyValuesAreNotSet(checkboxes[0], textboxes[0])
      verifyValuesAreNotSet(checkboxes[2], textboxes[2])
    })

    it('only checks one checkbox and sets one value when typing in textbox', () => {
      renderComponent(false, false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      userEvent.type(textboxes[2], 'test')
      verifyValuesAreNotSet(checkboxes[0], textboxes[0])
      verifyValuesAreNotSet(checkboxes[1], textboxes[1])
    })
  })

  it('renders one validation message when there is a validation error', () => {
    renderComponent(false, true)
    const validationMessages = screen.getAllByText(VALIDATION_ERROR)
    expect(validationMessages).toHaveLength(1)
  })

  describe('dispatching updated values', () => {
    it('does not dispatch a value that is not a correct date', () => {
      renderComponent(false, false)
      const inputs = screen.getAllByRole('textbox')
      userEvent.type(inputs[0], '2020-01')
      expect(dispatchSpy).not.toBeCalled()
    })

    it('does not dispatch a value that is a text and not a date', () => {
      renderComponent(false, false)
      const inputs = screen.getAllByRole('textbox')
      userEvent.type(inputs[1], 'test')
      expect(dispatchSpy).not.toBeCalled()
    })

    it('does dispatch a value that is a date', () => {
      renderComponent(false, false)
      const inputs = screen.getAllByRole('textbox')
      userEvent.type(inputs[2], '2021-01-01')
      expect(dispatchSpy).toBeCalled()
    })

    it('does dispatch the value set by a checkbox being checked', () => {
      renderComponent(false, false)
      const checkbox = screen.getAllByRole('checkbox')
      userEvent.click(checkbox[0])
      expect(dispatchSpy).toBeCalled()
    })
  })

  // Test below fails because of a css property (pointer-events: none;). We need to find a workaround asap.
  // Error: 'unable to click element as it has or inherits pointer-events set to "none".'

  // it('checks checkbox and sets value if user picks date', () => {
  //   renderComponent()
  //   const buttons = screen.getAllByRole('button')
  //   const checkboxes = screen.getAllByRole('checkbox')
  //   const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
  //   userEvent.click(buttons[0])
  //   expect(checkboxes[0]).not.toBeChecked()
  //   expect(inputs[0]).toHaveValue('')
  //   const date = screen.getByText('13')
  //   userEvent.click(date)
  //   expect(checkboxes[0]).toBeChecked()
  //   expect(inputs[0].value.includes('13')).toBeTruthy()
  // })
})
