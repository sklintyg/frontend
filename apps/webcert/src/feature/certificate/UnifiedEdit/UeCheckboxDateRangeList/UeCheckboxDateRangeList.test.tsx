import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCertificateConfig, fakeCertificateValue } from '../../../../faker'
import { showValidationErrors, updateCertificate, updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import { CertificateDataElement, CertificateDataValidationType, ConfigUeCheckboxDateRangeList, ValueDateRangeList } from '../../../../types'
import { UeCheckboxDateRangeList } from './UeCheckboxDateRangeList'

const QUESTION_ID = 'Test'

const EN_FJARDEDEL_ID = 'EN_FJARDEDEL'
const EN_FJARDEDEL_LABEL = '25 procent'

const HALFTEN_ID = 'HALFTEN'
const HALFTEN_LABEL = '50 procent'

const TRE_FJARDEDEL_ID = 'TRE_FJARDEDEL'
const TRE_FJARDEDEL_LABEL = '75 procent'

const HELT_NEDSATT_ID = 'HELT_NEDSATT'
const HELT_NEDSATT_LABEL = '100 procent'

type QuestionDataElement = CertificateDataElement & { config: ConfigUeCheckboxDateRangeList; value: ValueDateRangeList }

const defaultQuestion: QuestionDataElement = {
  id: QUESTION_ID,
  parent: 'bedomning',
  index: 18,
  visible: true,
  readOnly: false,
  mandatory: true,
  config: fakeCertificateConfig.checkboxDateRangeList({
    text: 'Min bedömning av patientens nedsättning av arbetsförmågan',
    description: 'Utgångspunkten är att patientens arbetsförmåga ska bedömas i förhållande till hens normala arbetstid.',
    hideWorkingHours: false,
    list: [
      {
        id: EN_FJARDEDEL_ID,
        label: EN_FJARDEDEL_LABEL,
      },
      {
        id: HALFTEN_ID,
        label: HALFTEN_LABEL,
      },
      {
        id: TRE_FJARDEDEL_ID,
        label: TRE_FJARDEDEL_LABEL,
      },
      {
        id: HELT_NEDSATT_ID,
        label: HELT_NEDSATT_LABEL,
      },
    ],
  }),
  value: fakeCertificateValue.dateRangeList(),
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: QUESTION_ID,
      expression: `$${EN_FJARDEDEL_ID} || $${HALFTEN_ID} || $${TRE_FJARDEDEL_ID} || $${HELT_NEDSATT_ID}`,
    },
  ],
  validationErrors: [],
}

const renderDefaultComponent = (question: QuestionDataElement = defaultQuestion, disabled: boolean = false) => {
  render(
    <Provider store={store}>
      <UeCheckboxDateRangeList
        disabled={disabled}
        question={question}
        onUpdate={(value) => store.dispatch(updateCertificateDataElement({ ...question, value }))}
      />
    </Provider>
  )
}

describe('UeCheckboxDateRangeList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('Gets a correct starting date with no prior date period', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    screen.getByLabelText(EN_FJARDEDEL_LABEL).click()
    expect((screen.getByTestId(`from${EN_FJARDEDEL_ID}`) as HTMLInputElement).value).toBeTruthy()

    screen.getByLabelText(HALFTEN_LABEL).click()
    screen.getByLabelText(TRE_FJARDEDEL_LABEL).click()
    screen.getByLabelText(HELT_NEDSATT_LABEL).click()

    await expect(screen.getByTestId(`from${HALFTEN_ID}`)).toHaveValue('2000-02-01')
    await expect(screen.getByTestId(`from${TRE_FJARDEDEL_ID}`)).toHaveValue('2000-02-01')
    await expect(screen.getByTestId(`from${HELT_NEDSATT_ID}`)).toHaveValue('2000-02-01')
    await expect(screen.getByTestId(`from${EN_FJARDEDEL_ID}`)).toHaveValue('2000-02-01')
  })

  it('Gets a correct starting date with one prior date period', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    screen.getByLabelText(EN_FJARDEDEL_LABEL).click()
    await userEvent.type(screen.getByTestId(`tom${EN_FJARDEDEL_ID}`), '1v{enter}')
    screen.getByLabelText(HALFTEN_LABEL).click()

    await expect(screen.getByTestId(`tom${EN_FJARDEDEL_ID}`)).toHaveValue('2000-02-07')
    await expect(screen.getByTestId(`from${HALFTEN_ID}`)).toHaveValue('2000-02-08')
  })

  it('Gets a correct starting date with one later date period', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    screen.getByLabelText(HELT_NEDSATT_LABEL).click()
    await userEvent.type(screen.getByTestId(`tom${HELT_NEDSATT_ID}`), '1v{enter}')
    screen.getByLabelText(HALFTEN_LABEL).click()

    await expect(screen.getByTestId(`tom${HELT_NEDSATT_ID}`)).toHaveValue('2000-02-07')
    await expect(screen.getByTestId(`from${HALFTEN_ID}`)).toHaveValue('2000-02-08')
  })

  it('inputs are disabled correctly', async () => {
    renderDefaultComponent(undefined, true)

    await expect(screen.getByLabelText(EN_FJARDEDEL_LABEL)).toBeDisabled()
    await expect(screen.getByTestId(`from${EN_FJARDEDEL_ID}`)).toBeDisabled()
    await expect(screen.getByTestId(`tom${EN_FJARDEDEL_ID}`)).toBeDisabled()
  })

  it('Renders total number of sick days', () => {
    const question = {
      ...defaultQuestion,
      value: fakeCertificateValue.dateRangeList({
        list: [
          { id: '1', from: '2021-06-01', to: '2021-06-07' },
          { id: '2', from: '2021-06-08', to: '2021-06-14' },
        ],
      }),
    }

    renderDefaultComponent(question)

    expect(screen.getByText('Intyget motsvarar en period på 14 dagar.')).toBeInTheDocument()
  })

  it('Renders no total number of sick days if missing valid date ranges', () => {
    const question = {
      ...defaultQuestion,
      value: fakeCertificateValue.dateRangeList({
        list: [
          { id: '1', from: '2021-06-01', to: '' },
          { id: '2', from: '', to: '2021-06-14' },
        ],
      }),
    }

    renderDefaultComponent(question)

    expect(screen.queryByText('Intyget motsvarar en period på 14 dagar.')).not.toBeInTheDocument()
  })

  it('should not render total number of sick days if question is disabled', () => {
    renderDefaultComponent({
      ...defaultQuestion,
      disabled: true,
    })

    expect(screen.queryByText('Intyget motsvarar en period på 14 dagar.')).not.toBeInTheDocument()
  })

  it('should not render hourly calculation if component is disabled', () => {
    renderDefaultComponent(
      {
        ...defaultQuestion,
      },
      true
    )

    expect(screen.queryByText('Patienten arbetar i snitt', { exact: false })).not.toBeInTheDocument()
  })

  it('should render previous sick leave period if it exists', () => {
    const expectedPreviousPeriod = 'This is the previous sick leave period'
    const question = {
      ...defaultQuestion,
      config: fakeCertificateConfig.checkboxDateRangeList({
        ...defaultQuestion.config,
        previousSickLeavePeriod: expectedPreviousPeriod,
      }),
    }

    renderDefaultComponent(question)

    expect(screen.getByText(expectedPreviousPeriod)).toBeInTheDocument()
  })

  it('does display validation error if child has no client validation errors', () => {
    const expectedValidationMessage = 'Välj minst ett alternativ.'
    const question = {
      ...defaultQuestion,
      id: 'questionId',
      validationErrors: [
        {
          category: defaultQuestion.parent,
          type: 'EMPTY',
          id: 'questionId',
          field: 'questionId',
          text: expectedValidationMessage,
        },
      ],
    }

    store.dispatch(updateCertificate(fakeCertificate({ data: { questionId: question } })))
    store.dispatch(showValidationErrors())
    renderDefaultComponent(question)

    expect(screen.getByText(expectedValidationMessage)).toBeInTheDocument()
  })

  it('does not display validation error if child has client validation errors', async () => {
    const expectedValidationMessage = 'Välj minst ett alternativ.'
    const question = {
      ...defaultQuestion,
      value: fakeCertificateValue.dateRangeList({
        list: [{ id: defaultQuestion.id, from: '2021-06-01', to: '12345' }],
      }),
      validationErrors: [
        {
          category: defaultQuestion.parent,
          type: 'EMPTY',
          id: defaultQuestion.id,
          field: defaultQuestion.id,
          text: expectedValidationMessage,
        },
      ],
    }

    store.dispatch(updateCertificate(fakeCertificate({ data: { [question.id]: question } })))
    store.dispatch(showValidationErrors())

    renderDefaultComponent(question)

    await userEvent.click(screen.getAllByRole('checkbox')[0])

    expect(screen.queryByText(expectedValidationMessage)).not.toBeInTheDocument()
  })

  it('does display validation error if missing tom date', async () => {
    const expectedValidationMessage = 'Ange ett datum'
    const question = {
      ...defaultQuestion,
      value: fakeCertificateValue.dateRangeList({
        list: [{ id: defaultQuestion.id, from: '2021-06-01', to: '' }],
      }),
      validationErrors: [
        {
          category: defaultQuestion.parent,
          type: 'EMPTY',
          id: defaultQuestion.id,
          field: defaultQuestion.id,
          text: expectedValidationMessage,
        },
      ],
    }
    store.dispatch(updateCertificate(fakeCertificate({ data: { [question.id]: question } })))
    store.dispatch(showValidationErrors())

    renderDefaultComponent(question)

    expect(screen.getByText(expectedValidationMessage)).toBeInTheDocument()
  })

  it('does display validation error if missing from date', async () => {
    const expectedValidationMessage = 'Ange ett datum'
    const question = {
      ...defaultQuestion,
      value: fakeCertificateValue.dateRangeList({
        list: [{ id: defaultQuestion.id, from: '', to: '2021-06-01' }],
      }),
      validationErrors: [
        {
          category: defaultQuestion.parent,
          type: 'EMPTY',
          id: defaultQuestion.id,
          field: defaultQuestion.id,
          text: expectedValidationMessage,
        },
      ],
    }
    store.dispatch(updateCertificate(fakeCertificate({ data: { [question.id]: question } })))
    store.dispatch(showValidationErrors())

    renderDefaultComponent(question)

    expect(screen.getByText(expectedValidationMessage)).toBeInTheDocument()
  })

  describe('hideWorkingHours', () => {
    it('Should display sick leave working hours', () => {
      const question = {
        ...defaultQuestion,
        config: fakeCertificateConfig.checkboxDateRangeList({
          hideWorkingHours: false,
        }),
      }

      renderDefaultComponent(question)
      expect(screen.getByText(/ange hur många timmar patienten/i)).toBeInTheDocument()
    })

    it('Should hide sick leave working hours', () => {
      const question = {
        ...defaultQuestion,
        config: fakeCertificateConfig.checkboxDateRangeList({
          hideWorkingHours: true,
        }),
      }

      renderDefaultComponent(question)
      expect(screen.queryByText(/ange hur många timmar patienten/i)).not.toBeInTheDocument()
    })
  })
})
