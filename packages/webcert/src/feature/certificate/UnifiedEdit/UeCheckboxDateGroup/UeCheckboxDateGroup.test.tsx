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
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { vi } from 'vitest'
import { hideValidationErrors, showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getQuestion } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeCheckboxDateGroup from './UeCheckboxDateGroup'

let testStore: EnhancedStore
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
    <Provider store={testStore}>
      <ComponentTestWrapper disabled={disabled} />
    </Provider>
  )
}

describe('CheckboxDateGroup component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
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

  it.each(DATE_CHECKBOXES)('Render checkbox $label', ({ label }) => {
    renderComponent(false)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('Should disable options past max date', async () => {
    testStore.dispatch(
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

    await userEvent.click(screen.getByLabelText('Öppna kalendern'))

    expect(screen.getAllByLabelText(/Not available .* februari 2023/)).toHaveLength(11)
  })

  describe('disables component correctly', () => {
    it('disables all checkboxes when disabled is set', () => {
      renderComponent(true)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled()
      })
    })

    it('disables all textboxes when disabled is set', () => {
      renderComponent(true)
      const textboxes = screen.getAllByRole('textbox')
      expect(textboxes).toHaveLength(DATE_CHECKBOXES.length)
      textboxes.forEach((textbox) => {
        expect(textbox).toBeDisabled()
      })
    })

    it('disables all buttons when disabled is set', () => {
      renderComponent(true)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(DATE_CHECKBOXES.length)
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('does not disable all checkboxes when disabled is not set', () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled()
      })
    })

    it('does not disable all textboxes when disabled is not set', () => {
      renderComponent(false)
      const textboxes = screen.getAllByRole('textbox')
      expect(textboxes).toHaveLength(DATE_CHECKBOXES.length)
      textboxes.forEach((textbox) => {
        expect(textbox).not.toBeDisabled()
      })
    })

    it('does not disable all buttons when disabled is not set', () => {
      renderComponent(false)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(DATE_CHECKBOXES.length)
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('default values', () => {
    it('sets correct default values for all checkboxes', () => {
      renderComponent(true)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked()
      })
    })

    it('sets correct default values for all textboxes', () => {
      renderComponent(true)
      const textboxes = screen.getAllByRole('textbox')
      expect(textboxes).toHaveLength(DATE_CHECKBOXES.length)
      textboxes.forEach((textbox) => {
        expect(textbox).toHaveValue('')
      })
    })
  })

  describe('input values', () => {
    it('checks checkbox and sets date when user clicks on checkbox', async () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      expect(checkboxes).toHaveLength(DATE_CHECKBOXES.length)
      await Promise.all(
        checkboxes.map(async (checkbox, index) => {
          await userEvent.click(checkbox)
          expect(checkbox).toBeChecked()
          expect(textboxes[index]).toHaveValue(format(new Date(), _format))
        })
      )
    })

    it('checks checkbox and sets date when user clicks on label', async () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      await Promise.all(
        checkboxes.map(async (checkbox, index) => {
          const label = screen.getByText(DATE_CHECKBOXES[index].label)
          await userEvent.click(label)
          expect(checkbox).toBeChecked()
          expect(textboxes[index]).toHaveValue(format(new Date(), _format))
        })
      )
    })

    it.each(DATE_CHECKBOXES)('checks checkbox $label and sets date if user writes date', async ({ label, id }) => {
      renderComponent(false)
      const checkbox = screen.getByRole('checkbox', { name: label })
      const textbox = screen.getByTestId(`checkbox_${id}`)
      await userEvent.type(textbox, '2020-02-02')
      expect(checkbox).toBeChecked()
      expect(textbox).toHaveValue('2020-02-02')
    })

    it('only checks one checkbox and sets one value when clicking on label', async () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      const label = screen.getByText(DATE_CHECKBOXES[0].label)
      await userEvent.click(label)
      expect(checkboxes[1]).not.toBeChecked()
      expect(textboxes[1]).toHaveValue('')
      expect(checkboxes[2]).not.toBeChecked()
      expect(textboxes[2]).toHaveValue('')
    })

    it('only checks one checkbox and sets one value when clicking on checkbox', async () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      await userEvent.click(checkboxes[1])
      expect(checkboxes[0]).not.toBeChecked()
      expect(textboxes[0]).toHaveValue('')
      expect(checkboxes[2]).not.toBeChecked()
      expect(textboxes[2]).toHaveValue('')
    })

    it('only checks one checkbox and sets one value when typing in textbox', async () => {
      renderComponent(false)
      const checkboxes = screen.getAllByRole('checkbox')
      const textboxes = screen.getAllByRole('textbox')
      await userEvent.type(textboxes[2], 'test')
      expect(checkboxes[0]).not.toBeChecked()
      expect(textboxes[0]).toHaveValue('')
      expect(checkboxes[1]).not.toBeChecked()
      expect(textboxes[1]).toHaveValue('')
    })
  })

  it('renders validation message when there is a validation error', () => {
    testStore.dispatch(showValidationErrors())
    renderComponent(false)
    screen.debug()
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
    testStore.dispatch(hideValidationErrors())
  })

  it('does not render validation message if validation messages are hidden', () => {
    renderComponent(false)
    expect(screen.queryByText(VALIDATION_ERROR)).not.toBeInTheDocument()
  })

  describe.skip('dispatching updated values', () => {
    it('should update question values as expected', async () => {
      vi.useFakeTimers().setSystemTime(new Date('2022-09-15'))

      renderComponent(false)

      await userEvent.click(screen.getByText(DATE_CHECKBOXES[0].label))

      expect(getQuestion(QUESTION_ID)(testStore.getState())?.value).toMatchObject({
        list: [{ date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' }],
      })

      await userEvent.click(screen.getByText(DATE_CHECKBOXES[1].label))

      expect(getQuestion(QUESTION_ID)(testStore.getState())?.value).toMatchObject({
        list: [
          { date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' },
          { date: '2022-09-15', id: 'telefonkontaktMedPatienten', type: 'DATE' },
        ],
      })

      userEvent.click(screen.getByText(DATE_CHECKBOXES[1].label))

      expect(getQuestion(QUESTION_ID)(testStore.getState())?.value).toMatchObject({
        list: [{ date: '2022-09-15', id: 'undersokningAvPatienten', type: 'DATE' }],
      })
    })
  })
})
