import { CertificateDataElement, fakeCertificate } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeEmptyMedicalInvestigationListElement, fakeMedicalInvestigationListElement } from '../../../utils/faker/fakeCertificateData'
import { UvMedicalInvestigationList } from './UvMedicalInvestigationList'
import { ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../../types/certificate'
import { configureApplicationStore } from '@frontend/webcert/src/store/configureApplicationStore'
import { certificateMiddleware } from '@frontend/webcert/src/store/certificate/certificateMiddleware'
import { updateCertificate } from '@frontend/webcert/src/store/certificate/certificateActions'

const QUESTION_ID = 'visualAcuity'

let testStore: EnhancedStore

const question: CertificateDataElement = fakeMedicalInvestigationListElement({
  id: QUESTION_ID,
})[QUESTION_ID]

const emptyQuestion: CertificateDataElement = fakeEmptyMedicalInvestigationListElement({
  id: QUESTION_ID,
})[QUESTION_ID]

const value = question.value as ValueMedicalInvestigationList
const config = question.config as ConfigUeMedicalInvestigationList
const emptyValue = emptyQuestion.value as ValueMedicalInvestigationList
const emptyConfig = emptyQuestion.config as ConfigUeMedicalInvestigationList

const renderComponent = (props: ComponentProps<typeof UvMedicalInvestigationList>) => {
  render(
    <Provider store={testStore}>
      <UvMedicalInvestigationList {...props} />
    </Provider>
  )
}

describe('UV Medical investigation list', () => {
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

  it('renders without crashing', () => {
    renderComponent({ value: value, config: config })
  })

  it('renders question text if value is not empty', () => {
    renderComponent({ value: value, config: config })
    expect(screen.getByRole('heading')).toHaveTextContent(config.typeText)
  })

  it('renders question text if value is empty', () => {
    renderComponent({ value: emptyValue, config: emptyConfig })
    expect(screen.getByRole('heading')).toHaveTextContent(emptyConfig.typeText)
  })

  it('renders empty value text if value is empty', () => {
    renderComponent({ value: emptyValue, config: emptyConfig })
    expect(screen.getByText('Ej angivet')).toBeInTheDocument()
  })

  it('renders date if question value is not empty', () => {
    renderComponent({ value: value, config: config })
    expect(screen.getByText(value.list[0].date.date as string)).toBeInTheDocument()
  })

  it('renders information source if question value is not empty', () => {
    renderComponent({ value: value, config: config })
    expect(screen.getByText(value.list[0].informationSource.text as string)).toBeInTheDocument()
  })

  it('renders investigation type if question value is not empty', () => {
    renderComponent({ value: value, config: config })
    expect(screen.getAllByText('Underlag från habiliteringen').length > 0).toBeTruthy()
  })
})
