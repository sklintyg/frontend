import faker from 'faker'
import { Merge, PartialDeep } from 'type-fest'
import {
  CertificateData,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigCategory,
  ConfigTypes,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDate,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeHeader,
  ConfigUeIcf,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeTextArea,
  ConfigUeTextField,
  ConfigUeTypeahead,
  ConfigureUeUncertainDate,
  ConfigureUeCauseOfDeath,
  ConfigureUeCauseOfDeathList,
  Value,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDiagnosis,
  ValueUncertainDate,
  ValueHeader,
  ValueIcf,
  ValueText,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
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
  const type = data?.config?.type ?? ConfigTypes.CATEGORY
  const id = data?.id ?? faker.random.alpha({ count: 5 })
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
            type: data?.value?.type ?? CertificateDataValueType.UNKNOWN,
          }
        : null,
  }

  children.forEach((elements, indexOffset) => {
    certificateData = Object.values(elements).reduce((certificateData: CertificateData, element, index) => {
      return { ...certificateData, ...fakeDataElement({ ...element, parent: id, id: element.id ?? `${id}.${indexOffset + index + 1}` }) }
    }, certificateData)
  })

  return certificateData
}

export const fakeCategoryElement = (
  data?: PartialCertificateDataElement<ConfigCategory, Value>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.CATEGORY,
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.UNKNOWN,
        ...data?.value,
      },
    },
    children
  )

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
        type: CertificateDataValueType.CODE_LIST,
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

export const fakeTextFieldElement = (
  data?: PartialCertificateDataElement<ConfigUeTextField, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TEXTFIELD,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Text', ...data?.value },
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
        ...data?.config,
      },
      value: {
        id: faker.random.alpha(),
        code: 'test',
        ...data?.value,
      },
    },
    children
  )

export const fakeTypeaheadElement = (
  data?: PartialCertificateDataElement<ConfigUeTypeahead, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TYPE_AHEAD,
        typeAhead: ['Stockholm', 'Göteborg', 'Östersund'],
        list: fakeList(3),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Kommun', list: [], ...data?.value },
    },
    children
  )

export const fakeUncertainDateElement = (
  data?: PartialCertificateDataElement<ConfigureUeUncertainDate, ValueUncertainDate>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_UNCERTAIN_DATE,
        allowedYears: [new Date().getFullYear() - 1, new Date().getFullYear()],
        unknownYear: true,
        unknownMonth: true,
        ...data?.config,
      },
      value: {
        id: faker.random.alpha(),
        value: '0000-00-00',
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

export const fakeHeaderElement = (
  data?: PartialCertificateDataElement<ConfigUeHeader, ValueHeader>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_HEADER,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.HEADER },
    },
    children
  )

export const fakeCauseOfDeathElement = (
  data?: PartialCertificateDataElement<ConfigureUeCauseOfDeath, ValueCauseOfDeath>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        id: '1',
        type: ConfigTypes.UE_CAUSE_OF_DEATH,
        label: 'A',
        title: 'Den terminala dödsorsaken var',
        specifications: [
          { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
          { id: 'KRONISK', label: 'Kronisk' },
          { id: 'PLOTSLIG', label: 'Plötslig' },
        ],
        ...data?.config,
      },
      value: {
        id: '1',
        description: 'Unguis incarnatus',
        debut: '1960-04-23',
        specification: 'KRONISK',
        ...data?.value,
        type: CertificateDataValueType.CAUSE_OF_DEATH,
      },
    },
    children
  )

export const fakeCauseOfDeathListElement = (
  data?: PartialCertificateDataElement<ConfigureUeCauseOfDeathList, ValueCauseOfDeathList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
        list: [
          {
            id: 'A',
            type: ConfigTypes.UE_CAUSE_OF_DEATH,
            label: 'A',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', label: 'Plötslig' },
            ],
          },
          {
            id: 'B',
            type: ConfigTypes.UE_CAUSE_OF_DEATH,
            label: 'B',
            title: 'Som var en följd av',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', label: 'Plötslig' },
            ],
          },
          {
            id: 'C',
            type: ConfigTypes.UE_CAUSE_OF_DEATH,
            label: 'C',
            title: 'Som var en följd av',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', label: 'Plötslig' },
            ],
          },
        ],
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
        list: [
          {
            id: 'A',
            description: 'Unguis incarnatus',
            debut: '1960-04-23',
            specification: 'KRONISK',
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'B',
            description: 'Hallux valgus',
            debut: '1965-04-23',
            specification: 'PLOTSLIG',
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'C',
            description: 'Arthritis urica',
            debut: '1970-04-23',
            specification: 'UPPGIFT_SAKNAS',
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
        ],
      },
    },
    children
  )
