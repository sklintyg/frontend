import faker from 'faker'
import { PartialDeep } from 'type-fest'
import {
  CertificateData,
  CertificateDataConfigType,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigCategory,
  ConfigLayout,
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
  ConfigUeInteger,
  ConfigUeMedicalInvestigationList,
  ConfigUeMessage,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  ConfigUeSickLeavePeriod,
  ConfigUeTextArea,
  ConfigUeTextField,
  ConfigUeTypeahead,
  ConfigUeUncertainDate,
  ConfigUeViewList,
  ConfigUeViewTable,
  ConfigUeViewText,
  ConfigUeVisualAcuity,
  ConfigUeYear,
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
  ValueInteger,
  ValueMedicalInvestigationList,
  ValueText,
  ValueType,
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

const fakeDataElement =
  <T extends CertificateDataConfigType, P extends ValueType | null>(
    callback: (config?: PartialDeep<T>, value?: PartialDeep<P>) => { config: T; value: P }
  ) =>
  ({
    config,
    value,
    ...data
  }: PartialDeep<CertificateDataElement> & { config?: PartialDeep<T>; value?: PartialDeep<P> }): CertificateData => {
    const id = data?.id ?? faker.random.alpha({ count: 5 })
    return {
      [id]: {
        parent: '',
        index: 0,
        visible: true,
        readOnly: false,
        mandatory: false,
        id: faker.random.alpha({ count: 5 }),
        ...data,
        validation: data.validation ? data.validation.map(fakeCertificateDataValidation) : [],
        validationErrors: data.validationErrors ? data.validationErrors.map(fakeCertificateValidationError) : [],
        ...callback(config, value),
      },
    }
  }

export const fakeCategoryElement = fakeDataElement<ConfigCategory, null>((config) => ({
  config: fakeCertificateConfig.category(config),
  value: null,
}))

export const fakeCheckboxBooleanElement = fakeDataElement<ConfigUeCheckboxBoolean, ValueBoolean>((config, value) => ({
  config: fakeCertificateConfig.checkboxBoolean(config),
  value: fakeCertificateValue.boolean(value),
}))

export const fakeCheckboxCodeElement = fakeDataElement<ConfigUeCheckboxBoolean, ValueCode>((config, value) => ({
  config: fakeCertificateConfig.checkboxBoolean(config),
  value: fakeCertificateValue.code(value),
}))

export const fakeCheckboxMultipleCodeElement = fakeDataElement<ConfigUeCheckboxMultipleCodes, ValueCodeList>((config, value) => ({
  config: fakeCertificateConfig.checkboxMultipleCodes(config),
  value: fakeCertificateValue.codeList(value),
}))

export const fakeDiagnosesElement = fakeDataElement<ConfigUeDiagnoses, ValueDiagnosisList>((config, value) => ({
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
    ...config,
  }),
  value: fakeCertificateValue.diagnosisList(value),
}))

export const fakeICFDataElement = fakeDataElement<ConfigUeIcf, ValueIcf>((config, value) => ({
  config: fakeCertificateConfig.icf({
    header: `header: ${faker.lorem.sentence()}`,
    modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
    collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
    placeholder: `placeholder: ${faker.lorem.sentence()}`,
    ...config,
  }),
  value: fakeCertificateValue.icf(value),
}))

export const fakeCheckboxMultipleDate = fakeDataElement<ConfigUeCheckboxMultipleDate, ValueDateList>((config, value) => ({
  config: fakeCertificateConfig.checkboxMultipleDate({
    list: fakeList(6),
    ...config,
  }),
  value: fakeCertificateValue.dateList(value),
}))

export const fakeSickLeavePeriod = fakeDataElement<ConfigUeSickLeavePeriod, ValueDateRangeList>((config, value) => ({
  config: fakeCertificateConfig.sickLeavePeriod({
    list: fakeList(6),
    ...config,
  }),
  value: fakeCertificateValue.dateRangeList(value),
}))

export const fakeRadioMultipleCodeElement = fakeDataElement<ConfigUeRadioMultipleCodes, ValueCodeList>((config, value) => ({
  config: fakeCertificateConfig.radioMultipleCodes({
    list: fakeList(7),
    layout: ConfigLayout.ROWS,
    ...config,
  }),
  value: fakeCertificateValue.codeList(value),
}))

export const fakeRadioBooleanElement = fakeDataElement<ConfigUeRadioBoolean, ValueBoolean>((config, value) => ({
  config: fakeCertificateConfig.radioBoolean(config),
  value: fakeCertificateValue.boolean(value),
}))

export const fakeTextAreaElement = fakeDataElement<ConfigUeTextArea, ValueText>((config, value) => ({
  config: fakeCertificateConfig.textArea(config),
  value: fakeCertificateValue.text(value),
}))

export const fakeTextFieldElement = fakeDataElement<ConfigUeTextField, ValueText>((config, value) => ({
  config: fakeCertificateConfig.textField(config),
  value: fakeCertificateValue.text(value),
}))

export const fakeDropdownElement = fakeDataElement<ConfigUeDropdown, ValueCode>((config, value) => ({
  config: fakeCertificateConfig.dropdown({
    list: fakeList(5),
    ...config,
  }),
  value: fakeCertificateValue.code(value),
}))

export const fakeTypeaheadElement = fakeDataElement<ConfigUeTypeahead, ValueText>((config, value) => ({
  config: fakeCertificateConfig.typeahead({
    typeAhead: fakeCityList(),
    ...config,
    placeholder: 'Kommun',
  }),
  value: fakeCertificateValue.text(value),
}))

export const fakeUncertainDateElement = fakeDataElement<ConfigUeUncertainDate, ValueUncertainDate>((config, value) => ({
  config: fakeCertificateConfig.uncertainDate({
    allowedYears: [`${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`],
    unknownYear: true,
    unknownMonth: true,
    ...config,
  }),
  value: fakeCertificateValue.uncertainDate(value),
}))

export const fakeMedicalInvestigationListElement = fakeDataElement<ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList>(
  (config, value) => {
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
          date: faker.date.past().toISOString().split('T')[0],
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

    return {
      config: fakeCertificateConfig.medicalInvestigationList({
        typeText: 'Ange utredning eller underlag',
        dateText: 'Datum',
        informationSourceText: 'Från vilken vårdgivare kan Försäkringskassan hämta information om utredningen/underlaget?',
        informationSourceDescription:
          'Skriv exempelvis Neuropsykiatriska kliniken på X-stads sjukhus eller om patienten själv kommer att bifoga utredningen till sin ansökan.',
        list: configList,
        ...config,
      }),
      value: fakeCertificateValue.medicalInvestigationList({
        list: valueList,
        ...value,
      }),
    }
  }
)

export const fakeDateElement = fakeDataElement<ConfigUeDate, ValueDate>((config, value) => ({
  config: fakeCertificateConfig.date(config),
  value: fakeCertificateValue.date(value),
}))

export const fakeDateRangeElement = fakeDataElement<ConfigUeDateRange, ValueDateRange>((config, value) => ({
  config: fakeCertificateConfig.dateRange(config),
  value: fakeCertificateValue.dateRange(value),
}))

export const fakeYearElement = fakeDataElement<ConfigUeYear, ValueYear>((config, value) => ({
  config: fakeCertificateConfig.year(config),
  value: fakeCertificateValue.year(value),
}))

export const fakeIntegerElement = fakeDataElement<ConfigUeInteger, ValueInteger>((config, value) => ({
  config: fakeCertificateConfig.integer(config),
  value: fakeCertificateValue.integer(value),
}))

export const fakeHeaderElement = fakeDataElement<ConfigUeHeader, ValueHeader>((config, value) => ({
  config: fakeCertificateConfig.header(config),
  value: fakeCertificateValue.header(value),
}))

export const fakeCauseOfDeathElement = fakeDataElement<ConfigUeCauseOfDeath, ValueCauseOfDeath>((config, value) => {
  const descriptionId = faker.random.alpha({ count: 5 })
  const debutId = faker.random.alpha({ count: 5 })

  return {
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
      },
      ...config,
    }),
    value: fakeCertificateValue.causeOfDeath({
      type: CertificateDataValueType.CAUSE_OF_DEATH,
      description: {
        type: CertificateDataValueType.TEXT,
        id: descriptionId,
        text: faker.lorem.words(),
      },
      debut: {
        type: CertificateDataValueType.DATE,
        id: debutId,
        date: faker.date.past().toISOString().split('T')[0],
      },
      specification: {
        type: CertificateDataValueType.CODE,
        id: faker.random.alpha({ count: 5 }),
        code: faker.random.arrayElement(['UPPGIFT_SAKNAS', 'KRONISK', 'PLOTSLIG']),
      },
      ...value,
    }),
  }
})

export const fakeCauseOfDeathListElement = fakeDataElement<ConfigUeCauseOfDeathList, ValueCauseOfDeathList>((config, value) => {
  const questions = new Array(8).fill(null).map(() => {
    const id = faker.random.alpha({ count: 5 })
    return fakeCauseOfDeathElement({ id })[id]
  })

  return {
    config: fakeCertificateConfig.causeOfDeathList({
      text: 'Andra sjukdomar som kan ha bidragit till dödsfallet',
      list: questions.map((question) => (question.config as ConfigUeCauseOfDeath).causeOfDeath),
      ...config,
    }),
    value: fakeCertificateValue.causeOfDeathList({
      list: questions.map((question, index) => {
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
      ...value,
    }),
  }
})

export const fakeVisualAcuityElement = fakeDataElement<ConfigUeVisualAcuity, ValueVisualAcuity>((config, value) => {
  const id = faker.random.alpha({ count: 5 })
  return {
    config: fakeCertificateConfig.visualAcuity({
      description: 'Synskärpan på respektive öga och binokulärt',
      text: 'Synskärpa',
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
      ...config,
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
      ...value,
    }),
  }
})

export const fakeViewTextElement = fakeDataElement<ConfigUeViewText, ValueViewText>((config, value) => ({
  config: fakeCertificateConfig.viewText(config),
  value: fakeCertificateValue.viewText(value),
}))

export const fakeViewListElement = fakeDataElement<ConfigUeViewList, ValueViewList>((config, value) => ({
  config: fakeCertificateConfig.viewList(config),
  value: fakeCertificateValue.viewList(value),
}))

export const fakeViewTableElement = fakeDataElement<ConfigUeViewTable, ValueViewTable>((config, value) => ({
  config: fakeCertificateConfig.viewTable(config),
  value: fakeCertificateValue.viewTable(value),
}))

export const fakeRadioMultipleCodesOptionalDropdown = fakeDataElement<ConfigUeRadioMultipleCodesOptionalDropdown, ValueCode>(
  (config, value) => ({
    config: fakeCertificateConfig.radioMultipleCodesOptionalDropdown(config),
    value: fakeCertificateValue.code(value),
  })
)

export const fakeMessageElement = fakeDataElement<ConfigUeMessage, ValueText>((config, value) => ({
  config: fakeCertificateConfig.message(config),
  value: fakeCertificateValue.text(value),
}))
