import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { CertificateDataElement, ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../../types/certificate'
import { fakeMedicalInvestigationListElement } from '../../../utils/faker/fakeCertificateData'
import { UvMedicalInvestigationList } from './UvMedicalInvestigationList'

const QUESTION_ID = 'questionId'

const question: CertificateDataElement = fakeMedicalInvestigationListElement({
  id: QUESTION_ID,
})[QUESTION_ID]

const emptyQuestion: CertificateDataElement = fakeMedicalInvestigationListElement({ value: { list: [] }, id: QUESTION_ID })[QUESTION_ID]

const value = question.value as ValueMedicalInvestigationList
const config = question.config as ConfigUeMedicalInvestigationList
const emptyValue = emptyQuestion.value as ValueMedicalInvestigationList
const emptyConfig = emptyQuestion.config as ConfigUeMedicalInvestigationList

const renderComponent = (props: ComponentProps<typeof UvMedicalInvestigationList>) => {
  render(<UvMedicalInvestigationList {...props} />)
}

it('renders without crashing', () => {
  expect(() => renderComponent({ value: value, config: config })).not.toThrow()
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
  expect(screen.getAllByTestId('informationSource').length > 0).toBeTruthy()
})
