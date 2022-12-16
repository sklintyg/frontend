import { fakeMedicalInvestigationListElement, ConfigUeMedicalInvestigationList, fakeCertificate } from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import faker from 'faker'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import reducers from '../../../../store/reducers'
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
    testStore = configureStore({
      reducer: reducers,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })

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

  it('Should display empty validationErrors for information source', () => {
    const field = (question.config as ConfigUeMedicalInvestigationList).list[0].informationSourceId
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it('Should display empty validationErrors for investigation type', () => {
    const field = (question.config as ConfigUeMedicalInvestigationList).list[0].investigationTypeId
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it('Should display empty validationErrors for date', () => {
    const field = (question.config as ConfigUeMedicalInvestigationList).list[0].dateId
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })
})
