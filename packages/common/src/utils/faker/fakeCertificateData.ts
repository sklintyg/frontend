import { CertificateData, CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common'
import faker from 'faker'
import { Merge, PartialDeep } from 'type-fest'
import {
  CertificateDataValidationType,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDate,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeIcf,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeTextArea,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDiagnosis,
  ValueIcf,
  ValueText,
} from '../../types/certificate'
import { fakeCertificateDataValidation, fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeList } from './fakeList'

type PartialCertificateDataElement<T, P> = PartialDeep<Merge<CertificateDataElement, { config: T; value: P }>>

export const fakeCertificateData = (children: CertificateData[]): CertificateData => {
  return children.reduce(
    (product: CertificateData, elements) =>
      Object.values(elements).reduce((result, element) => {
        return {
          ...result,
          ...fakeDataElement({ ...element, index: Object.keys(result).length + 1 }),
        }
      }, product),
    {}
  )
}

export const fakeDataElement = (data?: PartialDeep<CertificateDataElement>, children: CertificateData[] = []): CertificateData => {
  const id = data?.id ?? faker.random.alpha({ count: 5 })
  const type = data?.config?.type ?? ConfigTypes.CATEGORY
  let certificateData: CertificateData = {}
  certificateData[id] = {
    parent: '',
    index: 0,
    visible: true,
    readOnly: false,
    mandatory: false,
    ...data,
    validation: data?.validation instanceof Array ? data?.validation.map(fakeCertificateDataValidation) : [],
    validationErrors: data?.validationErrors instanceof Array ? data.validationErrors.map(fakeCertificateValidationError) : [],
    id,
    config: {
      type: ConfigTypes.CATEGORY,
      text: `${id} - ${faker.lorem.words()}`,
      description: data?.config?.description ?? type === ConfigTypes.CATEGORY ? `description: ${faker.lorem.sentence()}` : '',
      ...data?.config,
      id,
    },
    value:
      data != null && data.value != null
        ? {
            ...data.value,
            type: data?.value?.type ?? CertificateDataValueType.BOOLEAN,
          }
        : null,
  }

  children.forEach((elements, indexOffset) => {
    certificateData = Object.values(elements).reduce((certificateData: CertificateData, element, index) => {
      return { ...certificateData, ...fakeDataElement({ ...element, parent: id, id: `${id}.${indexOffset + index + 1}` }) }
    }, certificateData)
  })

  return certificateData
}

export const fakeCategoryElement = fakeDataElement

export const fakeCheckboxBooleanElement = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxBoolean, ValueCodeList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
        label: faker.lorem.sentence(),
        text: 'text',
        description: 'description',
        selectedText: 'Ja',
        unselectedText: 'Nej',
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.BOOLEAN,
        id: faker.random.alpha({ count: 10 }),
        ...data?.value,
      },
    },
    children
  )

export const fakeCheckboxMultipleCodeElement = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxMultipleCodes, ValueCodeList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
        label: faker.lorem.sentence(),
        text: `text: ${faker.lorem.sentence()}`,
        selectedText: 'Ja',
        unselectedText: 'Nej',
        list: fakeList(5),
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.CODE,
        id: faker.random.alpha({ count: 10 }),
        list: [],
        ...data?.value,
      },
    },
    children
  )

export const fakeDiagnosesElement = (
  data?: PartialCertificateDataElement<ConfigUeDiagnoses, ValueDiagnosis>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_DIAGNOSES,
        text: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        terminology: [
          {
            id: 'ICD_10_SE',
            label: 'ICD-10-SE',
          },
          {
            id: 'KSH_97_P',
            label: 'KSH97-P (Primärvård)',
          },
        ],
        list: fakeList(3),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DIAGNOSIS_LIST, list: [], ...data?.value },
    },
    children
  )

export const fakeICFDataElement = (
  data?: PartialCertificateDataElement<ConfigUeIcf, ValueIcf>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_ICF,
        header: `header: ${faker.lorem.sentence()}`,
        modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
        collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
        placeholder: `placeholder: ${faker.lorem.sentence()}`,
        ...data?.config,
      },
      value: { id: faker.random.alpha(), type: CertificateDataValueType.ICF, icfCodes: [], ...data?.value },
    },
    children
  )

export const fakeCheckboxMultipleDate = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxMultipleDate, ValueDateList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
        list: fakeList(5),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DATE_LIST, list: [], ...data?.value },
    },
    children
  )

export const fakeRadioMultipleCodeElement = (
  data?: PartialCertificateDataElement<ConfigUeRadioMultipleCodes, ValueCode>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
        list: fakeList(5),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.CODE, list: [], ...data?.value },
    },
    children
  )

export const fakeRadioBooleanElement = (
  data?: PartialCertificateDataElement<ConfigUeRadioBoolean, ValueBoolean>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_RADIO_BOOLEAN,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.BOOLEAN, selected: true, ...data?.value },
    },
    children
  )

export const fakeTextAreaElement = (
  data?: PartialCertificateDataElement<ConfigUeTextArea, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TEXTAREA,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Text', limit: 50, ...data?.value },
    },
    children
  )

export const fakeDropdownElement = (
  data?: PartialCertificateDataElement<ConfigUeDropdown, ValueCode>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        list: fakeList(5),
      },
      value: {
        id: faker.random.alpha(),
        code: 'test',
        ...data?.value,
      },
    },
    children
  )

export const fakeDateElement = (
  data?: PartialCertificateDataElement<ConfigUeDate, ValueDate>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_DATE,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DATE, date: '2022-09-29', ...data?.value },
      validation: [
        fakeCertificateDataValidation({
          type: CertificateDataValidationType.MAX_DATE_VALIDATION,
          expression: data?.id ? `$${data.id.toUpperCase()}` : undefined,
          numberOfDays: 0,
        }),
        ...(data?.validation ?? []),
      ],
    },
    children
  )
