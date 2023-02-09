import { fakeMedicalInvestigationListElement, ConfigUeMedicalInvestigationList, fakeCertificate } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import faker from 'faker'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
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
    renderComponent({ disabled: false, question })
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

  it('sets the value to null if the text is empty', () => {
    const text = ''
    let value = null

    if (text.length === 0) {
      value = null
    }

    expect(value).toBeNull()
  })

  it('does not set the value to null if the text is not empty', () => {
    const text = 'some text'
    let value = null

    if (text.length > 0) {
      value = 'some value'
    }

    expect(value).not.toBeNull()
  })

  test('error should be set if index is 0 and validation errors length is 1', () => {
    const index = 0
    const validationErrors = [{ error: 'some error' }]
    const error = index === 0 && validationErrors.length === 1

    expect(error).toBeTruthy()
  })
})
