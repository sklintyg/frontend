import { ConfigUeViewList, ConfigUeViewTable } from '@frontend/common'
import faker from 'faker'
import { merge } from 'lodash'
import { Merge, PartialDeep } from 'type-fest'
import {
  CertificateData,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigAccordion,
  ConfigCategory,
  ConfigLayout,
  ConfigTypes,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDate,
  ConfigUeDateRange,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeHeader,
  ConfigUeIcf,
  ConfigUeMedicalInvestigationList,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeSickLeavePeriod,
  ConfigUeTextArea,
  ConfigUeTextField,
  ConfigUeTypeahead,
  ConfigUeUncertainDate,
  ConfigUeViewText,
  ConfigUeVisualAcuity,
  ConfigUeYear,
  Value,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueDiagnosisList,
  ValueHeader,
  ValueIcf,
  ValueMedicalInvestigationList,
  ValueText,
  ValueUncertainDate,
  ValueViewList,
  ValueViewTable,
  ValueViewText,
  ValueVisualAcuity,
  ValueYear,
} from '../../types/certificate'
import { fakeCertificateConfig } from './fakeCertificateConfig'
import { fakeCertificateDataValidation, fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeCertificateValue } from './fakeCertificateValue'
import { fakeCityList } from './fakeCity'
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
      config: fakeCertificateConfig.category(data?.config),
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
      config: fakeCertificateConfig.checkboxBoolean(data?.config),
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
      config: fakeCertificateConfig.checkboxMultipleCodes(data?.config),
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
      config: fakeCertificateConfig.diagnoses({
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
      }),
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
      config: fakeCertificateConfig.icf({
        header: `header: ${faker.lorem.sentence()}`,
        modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
        collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
        placeholder: `placeholder: ${faker.lorem.sentence()}`,
        ...data?.config,
      }),
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
      config: fakeCertificateConfig.checkboxMultipleDate({
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
        list: fakeList(6),
        ...data?.config,
      }),
      value: fakeCertificateValue.dateList(data?.value),
    },
    children
  )

export const fakeSickLeavePeriod = (
  data?: PartialCertificateDataElement<ConfigUeSickLeavePeriod, ValueDateRangeList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: fakeCertificateConfig.sickLeavePeriod({
        list: fakeList(6),
        ...data?.config,
      }),
      value: fakeCertificateValue.dateRangeList(data?.value),
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
      config: fakeCertificateConfig.radioMultipleCodes({
        list: fakeList(7),
        layout: ConfigLayout.ROWS,
        ...data?.config,
      }),
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
      config: fakeCertificateConfig.radioBoolean(data?.config),
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
      config: fakeCertificateConfig.textArea(data?.config),
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
      config: fakeCertificateConfig.textField(data?.config),
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
      config: fakeCertificateConfig.dropdown({
        list: fakeList(5),
        ...data?.config,
      }),
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
      config: fakeCertificateConfig.typeahead({
        typeAhead: fakeCityList(),
        ...data?.config,
        placeholder: 'Kommun',
      }),
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
      config: fakeCertificateConfig.uncertainDate({
        allowedYears: [`${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`],
        unknownYear: true,
        unknownMonth: true,
        ...data?.config,
      }),
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
        code: faker.random.arrayElement(typeOptions.map((option) => option.code)),
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
      config: fakeCertificateConfig.medicalInvestigationList({
        typeText: 'Ange utredning eller underlag',
        dateText: 'Datum',
        informationSourceText: 'Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?',
        informationSourceDescription:
          'Skriv exempelvis Neuropsykiatriska kliniken på X-stads sjukhus eller om patienten själv kommer att bifoga utredningen till sin ansökan.',
        list: configList,
        ...data?.config,
      }),
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
      config: fakeCertificateConfig.date(data?.config),
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

export const fakeDateRangeElement = (
  data?: PartialCertificateDataElement<ConfigUeDateRange, ValueDateRange>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: fakeCertificateConfig.dateRange(data?.config),
      value: fakeCertificateValue.dateRange(data?.value),
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

export const fakeYearElement = (
  data?: PartialCertificateDataElement<ConfigUeYear, ValueYear>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: fakeCertificateConfig.year(data?.config),
      value: fakeCertificateValue.year(data?.value),
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
      config: fakeCertificateConfig.header(data?.config),
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
      config: fakeCertificateConfig.causeOfDeath({
        description: 'Den diagnos eller det tillstånd som ledde till den terminala dödsorsaken',
        label: 'A',
        text: 'Den terminala dödsorsaken var',
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
      }),
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
      config: fakeCertificateConfig.causeOfDeathList({
        text: 'Andra sjukdomar som kan ha bidragit till dödsfallet',
        ...data?.config,
        list:
          data?.config?.list ??
          questions.map((question) => {
            const config = question.config as ConfigUeCauseOfDeath
            return config.causeOfDeath
          }),
      }),
      value: fakeCertificateValue.causeOfDeathList({
        ...data?.value,
        list:
          data?.value?.list ??
          questions.map((question, index) => {
            const value = question.value as ValueCauseOfDeath
            return index > 0
              ? fakeCertificateValue.causeOfDeath({
                  ...value,
                  description: { ...value.description, text: null },
                  debut: { ...value.debut, date: undefined },
                  specification: { ...value.specification, code: '' },
                })
              : fakeCertificateValue.causeOfDeath(value)
          }),
      }),
    },
    children
  )
}

export const fakeVisualAcuityElement = (
  data?: PartialCertificateDataElement<ConfigUeVisualAcuity, ValueVisualAcuity>,
  children?: CertificateData[]
): CertificateData => {
  const id = faker.random.alpha({ count: 5 })

  return fakeDataElement(
    {
      ...data,
      config: fakeCertificateConfig.visualAcuity({
        description: 'Synskärpan på respektive öga och binokulärt',
        text: 'Synskärpa',
        type: ConfigTypes.UE_VISUAL_ACUITY,
        withoutCorrectionLabel: 'Utan korrigering',
        withCorrectionLabel: 'Med korrigering',
        contactLensesLabel: 'Kontaktlinser',
        rightEye: {
          label: 'Höger',
          withoutCorrectionId: `right_without_${id}`,
          withCorrectionId: `right_with_${id}`,
          contactLensesId: `right_contacts_${id}`,
        },
        leftEye: {
          label: 'Vänster',
          withoutCorrectionId: `left_without_${id}`,
          withCorrectionId: `left_with_${id}`,
          contactLensesId: `left_contacts_${id}`,
        },
        binocular: {
          label: 'Binokulärt',
          withoutCorrectionId: `binocular_without_${id}`,
          withCorrectionId: `binocular_with_${id}`,
        },
        ...data?.config,
      }),
      value: fakeCertificateValue.visualAcuity({
        rightEye: {
          withoutCorrection: {
            id: `right_without_${id}`,
          },
          withCorrection: {
            id: `right_with_${id}`,
          },
          contactLenses: {
            id: `right_contacts_${id}`,
          },
        },
        leftEye: {
          withoutCorrection: {
            id: `left_without_${id}`,
          },
          withCorrection: {
            id: `left_with_${id}`,
          },
          contactLenses: {
            id: `left_contacts_${id}`,
          },
        },
        binocular: {
          withoutCorrection: {
            id: `binocular_without_${id}`,
          },
          withCorrection: {
            id: `binocular_with_${id}`,
          },
        },
      }),
    },
    children
  )
}

export const fakeViewTextElement = (
  data?: PartialCertificateDataElement<ConfigUeViewText, ValueViewText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_VIEW_TEXT,
        ...data?.config,
      },
      value: fakeCertificateValue.viewText(data?.value),
    },
    children
  )

export const fakeViewListElement = (
  data?: PartialCertificateDataElement<ConfigUeViewList, ValueViewList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_VIEW_LIST,
        ...data?.config,
      },
      value: fakeCertificateValue.viewList(data?.value),
    },
    children
  )

export const fakeViewTableElement = (
  data?: PartialCertificateDataElement<ConfigUeViewTable, ValueViewTable>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_VIEW_TABLE,
        ...data?.config,
      },
      value: fakeCertificateValue.viewTable(data?.value),
    },
    children
  )
