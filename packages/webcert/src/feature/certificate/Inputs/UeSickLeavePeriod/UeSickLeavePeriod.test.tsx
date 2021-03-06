import React from 'react'
import '@testing-library/jest-dom'
import { getByText, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
  getValidDate,
  ValueDateRangeList,
} from '@frontend/common'
import DateRangePicker from './DateRangePicker'
import * as redux from 'react-redux'
import { differenceInCalendarDays, isEqual, addDays } from 'date-fns'
import { UeSickLeavePeriod } from './UeSickLeavePeriod'

const LABEL = '25 procent'
const QUESTION_ID = 'Test'

const EN_FJARDEDEL_ID = 'EN_FJARDEDEL'
const EN_FJARDEDEL_LABEL = '25 procent'

const HALFTEN_ID = 'HALFTEN'
const HALFTEN_LABEL = '50 procent'

const TRE_FJARDEDEL_ID = 'TRE_FJARDEDEL'
const TRE_FJARDEDEL_LABEL = '75 procent'

const HELT_NEDSATT_ID = 'HELT_NEDSATT'
const HELT_NEDSATT_LABEL = '100 procent'

const defaultQuestion: CertificateDataElement = {
  id: QUESTION_ID,
  parent: 'bedomning',
  index: 18,
  visible: true,
  readOnly: false,
  mandatory: true,
  config: {
    text: 'Min bedömning av patientens nedsättning av arbetsförmågan',
    description: 'Utgångspunkten är att patientens arbetsförmåga ska bedömas i förhållande till hens normala arbetstid.',
    type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
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
  },
  value: {
    type: CertificateDataValueType.DATE_RANGE_LIST,
    list: [],
  },
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: QUESTION_ID,
      expression: `$${EN_FJARDEDEL_ID} || $${HALFTEN_ID} || $${TRE_FJARDEDEL_ID} || $${HELT_NEDSATT_ID}`,
    },
  ],
  validationErrors: [],
}

const renderDefaultComponent = (question?: CertificateDataElement, disabled?: boolean) => {
  render(<UeSickLeavePeriod disabled={disabled ?? false} question={question ?? defaultQuestion} />)
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
  useSelectorSpy.mockReturnValue(jest.fn())
})

describe('x', () => {
  it('Renders without crashing', () => {
    renderDefaultComponent()
  })

  it('Gets a correct starting date with no prior date period', async () => {
    renderDefaultComponent()

    screen.getByLabelText(EN_FJARDEDEL_LABEL).click()
    expect((screen.getByTestId(`from${EN_FJARDEDEL_ID}`) as HTMLInputElement).value).toBeTruthy()

    screen.getByLabelText(HALFTEN_LABEL).click()
    screen.getByLabelText(TRE_FJARDEDEL_LABEL).click()
    screen.getByLabelText(HELT_NEDSATT_LABEL).click()

    const expectedDate = getValidDate((screen.getByTestId(`from${EN_FJARDEDEL_ID}`) as HTMLInputElement).value)
    const halfDate = getValidDate((screen.getByTestId(`from${HALFTEN_ID}`) as HTMLInputElement).value)
    const threeFourthsDate = getValidDate((screen.getByTestId(`from${TRE_FJARDEDEL_ID}`) as HTMLInputElement).value)
    const fullTimeDate = getValidDate((screen.getByTestId(`from${HELT_NEDSATT_ID}`) as HTMLInputElement).value)

    expect(isEqual(expectedDate!, halfDate!)).toBeTruthy()
    expect(isEqual(expectedDate!, threeFourthsDate!)).toBeTruthy()
    expect(isEqual(expectedDate!, fullTimeDate!)).toBeTruthy()
  })

  it('Gets a correct starting date with one prior date period', async () => {
    renderDefaultComponent()
    // Enter first period, click second period checkbox and make sure its one day ahead

    screen.getByLabelText(EN_FJARDEDEL_LABEL).click()
    userEvent.type(screen.getByTestId(`tom${EN_FJARDEDEL_ID}`), '1v{enter}')
    screen.getByLabelText(HALFTEN_LABEL).click()

    const endOfPriorPeriodDate = getValidDate((screen.getByTestId(`tom${EN_FJARDEDEL_ID}`) as HTMLInputElement).value)
    const actualDate = getValidDate((screen.getByTestId(`from${HALFTEN_ID}`) as HTMLInputElement).value)
    const expectedDate = addDays(endOfPriorPeriodDate!, 1)

    expect(isEqual(actualDate!, expectedDate)).toBeTruthy()
  })

  it('Gets a correct starting date with one later date period', async () => {
    renderDefaultComponent()
    // Enter last period, click prior period checkbox and make sure its one day ahead

    screen.getByLabelText(HELT_NEDSATT_LABEL).click()
    userEvent.type(screen.getByTestId(`tom${HELT_NEDSATT_ID}`), '1v{enter}')
    screen.getByLabelText(HALFTEN_LABEL).click()

    const endOfPriorPeriodDate = getValidDate((screen.getByTestId(`tom${HELT_NEDSATT_ID}`) as HTMLInputElement).value)
    const actualDate = getValidDate((screen.getByTestId(`from${HALFTEN_ID}`) as HTMLInputElement).value)
    const expectedDate = addDays(endOfPriorPeriodDate!, 1)

    expect(isEqual(actualDate!, expectedDate)).toBeTruthy()
  })

  it('Renders validation error if one period overlaps another', () => {
    const question: CertificateDataElement = {
      ...defaultQuestion,
      value: {
        type: CertificateDataValueType.DATE_RANGE_LIST,
        list: [
          { id: '1', from: '2021-06-05', to: '2021-06-06', type: CertificateDataValueType.DATE_RANGE },
          { id: '2', from: '2021-06-01', to: '2021-06-06', type: CertificateDataValueType.DATE_RANGE },
        ],
      },
    }

    renderDefaultComponent(question)

    const expectedErrorMessage = 'Ange sjukskrivningsperioder som inte överlappar varandra.'

    expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument()
  })

  it('Renders without validation error if correct periods', () => {
    const question: CertificateDataElement = {
      ...defaultQuestion,
      value: {
        type: CertificateDataValueType.DATE_RANGE_LIST,
        list: [
          { id: '1', from: '2021-06-01', to: '2021-06-05', type: CertificateDataValueType.DATE_RANGE },
          { id: '2', from: '2021-06-06', to: '2021-06-10', type: CertificateDataValueType.DATE_RANGE },
        ],
      },
    }

    renderDefaultComponent(question)

    const expectedErrorMessage = 'Ange sjukskrivningsperioder som inte överlappar varandra.'

    expect(screen.queryByText(expectedErrorMessage)).not.toBeInTheDocument()
  })

  it('inputs are disabled correctly', () => {
    renderDefaultComponent(undefined, true)

    expect(screen.getByLabelText(EN_FJARDEDEL_LABEL)).toBeDisabled()
    expect(screen.getByTestId(`from${EN_FJARDEDEL_ID}`)).toBeDisabled()
    expect(screen.getByTestId(`tom${EN_FJARDEDEL_ID}`)).toBeDisabled()
  })

  it('Renders total number of sick days', () => {
    const question: CertificateDataElement = {
      ...defaultQuestion,
      value: {
        type: CertificateDataValueType.DATE_RANGE_LIST,
        list: [
          { id: '1', from: '2021-06-01', to: '2021-06-07', type: CertificateDataValueType.DATE_RANGE },
          { id: '2', from: '2021-06-08', to: '2021-06-14', type: CertificateDataValueType.DATE_RANGE },
        ],
      },
    }

    renderDefaultComponent(question)

    expect(screen.getByText('Intyget motsvarar en period på 14 dagar.')).toBeInTheDocument()
  })

  it('Renders no total number of sick days if missing valid date ranges', () => {
    const question: CertificateDataElement = {
      ...defaultQuestion,
      value: {
        type: CertificateDataValueType.DATE_RANGE_LIST,
        list: [
          { id: '1', from: '2021-06-01', to: '', type: CertificateDataValueType.DATE_RANGE },
          { id: '2', from: '', to: '2021-06-14', type: CertificateDataValueType.DATE_RANGE },
        ],
      },
    }

    renderDefaultComponent(question)

    expect(screen.queryByText('Intyget motsvarar en period på 14 dagar.')).not.toBeInTheDocument()
  })
})
