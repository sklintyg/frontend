import { faker } from '@faker-js/faker'
import {
  CertificateData,
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigTypes,
  Value,
} from '@frontend/common'

interface PartialCertificateDataElement extends Partial<Omit<CertificateDataElement, 'config' | 'value'>> {
  config?: Partial<CertificateDataConfig>
  value?: Partial<Value> | null
}

interface CertificateDataList {
  id: string
  label: string
}

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

const fakeList = (length = 5): CertificateDataList[] =>
  new Array(length).fill(0).map(() => ({
    id: faker.random.alpha(10),
    label: faker.lorem.sentence(5),
  }))

export const fakeDataElement = (data?: PartialCertificateDataElement, children: CertificateData[] = []): CertificateData => {
  const id = data?.id ?? faker.random.alpha(5)
  let certificateData: CertificateData = {}
  certificateData[id] = {
    parent: '',
    index: 0,
    visible: true,
    readOnly: false,
    mandatory: false,
    validation: [],
    validationErrors: [],
    ...data,
    id,
    config: {
      type: ConfigTypes.CATEGORY,
      text: `${id} - ${faker.lorem.words()}`,
      description: `description: ${faker.lorem.sentence()}`,
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

export const fakeCheckboxBooleanElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
        label: faker.lorem.sentence(),
        text: 'text',
        description: 'description',
        selectedText: 'Ja',
        unselectedText: 'Nej',
      },
      value: {
        type: CertificateDataValueType.BOOLEAN,
        id: faker.random.alpha(10),
      },
      ...data,
    },
    children
  )

export const fakeCheckboxMultipleCodeElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
        label: faker.lorem.sentence(),
        text: `text: ${faker.lorem.sentence()}`,
        selectedText: 'Ja',
        unselectedText: 'Nej',
        list: fakeList(5),
      },
      value: {
        type: CertificateDataValueType.CODE,
        id: faker.random.alpha(10),
        list: [],
      },
      ...data,
    },
    children
  )

export const fakeDiagnosesElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
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
      },
      value: { type: CertificateDataValueType.DIAGNOSIS_LIST, list: [] },
      ...data,
    },
    children
  )

export const fakeICFDataElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_ICF,
        header: `header: ${faker.lorem.sentence()}`,
        modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
        collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
        placeholder: `placeholder: ${faker.lorem.sentence()}`,
      },
      value: { id: faker.random.alpha(), type: CertificateDataValueType.ICF, icfCodes: [] },
      ...data,
    },
    children
  )

export const fakeCheckboxMultipleDate = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
        list: fakeList(5),
      },
      value: { type: CertificateDataValueType.DATE_LIST, list: [] },
      ...data,
    },
    children
  )

export const fakeRadioMultipleCodeElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
        list: fakeList(5),
      },
      value: { type: CertificateDataValueType.CODE, list: [] },
      ...data,
    },
    children
  )

export const fakeBooleanElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
        selectedText: 'Boolean value = true',
        unselectedText: 'Boolean value = false',
      },
      value: { type: CertificateDataValueType.BOOLEAN, selected: true },
      ...data,
    },
    children
  )

export const fakeTextElement = (data?: PartialCertificateDataElement, children?: CertificateData[]): CertificateData =>
  fakeDataElement(
    {
      config: {
        type: ConfigTypes.UE_TEXTAREA,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Text', limit: 50 },
      ...data,
    },
    children
  )
