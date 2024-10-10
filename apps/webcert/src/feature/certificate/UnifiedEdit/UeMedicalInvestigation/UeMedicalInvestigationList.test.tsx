import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeMedicalInvestigationListElement } from '../../../../faker'
import { showValidationErrors, updateCertificate, validateCertificateSuccess } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import type { ConfigUeMedicalInvestigationList } from '../../../../types'
import { UeMedicalInvestigationList } from './UeMedicalInvestigationList'

faker.seed(10)

const QUESTION_ID = 'list'

let testStore: EnhancedStore

const question = fakeMedicalInvestigationListElement({ id: QUESTION_ID })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeMedicalInvestigationList>) => {
  render(
    <Provider store={testStore}>
      <UeMedicalInvestigationList {...props} />
    </Provider>
  )
}
describe('Medical investigation component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])

    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: {
            [QUESTION_ID]: question,
          },
        })
      )
    )
  })

  it('Renders without crashing', () => {
    expect(() => renderComponent({ disabled: false, question })).not.toThrow()
  })

  it('renders all components', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getAllByLabelText('Ange utredning eller underlag')).toHaveLength(3)
    expect(screen.getAllByLabelText('Datum')).toHaveLength(3)
    expect(
      screen.getAllByLabelText('Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?')
    ).toHaveLength(3)
  })

  it('Renders textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getAllByRole('combobox')).toHaveLength(3)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('Should not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })

    expect(screen.getAllByRole('combobox')).toHaveLength(3)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)

    screen.getAllByRole('combobox').forEach(async (investigationType) => {
      await expect(investigationType).toBeEnabled()
    })

    screen.getAllByRole('button').forEach(async (button) => {
      await expect(button).toBeEnabled()
    })

    screen.getAllByRole('textbox').forEach(async (textinput) => {
      await expect(textinput).toBeEnabled()
    })
  })

  it('Should disable component if disabled is set', () => {
    renderComponent({ disabled: true, question })

    expect(screen.getAllByRole('combobox')).toHaveLength(3)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)

    screen.getAllByRole('combobox').forEach(async (investigationType) => {
      await expect(investigationType).toBeDisabled()
    })

    screen.getAllByRole('button').forEach(async (button) => {
      await expect(button).toBeDisabled()
    })

    screen.getAllByRole('textbox').forEach(async (textinput) => {
      await expect(textinput).toBeDisabled()
    })
  })

  const config = question.config as ConfigUeMedicalInvestigationList

  it.each(config.list)('Should display validation error for field information source field %#', ({ informationSourceId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: informationSourceId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should display validation error for investation field %#', ({ investigationTypeId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: investigationTypeId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should display validation error for date field %#', ({ dateId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: dateId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for information source field %#', ({ informationSourceId }) => {
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: informationSourceId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for investigation field %#', ({ investigationTypeId }) => {
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: investigationTypeId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for date field %#', ({ dateId }) => {
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            id: QUESTION_ID,
            category: 'category',
            field: dateId,
            type: 'EMPTY',
            text: 'Ange ett svar.',
          },
        ],
      })
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it('Sets the value to null if the text is empty', async () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    await userEvent.clear(input[1])
    await expect(input[1]).toHaveValue('')
  })

  it('Sets the value not to null if the text is not empty', async () => {
    renderComponent({ disabled: false, question })
    const inputs = screen.getAllByRole('textbox')
    const newValue = 'text'
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], newValue)
    await expect(inputs[1]).toHaveValue(newValue)
  })
})
