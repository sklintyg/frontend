import { fakeMedicalInvestigationListElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import UeMedicalInvestigationList from './UeMedicalInvestigationList'
import store from '../../../../store/store'

// const INVESTIGATIONTYPE_LABEL = 'Ange utredning'
// const DATE_LABEL = 'Datum'
// const INFORMATIONSOURCE_LABEL = 'Från vilken vårdgivare kan FK hämta information'
const QUESTION_ID = 'list'

const question = fakeMedicalInvestigationListElement({ id: QUESTION_ID })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeMedicalInvestigationList>) => {
  render(
    <Provider store={store}>
      <UeMedicalInvestigationList {...props} />
    </Provider>
  )
}

describe('Medical Investigation component', () => {
  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })
})
