import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeDiagnosisWithTextListElement } from '../../../../faker'
import {
  showValidationErrors as showValidationErrorsAction,
  updateCertificate,
  updateCertificateDataElement,
  validateCertificateSuccess,
} from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getQuestion } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import type { CertificateDataElement, ConfigUeDiagnosesWithText, ValueDiagnosisWithTextList } from '../../../../types'
import { QuestionUeResolve } from '../../Question/QuestionUeResolve'
import { UeDiagnosisWithTextList } from './UeDiagnosisWithTextList'

const QUESTION_ID = '58'
const TEXT_LABEL = 'När och var ställdes diagnosen?'
const ROW_IDS = ['diagnos1', 'diagnos2', 'diagnos3']
const DIAGNOSIS_LIST_FIELD = '58.1'

let testStore: EnhancedStore
let modalRoot: HTMLDivElement

const answeredRow = (id: string, code: string, description: string, text: string | null) => ({
  id,
  diagnosis: { id: `${id}.diagnos`, terminology: 'ICD_10_SE', code, description },
  text: { id: `${id}.text`, text },
})

/** An unanswered row as the value DTO sends it: null diagnosis leaves (I-07). */
const unansweredRow = (id: string) => answeredRow(id, null as unknown as string, null as unknown as string, null)

const createQuestion = (list?: ReturnType<typeof answeredRow>[], terminology?: ConfigUeDiagnosesWithText['terminology']) =>
  fakeDiagnosisWithTextListElement({
    id: QUESTION_ID,
    config: terminology ? { terminology } : undefined,
    value: list ? { list } : undefined,
  })[QUESTION_ID] as CertificateDataElement & {
    config: ConfigUeDiagnosesWithText
    value: ValueDiagnosisWithTextList
  }

/** The row's textboxes in DOM order, each named by its data-testid, else its id. */
const rowFields = (rowId: string) =>
  within(screen.getByTestId(rowId))
    .getAllByRole('textbox')
    .map((input) => input.getAttribute('data-testid') ?? input.id)

const storedList = () => (getQuestion(QUESTION_ID)(testStore.getState())?.value as ValueDiagnosisWithTextList).list

type TestValidationError = { field: string; text: string }

const showValidationErrors = (errors: TestValidationError[]) => {
  testStore.dispatch(showValidationErrorsAction())
  testStore.dispatch(
    validateCertificateSuccess({
      validationErrors: errors.map(({ field, text }) => ({ id: QUESTION_ID, category: 'category', field, type: 'EMPTY', text })),
    })
  )
}

const renderComponent = (question: ReturnType<typeof createQuestion>, validationErrors?: TestValidationError | TestValidationError[]) => {
  testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
  if (validationErrors) {
    showValidationErrors(Array.isArray(validationErrors) ? validationErrors : [validationErrors])
  }
  render(
    <Provider store={testStore}>
      <UeDiagnosisWithTextList
        question={question}
        disabled={false}
        onUpdate={(value) => testStore.dispatch(updateCertificateDataElement({ ...question, value }))}
      />
    </Provider>
  )
}

describe('UeDiagnosisWithTextList', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware, utilsMiddleware])
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('renders one code/description pair and one text input per configured row', () => {
    renderComponent(createQuestion())
    expect(rowFields('diagnos1')).toEqual(['diagnos1.diagnos-code', 'diagnos1.diagnos-diagnos', 'diagnos1.text'])
    expect(rowFields('diagnos2')).toEqual(['diagnos2.diagnos-code', 'diagnos2.diagnos-diagnos', 'diagnos2.text'])
    expect(rowFields('diagnos3')).toEqual(['diagnos3.diagnos-code', 'diagnos3.diagnos-diagnos', 'diagnos3.text'])
    expect(screen.getAllByRole('textbox')).toHaveLength(9)
  })

  it('renders the heading on every row', () => {
    renderComponent(createQuestion())
    expect(screen.getAllByText('Diagnoskod enligt ICD-10-SE')).toHaveLength(3)
  })

  it('renders textLabel as the label of each text field', () => {
    renderComponent(createQuestion())
    expect(screen.getAllByLabelText(TEXT_LABEL).map((input) => input.id)).toEqual(['diagnos1.text', 'diagnos2.text', 'diagnos3.text'])
  })

  it('renders no kodverk radio group with one terminology', () => {
    renderComponent(createQuestion())
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
  })

  it('shows the saved diagnosis and text of each row, matched by id, and keeps an unanswered row with empty leaves', async () => {
    renderComponent(createQuestion([answeredRow('diagnos2', 'M545', 'Ländryggssmärta', 'Vårdcentralen'), unansweredRow('diagnos1')]))
    expect(screen.getByTestId('diagnos1.diagnos-code')).toHaveValue('')
    expect(screen.getByTestId('diagnos2.diagnos-code')).toHaveValue('M545')
    expect(screen.getByTestId('diagnos2.diagnos-diagnos')).toHaveValue('Ländryggssmärta')
    expect(within(screen.getByTestId('diagnos2')).getByLabelText(TEXT_LABEL)).toHaveValue('Vårdcentralen')
    expect(within(screen.getByTestId('diagnos1')).getByLabelText(TEXT_LABEL)).toHaveValue('')
    await userEvent.type(within(screen.getByTestId('diagnos3')).getByLabelText(TEXT_LABEL), 'K')
    expect(storedList()[0]).toMatchObject({ id: 'diagnos1', diagnosis: { code: '', description: '' }, text: { text: null } })
  })

  it('dispatches the whole list with the typed text set and the other rows intact', async () => {
    renderComponent(createQuestion([answeredRow('diagnos1', 'M545', 'Ländryggssmärta', '2024')]))
    await userEvent.type(within(screen.getByTestId('diagnos2')).getByLabelText(TEXT_LABEL), 'Solna')
    expect(storedList()).toMatchObject([
      { id: 'diagnos1', diagnosis: { code: 'M545', description: 'Ländryggssmärta' }, text: { text: '2024' } },
      { id: 'diagnos2', diagnosis: { id: 'diagnos2.diagnos', code: '' }, text: { id: 'diagnos2.text', text: 'Solna' } },
      { id: 'diagnos3', diagnosis: { id: 'diagnos3.diagnos', code: '' }, text: { id: 'diagnos3.text', text: null } },
    ])
  })

  it('keeps a row with empty leaves in the dispatched list after its diagnosis is cleared', async () => {
    renderComponent(createQuestion([answeredRow('diagnos1', 'M545', 'Ländryggssmärta', '2024')]))
    await userEvent.clear(screen.getByTestId('diagnos1.diagnos-diagnos'))
    expect(storedList()).toHaveLength(3)
    expect(storedList()[0]).toMatchObject({
      id: 'diagnos1',
      diagnosis: { id: 'diagnos1.diagnos', code: '', description: '' },
      text: { text: '2024' },
    })
  })

  it('limits the text input to textLimit', () => {
    renderComponent(createQuestion())
    expect(screen.getAllByLabelText(TEXT_LABEL).map((input) => input.getAttribute('maxLength'))).toEqual(['50', '50', '50'])
  })

  it('strips characters outside ISO-8859-1 from the text input', async () => {
    renderComponent(createQuestion())
    const input = within(screen.getByTestId('diagnos1')).getByLabelText(TEXT_LABEL)
    await userEvent.type(input, 'Solna 😀')
    expect(input).toHaveValue('Solna ')
    expect(storedList()[0].text.text).toBe('Solna ')
    expect(screen.getByText(/Tecken som inte stöds/)).toBeInTheDocument()
  })

  it('renders an error on a row diagnosis under that row pair only', () => {
    renderComponent(createQuestion(), { field: 'diagnos2.diagnos', text: 'Ange en diagnos.' })
    expect(screen.getAllByText('Ange en diagnos.')).toHaveLength(1)
    expect(within(screen.getByTestId('diagnos2')).getByText('Ange en diagnos.')).toBeInTheDocument()
    expect(within(screen.getByTestId('diagnos2.text-container')).queryByText('Ange en diagnos.')).not.toBeInTheDocument()
  })

  it('renders an error on a row text under that row text only', () => {
    renderComponent(createQuestion(), { field: 'diagnos1.text', text: 'Ange ett svar.' })
    expect(screen.getAllByText('Ange ett svar.')).toHaveLength(1)
    expect(within(screen.getByTestId('diagnos1.text-container')).getByText('Ange ett svar.')).toBeInTheDocument()
  })

  it('renders an error with an unmatched field once under the list, framing only row 1 code', () => {
    renderComponent(createQuestion(), { field: DIAGNOSIS_LIST_FIELD, text: 'Ange en diagnos.' })
    expect(screen.getAllByText('Ange en diagnos.')).toHaveLength(1)
    expect(ROW_IDS.map((id) => within(screen.getByTestId(id)).queryByText('Ange en diagnos.'))).toEqual([null, null, null])
    expect(screen.getByTestId('diagnos1.diagnos-code')).toHaveClass('ic-textfield--error')
    expect(screen.getByTestId('diagnos2.diagnos-code')).not.toHaveClass('ic-textfield--error')
  })

  it('renders the C-05a order error below the list without marking another row invalid', () => {
    renderComponent(
      createQuestion([
        answeredRow('diagnos1', 'J20', 'Akut bronkit', 'Stora sjukhuset i X-stad, juli 2025.'),
        unansweredRow('diagnos2'),
        answeredRow('diagnos3', 'W22', 'Slagit sig mot eller träffad av andra föremål', null),
      ]),
      [
        { field: DIAGNOSIS_LIST_FIELD, text: 'Fyll i fälten uppifrån och ned.' },
        { field: 'diagnos3.text', text: 'Ange ett svar.' },
      ]
    )

    expect(screen.getAllByText('Fyll i fälten uppifrån och ned.')).toHaveLength(1)
    expect(within(screen.getByTestId('diagnos3.text-container')).getByText('Ange ett svar.')).toBeInTheDocument()
    expect(screen.getByTestId('diagnos1.diagnos-code')).not.toHaveClass('ic-textfield--error')
    expect(getComputedStyle(screen.getByTestId('diagnos2')).borderBottomStyle).toBe('solid')
    expect(getComputedStyle(screen.getByTestId('diagnos3')).borderBottomStyle).toBe('')
    expect(getComputedStyle(screen.getByTestId('diagnos3')).marginBottom).toBe('')
  })

  it('renders mandatory first-row errors together with C-05a when a lower row is answered', () => {
    renderComponent(createQuestion([unansweredRow('diagnos1'), answeredRow('diagnos2', 'A78', 'Q-feber', 'rr')]), [
      { field: DIAGNOSIS_LIST_FIELD, text: 'Fyll i fälten uppifrån och ned.' },
      { field: 'diagnos1.diagnos', text: 'Ange en diagnos.' },
      { field: 'diagnos1.text', text: 'Ange ett svar.' },
    ])

    expect(within(screen.getByTestId('diagnos1')).getByText('Ange en diagnos.')).toBeInTheDocument()
    expect(within(screen.getByTestId('diagnos1.text-container')).getByText('Ange ett svar.')).toBeInTheDocument()
    expect(screen.getByText('Fyll i fälten uppifrån och ned.')).toBeInTheDocument()
    expect(screen.getByTestId('diagnos1.diagnos-code')).toHaveClass('ic-textfield--error')
    expect(within(screen.getByTestId('diagnos1')).getByLabelText(TEXT_LABEL)).toHaveClass('ic-textfield--error')
  })

  it('clears every row diagnosis and keeps the rows and their text when kodverk is switched', async () => {
    renderComponent(
      createQuestion(
        [answeredRow('diagnos1', 'M545', 'Ländryggssmärta', '2024')],
        [
          { id: 'ICD_10_SE', label: 'ICD-10-SE' },
          { id: 'KSH_97_P', label: 'KSH97-P (Primärvård)' },
        ]
      )
    )
    await userEvent.click(screen.getByLabelText('KSH97-P (Primärvård)'))
    expect(storedList()).toHaveLength(3)
    expect(storedList()[0]).toMatchObject({
      id: 'diagnos1',
      diagnosis: { terminology: 'KSH_97_P', code: '', description: '' },
      text: { text: '2024' },
    })
    expect(screen.getAllByText('Diagnoskod enligt KSH97-P (Primärvård)')).toHaveLength(3)
  })

  it('stores the sanitised text of every prefilled row on mount', () => {
    renderComponent(
      createQuestion([answeredRow('diagnos1', 'M545', 'Ländryggssmärta', 'A😀'), answeredRow('diagnos2', 'J45', 'Astma', 'B😀')])
    )
    expect(storedList().map(({ text }) => text.text)).toEqual(['A', 'B', null])
  })

  it('is rendered by QuestionUeResolve for a UE_DIAGNOSES_WITH_TEXT element', () => {
    const question = createQuestion()
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
    render(
      <Provider store={testStore}>
        <QuestionUeResolve question={question} disabled={false} />
      </Provider>
    )
    expect(within(screen.getByTestId('diagnos1')).getByLabelText(TEXT_LABEL)).toHaveAttribute('id', 'diagnos1.text')
  })
})
