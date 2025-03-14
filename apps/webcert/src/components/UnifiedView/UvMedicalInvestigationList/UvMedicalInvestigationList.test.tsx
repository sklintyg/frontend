import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { fakeMedicalInvestigationListElement } from '../../../faker'
import type { CertificateDataElement, ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList } from '../../../types/certificate'
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
  expect(() => renderComponent({ value, config })).not.toThrow()
})

it('renders empty value text if value is empty', () => {
  renderComponent({ value: emptyValue, config: emptyConfig })
  expect(screen.getByText('Ej angivet')).toBeInTheDocument()
})

it('renders date if question value is not empty', () => {
  renderComponent({ value, config })
  expect(screen.getByText(value.list[0].date.date as string)).toBeInTheDocument()
})

it('renders information source if question value is not empty', () => {
  renderComponent({ value, config })
  expect(screen.getByText(value.list[0].informationSource.text as string)).toBeInTheDocument()
})

it('renders investigation type if question value is not empty', () => {
  renderComponent({ value, config })
  expect(screen.getAllByTestId('informationSource').length > 0).toBeTruthy()
})
