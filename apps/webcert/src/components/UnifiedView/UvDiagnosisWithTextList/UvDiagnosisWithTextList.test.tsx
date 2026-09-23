import { render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeDiagnosisWithTextListElement } from '../../../faker'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import QuestionUvResolve from '../../../feature/certificate/Question/QuestionUvResolve'
import type { CertificateDataElement, ConfigUeDiagnosesWithText, ValueDiagnosisWithTextList } from '../../../types'
import { UvDiagnosisWithTextList } from './UvDiagnosisWithTextList'

const QUESTION_ID = '58'

const row = (id: string, code: string, description: string, text: string | null) => ({
  id,
  diagnosis: { id: `${id}.diagnos`, terminology: 'ICD_10_SE', code, description },
  text: { id: `${id}.text`, text },
})

/** An unanswered row as the value DTO sends it: null diagnosis leaves (I-07). */
const unansweredRow = (id: string) => row(id, null as unknown as string, null as unknown as string, null)

const createQuestion = (list?: ReturnType<typeof row>[]): CertificateDataElement =>
  fakeDiagnosisWithTextListElement({ id: QUESTION_ID, value: list ? { list } : undefined })[QUESTION_ID]

const renderComponent = (question: CertificateDataElement) =>
  render(
    <UvDiagnosisWithTextList value={question.value as ValueDiagnosisWithTextList} config={question.config as ConfigUeDiagnosesWithText} />
  )

it('renders "Ej angivet" when no row is answered', () => {
  renderComponent(createQuestion())
  expect(screen.getByText('Ej angivet')).toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
})

it('renders the terminology and textLabel headers', () => {
  renderComponent(createQuestion([row('diagnos1', 'M545', 'Ländryggssmärta', 'Solna')]))
  expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
    'Diagnoskod enligt ICD-10-SE',
    'När och var ställdes diagnosen?',
  ])
})

it('renders code, description and text of an answered row in that order', () => {
  renderComponent(createQuestion([row('diagnos1', 'M545', 'Ländryggssmärta', '2024, vårdcentralen Solna')]))
  const [, bodyRow] = screen.getAllByRole('row')
  expect(
    within(bodyRow)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)
  ).toEqual(['M545', 'Ländryggssmärta', '2024, vårdcentralen Solna'])
})

it('renders no table row for an unanswered row', () => {
  renderComponent(
    createQuestion([
      row('diagnos1', 'M545', 'Ländryggssmärta', 'Solna'),
      unansweredRow('diagnos2'),
      row('diagnos3', 'J45', 'Astma', 'Kista'),
    ])
  )
  expect(screen.getAllByRole('row')).toHaveLength(3)
  expect(screen.getAllByRole('row')[2]).toHaveTextContent('J45')
})

it('is rendered by QuestionUvResolve for a DIAGNOSIS_WITH_TEXT_LIST element', () => {
  render(
    <Provider store={configureApplicationStore([certificateMiddleware])}>
      <QuestionUvResolve question={createQuestion([row('diagnos1', 'M545', 'Ländryggssmärta', 'Solna')])} />
    </Provider>
  )
  expect(screen.getByRole('table')).toHaveTextContent('M545')
})
