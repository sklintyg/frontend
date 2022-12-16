import faker from 'faker'
import { merge } from 'lodash'
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
  ConfigUeMedicalInvestigationList,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeTextArea,
  ConfigUeTextField,
  ConfigUeTypeahead,
  ConfigAccordion,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeUncertainDate,
  Value,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueHeader,
  ValueIcf,
  ValueText,
  ValueUncertainDate,
  ValueDiagnosisList,
  ValueMedicalInvestigationList,
} from '../../types/certificate'
import { fakeCertificateDataValidation, fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeCityList } from './fakeCity'
import { fakeList } from './fakeList'
import { fakeCertificateValue } from './fakeCertificateValue'

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

export const fakeDataElementConfigAccordion = (data?: Partial<ConfigAccordion>): ConfigAccordion => ({
  openText: faker.lorem.words(),
  closeText: faker.lorem.words(),
  header: faker.lorem.words(),
  ...data,
})

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
    config: merge(
      {
        type: ConfigTypes.CATEGORY,
        text: `${id} - ${faker.lorem.words()}`,
        description: data?.config?.description ?? type === ConfigTypes.CATEGORY ? `description: ${faker.lorem.sentence()}` : '',
      },
      data?.config,
      data?.config?.accordion && { accordion: fakeDataElementConfigAccordion(data.config.accordion) },
      { id }
    ),
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
  data?: PartialCertificateDataElement<ConfigUeCheckboxBoolean, ValueBoolean>,
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
      value: fakeCertificateValue.boolean(data?.value),
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
      value: fakeCertificateValue.codeList(data?.value),
    },
    children
  )

export const fakeDiagnosesElement = (
  data?: PartialCertificateDataElement<ConfigUeDiagnoses, ValueDiagnosisList>,
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
      value: fakeCertificateValue.diagnosisList(data?.value),
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
      value: fakeCertificateValue.icf(data?.value),
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
      value: fakeCertificateValue.dateList(data?.value),
    },
    children
  )

export const fakeRadioMultipleCodeElement = (
  data?: PartialCertificateDataElement<ConfigUeRadioMultipleCodes, ValueCodeList>,
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
      value: fakeCertificateValue.codeList(data?.value),
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
      value: fakeCertificateValue.boolean(data?.value),
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
      value: fakeCertificateValue.text(data?.value),
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
      value: fakeCertificateValue.text(data?.value),
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
      value: fakeCertificateValue.code(data?.value),
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
        typeAhead: fakeCityList(),
        list: fakeList(3),
        ...data?.config,
        placeholder: 'Kommun',
      },
      value: fakeCertificateValue.text(data?.value),
    },
    children
  )

export const fakeUncertainDateElement = (
  data?: PartialCertificateDataElement<ConfigUeUncertainDate, ValueUncertainDate>,
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
      value: fakeCertificateValue.uncertainDate(data?.value),
    },
    children
  )

export const fakeMedicalInvestigationListElement = (
  data?: PartialCertificateDataElement<ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList>,
  children?: CertificateData[]
): CertificateData => {
  const typeOptions = [
    { id: '1', label: 'Neuropsykiatriskt utlåtande', code: 'CODE_2' },
    { id: '2', label: 'Underlag från habiliteringen', code: 'CODE_3' },
    { id: '3', label: 'Underlag från arbetsterapeut', code: 'CODE_4' },
  ]
  const valueList = Array.from({ length: 3 }, () =>
    fakeCertificateValue.medicalInvestigation({
      investigationType: {
        id: faker.random.alpha({ count: 5 }),
        code: faker.random.arrayElement(typeOptions.map((option) => option.label)),
      },
      date: {
        id: faker.random.alpha({ count: 5 }),
        date: faker.date
          .past()
          .toISOString()
          .split('T')[0],
      },
      informationSource: {
        id: faker.random.alpha({ count: 5 }),
        text: faker.lorem.words(),
      },
    })
  )
  const configList = valueList.map(({ investigationType, informationSource, date }) => ({
    investigationTypeId: investigationType.id,
    informationSourceId: informationSource.id,
    dateId: date.id,
    typeOptions,
  }))

  return fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_MEDICAL_INVESTIGATION,
        typeText: 'Ange utredning eller underlag',
        dateText: 'Datum',
        informationSourceText: 'Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?',
        informationSourceDescription:
          'Skriv exempelvis Neuropsykiatriska kliniken på X-stads sjukhus eller om patienten själv kommer att bifoga utredningen till sin ansökan.',
        list: configList,
        ...data?.config,
      },
      value: fakeCertificateValue.medicalInvestigationList({
        list: valueList,
        ...data?.value,
      }),
    },
    children
  )
}

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
      // value: { type: CertificateDataValueType.DATE, date: '2022-09-29', ...data?.value },
      value: fakeCertificateValue.date(data?.value),
      validation: [
        fakeCertificateDataValidation({
          type: CertificateDataValidationType.MAX_DATE_VALIDATION,
          expression: data?.id ? `'${data.id.toUpperCase()}'` : undefined,
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
  data?: PartialCertificateDataElement<ConfigUeCauseOfDeath, ValueCauseOfDeath>,
  children?: CertificateData[]
): CertificateData => {
  const descriptionId = faker.random.alpha({ count: 5 })
  const debutId = faker.random.alpha({ count: 5 })

  return fakeDataElement(
    {
      ...data,
      config: {
        description: 'Den diagnos eller det tillstånd som ledde till den terminala dödsorsaken',
        label: 'A',
        text: 'Den terminala dödsorsaken var',
        type: ConfigTypes.UE_CAUSE_OF_DEATH,
        causeOfDeath: {
          id: faker.random.alpha({ count: 5 }),
          debutId: debutId,
          descriptionId: descriptionId,
          specifications: [
            { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
            { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
            { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
          ],
          ...data?.config?.causeOfDeath,
        },
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.CAUSE_OF_DEATH,
        description: {
          type: CertificateDataValueType.TEXT,
          id: descriptionId,
          text: faker.lorem.words(),
          ...data?.value?.description,
        },
        debut: {
          type: CertificateDataValueType.DATE,
          id: debutId,
          date: faker.date
            .past()
            .toISOString()
            .split('T')[0],
          ...data?.value?.debut,
        },
        specification: {
          type: CertificateDataValueType.CODE,
          id: faker.random.alpha({ count: 5 }),
          code: faker.random.arrayElement(['UPPGIFT_SAKNAS', 'KRONISK', 'PLOTSLIG']),
          ...data?.value?.specification,
        },
      },
    },
    children
  )
}

export const fakeCauseOfDeathListElement = (
  data?: PartialCertificateDataElement<ConfigUeCauseOfDeathList, ValueCauseOfDeathList>,
  children?: CertificateData[]
): CertificateData => {
  const questions = new Array(8).fill(null).map(() => {
    const id = faker.random.alpha({ count: 5 })
    return fakeCauseOfDeathElement({ id })[id]
  })

  return fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
        text: 'Andra sjukdomar som kan ha bidragit till dödsfallet',
        ...data?.config,
        list: data?.config?.list ?? questions.map((question) => question.config.causeOfDeath),
      },
      value: {
        type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
        ...data?.value,
        list:
          data?.value?.list ??
          questions
            .map((question) => question.value as ValueCauseOfDeath)
            .map((value, index) =>
              index > 0
                ? {
                    ...value,
                    description: { ...value.description, text: null },
                    debut: { ...value.debut, date: undefined },
                    specification: { ...value.specification, code: '' },
                  }
                : value
            ),
      },
    },
    children
  )
}
