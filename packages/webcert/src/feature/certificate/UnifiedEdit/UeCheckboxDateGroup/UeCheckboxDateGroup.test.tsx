import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
  fakeCertificateConfig,
  fakeCertificateValue,
  fakeCheckboxMultipleDate,
  getCertificateWithQuestion,
} from '@frontend/common'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { vi } from 'vitest'
import { hideValidationErrors, showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { getQuestion } from '../../../../store/certificate/certificateSelectors'
import store from '../../../../store/store'
import UeCheckboxDateGroup from './UeCheckboxDateGroup'

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
      questionId: QUESTION_ID,
      expression: `!$undersokningAvPatienten && ($telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU)`,
    },
  ],
  validationErrors: [{ category: 'category', field: QUESTION_ID, text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
}

const ComponentTestWrapper: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const question = useSelector(getQuestion(QUESTION_ID))
  return question ? <UeCheckboxDateGroup question={question} disabled={disabled} /> : null
}

const renderComponent = (disabled: boolean) => {
  render(
    <Provider store={store}>
      <ComponentTestWrapper disabled={disabled} />
    </Provider>
  )
}

describe('CheckboxDateGroup component', () => {
  beforeEach(() => {
    store.dispatch(updateCertificate(getCertificateWithQuestion(question)))
  })

  it('renders without crashing', () => {
    expect(() => renderComponent(false)).not.toThrow()
  })

  it('renders all components', () => {
    renderComponent(false)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DATE_CHECKBOXES.length)
    expect(screen.getAllByRole('textbox')).toHaveLength(DATE_CHECKBOXES.length)
    expect(screen.getAllByRole('button')).toHaveLength(DATE_CHECKBOXES.length)
  })

  it('renders all components with correct labels', () => {
    renderComponent(false)
    DATE_CHECKBOXES.forEach((checkboxDate) => {
      expect(screen.getByText(checkboxDate.label)).toBeInTheDocument()
    })
  })

  it('Should disable options past max date', async () => {
    store.dispatch(
      updateCertificate(
        getCertificateWithQuestion(
          fakeCheckboxMultipleDate({
            id: QUESTION_ID,
            config: fakeCertificateConfig.checkboxMultipleDate({
              list: [{ id: 'item', maxDate: '2023-02-17' }],
            }),
            value: fakeCertificateValue.dateList({
              list: [{ id: 'item', date: '2023-02-17' }],
            }),
          })[QUESTION_ID]
        )
      )
    )
    renderComponent(false)

    await act(async () => {
      userEvent.click(screen.getByLabelText('Öppna kalendern'))
    })

    expect(screen.getAllByLabelText(/Not available .* februari 2023/)).toHaveLength(11)
  })

  describe('disables component correctly', () => {
    it('disables all checkboxes when disabled is set', () => {
      renderComponent(true)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled()
      })
    })

    it('disables all textboxes when disabled is set', () => {
      renderComponent(true)
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).toBeDisabled()
      })
    })

    it('disables all buttons when disabled is set', () => {
      renderComponent(true)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('does not disable all checkboxes when disabled is not set', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled()
      })
    })

    it('does not disable all textboxes when disabled is not set', () => {
      renderComponent(false)
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).not.toBeDisabled()
      })
    })

    it('does not disable all buttons when disabled is not set', () => {
      renderComponent(false)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('default values', () => {
    it('sets correct default values for all checkboxes', () => {
      renderComponent(true)
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked()
      })
    })

    it('sets correct default values for all textboxes', () => {
      renderComponent(true)
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
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      checkboxes.forEach((checkbox, index) => {
        verifyClickOnCheckbox(checkbox, checkbox, textboxes[index])
      })
    })

    it('checks checkbox and sets date when user clicks on label', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      checkboxes.forEach((checkbox, index) => {
        const label = screen.getByText(DATE_CHECKBOXES[index].label)
        verifyClickOnCheckbox(label, checkbox, textboxes[index])
      })
    })

    it('checks checkbox and sets date if user writes date', () => {
      const inputString = '2020-02-02'
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox, index) => {
        verifyTextInput(textbox, checkboxes[index], inputString)
      })
    })

    it('only checks one checkbox and sets one value when clicking on label', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      const label = screen.getByText(DATE_CHECKBOXES[0].label)
      userEvent.click(label)
      verifyValuesAreNotSet(checkboxes[1], textboxes[1])
      verifyValuesAreNotSet(checkboxes[2], textboxes[2])
    })

    it('only checks one checkbox and sets one value when clicking on checkbox', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      userEvent.click(checkboxes[1])
      verifyValuesAreNotSet(checkboxes[0], textboxes[0])
      verifyValuesAreNotSet(checkboxes[2], textboxes[2])
    })

    it('only checks one checkbox and sets one value when typing in textbox', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      userEvent.type(textboxes[2], 'test')
      verifyValuesAreNotSet(checkboxes[0], textboxes[0])
      verifyValuesAreNotSet(checkboxes[1], textboxes[1])
    })
  })

  it('renders validation message when there is a validation error', () => {
    renderComponent(false)
    store.dispatch(showValidationErrors())
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
    store.dispatch(hideValidationErrors())
  })

  it('does not render validation message if validation messages are hidden', () => {
    renderComponent(false)
    expect(screen.queryByText(VALIDATION_ERROR)).not.toBeInTheDocument()
  })

  describe('dispatching updated values', () => {
    it('should update question values as expected', () => {
      vi.useFakeTimers().setSystemTime(new Date('2022-09-15'))

      renderComponent(false)

      userEvent.click(screen.getByText(DATE_CHECKBOXES[0].label))

      expect(getQuestion(QUESTION_ID)(store.getState())?.value).toMatchObject({
        list: [{ date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' }],
      })

      userEvent.click(screen.getByText(DATE_CHECKBOXES[1].label))

      expect(getQuestion(QUESTION_ID)(store.getState())?.value).toMatchObject({
        list: [
          { date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' },
          { date: '2022-09-15', id: 'telefonkontaktMedPatienten', type: 'DATE' },
        ],
      })

      userEvent.click(screen.getByText(DATE_CHECKBOXES[1].label))

      expect(getQuestion(QUESTION_ID)(store.getState())?.value).toMatchObject({
        list: [{ date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' }],
      })
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
