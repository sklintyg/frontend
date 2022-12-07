import { fakeMedicalInvestigationListElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeMedicalInvestigationList from './UeMedicalInvestigationList'

const INVESTIGATIONTYPE_LABEL = 'Ange utredning eller underlag'
const DATE_LABEL = 'Datum'
const INFORMATIONSOURCE_LABEL = 'Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?'
const QUESTION_ID = 'list'

const question = fakeMedicalInvestigationListElement({ id: QUESTION_ID })[QUESTION_ID]
const renderComponent = (props: ComponentProps<typeof UeMedicalInvestigationList>) => {
  render(
    <Provider store={store}>
      <UeMedicalInvestigationList {...props} />
    </Provider>
  )
}
describe('Medical investigation component', () => {
  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })
  it('renders all components', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getAllByText(INVESTIGATIONTYPE_LABEL)).toHaveLength(1)
    expect(screen.getAllByText(DATE_LABEL)).toHaveLength(1)
    expect(screen.getAllByText(INFORMATIONSOURCE_LABEL)).toHaveLength(1)
  })
  it('renders, textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    const informationSources = screen.getAllByRole('textbox')
    const investigationtypes = screen.getByRole('combobox')
    const dates = screen.getByRole('button')
    informationSources.forEach((informationSource) => {
      expect(informationSource).toBeInTheDocument()
    })
    expect(investigationtypes).toBeInTheDocument()
    expect(dates).toBeInTheDocument()
  })
  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const InvestigationsTypes = screen.getAllByRole('combobox')
    InvestigationsTypes.forEach((investigationType) => {
      expect(investigationType).not.toBeDisabled()
    })
    const textinputs = screen.getAllByRole('textbox')
    textinputs.forEach((textinput) => {
      expect(textinput).not.toBeDisabled()
    })
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })
  it('does disable component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const InvestigationsTypes = screen.getAllByRole('combobox')
    InvestigationsTypes.forEach((investigationType) => {
      expect(investigationType).toBeDisabled()
    })
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    const textinputs = screen.getAllByRole('textbox')
    textinputs.forEach((textinput) => {
      expect(textinput).toBeDisabled()
    })
  })
})
