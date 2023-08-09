import { ConfigUeMedicalInvestigationList, fakeCertificate, fakeMedicalInvestigationListElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate, updateValidationErrors } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeMedicalInvestigationList from './UeMedicalInvestigationList'

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
    expect(screen.getAllByText('Ange utredning eller underlag')).toHaveLength(1)
    expect(screen.getAllByText('Datum')).toHaveLength(1)
    expect(screen.getAllByText('Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?')).toHaveLength(1)
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

    screen.getAllByRole('combobox').forEach((investigationType) => {
      expect(investigationType).not.toBeDisabled()
    })

    screen.getAllByRole('button').forEach((button) => {
      expect(button).not.toBeDisabled()
    })

    screen.getAllByRole('textbox').forEach((textinput) => {
      expect(textinput).not.toBeDisabled()
    })
  })

  it('Should disable component if disabled is set', () => {
    renderComponent({ disabled: true, question })

    expect(screen.getAllByRole('combobox')).toHaveLength(3)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)

    screen.getAllByRole('combobox').forEach((investigationType) => {
      expect(investigationType).toBeDisabled()
    })

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toBeDisabled()
    })

    screen.getAllByRole('textbox').forEach((textinput) => {
      expect(textinput).toBeDisabled()
    })
  })

  const config = question.config as ConfigUeMedicalInvestigationList

  it.each(config.list)('Should display validation error for field information source field %#', ({ informationSourceId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: informationSourceId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should display validation error for investation field %#', ({ investigationTypeId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: investigationTypeId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should display validation error for date field %#', ({ dateId }) => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: dateId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for information source field %#', ({ informationSourceId }) => {
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: informationSourceId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for investigation field %#', ({ investigationTypeId }) => {
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: investigationTypeId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it.each(config.list)('Should not display empty validationErrors for date field %#', ({ dateId }) => {
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: dateId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.queryByText('Ange ett svar.')).not.toBeInTheDocument()
  })

  it('Sets the value to null if the text is empty', () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    userEvent.clear(input[1])
    expect(input[1]).toHaveValue('')
  })

  it('Sets the value not to null if the text is not empty', async () => {
    renderComponent({ disabled: false, question })
    const inputs = screen.getAllByRole('textbox')
    const newValue = 'text'
    await act(() => userEvent.clear(inputs[1]))
    await act(() => userEvent.type(inputs[1], newValue))
    expect(inputs[1]).toHaveValue(newValue)
  })

  it.skip('Should disable options past max date', async () => {
    renderComponent({
      disabled: false,
      question: fakeMedicalInvestigationListElement({
        id: 'id',
        config: { list: [{ dateId: 'date', maxDate: '2023-02-27' }] },
        value: { list: [{ id: 'date', date: '2023-02-27' }] },
      })['id'],
    })

    await act(async () => {
      userEvent.click(screen.getByLabelText('Öppna kalendern'))
    })

    expect(screen.getAllByLabelText(/Not available .* februari 2023/)).toHaveLength(1)
  })
})
