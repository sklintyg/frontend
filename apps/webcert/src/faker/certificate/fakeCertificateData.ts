import faker from 'faker'
import type { PartialDeep } from 'type-fest'
import type {
  CertificateDataConfigType,
  CertificateDataElement,
  ConfigCategory,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxDateRangeList,
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
import { CertificateDataValueType, ConfigLayout } from '../../types/certificate'
import { fakeCityList } from '../fakeCity'
import { fakeId } from '../fakeId'
import { fakeList } from '../fakeList'
import { fakeCertificateConfig } from './fakeCertificateConfig'
import { fakeCertificateValue } from './fakeCertificateValue'

function fakeCertificateDataElement<C extends CertificateDataConfigType, V extends ValueType | null>(
  data: Partial<CertificateDataElement> & {
    config: C
    value: V
  }
): CertificateDataElement & {
  config: C
  value: V
} {
  return {
    id: fakeId(),
    parent: '',
    index: 0,
    visible: true,
    readOnly: false,
    mandatory: false,
    ...data,
    config: data.config,
    value: data.value,
    validation: data?.validation ?? [],
    validationErrors: data?.validationErrors ?? [],
  }
}

function fakeDataElementFactory<C extends CertificateDataConfigType, V extends ValueType | null>(
  cb: (config?: PartialDeep<C>, value?: PartialDeep<V>) => { config: C; value: V }
) {
  return (
    data: Partial<Omit<CertificateDataElement, 'config' | 'value'>> & {
      config?: PartialDeep<C>
      value?: PartialDeep<V>
    }
  ) => {
    const el = fakeCertificateDataElement({ ...data, ...cb(data.config, data.value) })
    return { [el.id]: el }
  }
}

export const fakeCategoryElement = fakeDataElementFactory<ConfigCategory, null>((config) => ({
  config: fakeCertificateConfig.category(config),
  value: null,
}))

export const fakeCheckboxBooleanElement = fakeDataElementFactory<ConfigUeCheckboxBoolean, ValueBoolean>((config, value) => ({
  config: fakeCertificateConfig.checkboxBoolean(config),
  value: fakeCertificateValue.boolean(value),
}))

export const fakeCheckboxCodeElement = fakeDataElementFactory<ConfigUeCheckboxBoolean, ValueCode>((config, value) => ({
  config: fakeCertificateConfig.checkboxBoolean(config),
  value: fakeCertificateValue.code(value),
}))

export const fakeCheckboxMultipleCodeElement = fakeDataElementFactory<ConfigUeCheckboxMultipleCodes, ValueCodeList>((config, value) => ({
  config: fakeCertificateConfig.checkboxMultipleCodes(config),
  value: fakeCertificateValue.codeList(value),
}))

export const fakeDiagnosesElement = fakeDataElementFactory<ConfigUeDiagnoses, ValueDiagnosisList>((config, value) => ({
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

export const fakeICFDataElement = fakeDataElementFactory<ConfigUeIcf, ValueIcf>((config, value) => ({
  config: fakeCertificateConfig.icf({
    header: `header: ${faker.lorem.sentence()}`,
    modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
    collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
    placeholder: `placeholder: ${faker.lorem.sentence()}`,
    ...config,
  }),
  value: fakeCertificateValue.icf(value),
}))

export const fakeCheckboxMultipleDate = fakeDataElementFactory<ConfigUeCheckboxMultipleDate, ValueDateList>((config, value) => ({
  config: fakeCertificateConfig.checkboxMultipleDate({
    list: fakeList(6),
    ...config,
  }),
  value: fakeCertificateValue.dateList(value),
}))

export const fakeCheckboxDateRangeList = fakeDataElementFactory<ConfigUeCheckboxDateRangeList, ValueDateRangeList>((config, value) => ({
  config: fakeCertificateConfig.checkboxDateRangeList({
    list: fakeList(6),
    ...config,
  }),
  value: fakeCertificateValue.dateRangeList(value),
}))

export const fakeRadioMultipleCodeElement = fakeDataElementFactory<ConfigUeRadioMultipleCodes, ValueCode>((config, value) => ({
  config: fakeCertificateConfig.radioMultipleCodes({
    list: fakeList(7),
    layout: ConfigLayout.ROWS,
    ...config,
  }),
  value: fakeCertificateValue.code(value),
}))

export const fakeRadioBooleanElement = fakeDataElementFactory<ConfigUeRadioBoolean, ValueBoolean>((config, value) => ({
  config: fakeCertificateConfig.radioBoolean(config),
  value: fakeCertificateValue.boolean(value),
}))

export const fakeTextAreaElement = fakeDataElementFactory<ConfigUeTextArea, ValueText>((config, value) => ({
  config: fakeCertificateConfig.textArea(config),
  value: fakeCertificateValue.text(value),
}))

export const fakeTextFieldElement = fakeDataElementFactory<ConfigUeTextField, ValueText>((config, value) => ({
  config: fakeCertificateConfig.textField(config),
  value: fakeCertificateValue.text(value),
}))

export const fakeDropdownElement = fakeDataElementFactory<ConfigUeDropdown, ValueCode>((config, value) => ({
  config: fakeCertificateConfig.dropdown({
    list: fakeList(5),
    ...config,
  }),
  value: fakeCertificateValue.code(value),
}))

export const fakeTypeaheadElement = fakeDataElementFactory<ConfigUeTypeahead, ValueText>((config, value) => ({
  config: fakeCertificateConfig.typeahead({
    typeAhead: fakeCityList(),
    ...config,
    placeholder: 'Kommun',
  }),
  value: fakeCertificateValue.text(value),
}))

export const fakeUncertainDateElement = fakeDataElementFactory<ConfigUeUncertainDate, ValueUncertainDate>((config, value) => ({
  config: fakeCertificateConfig.uncertainDate({
    allowedYears: [`${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`],
    unknownYear: true,
    unknownMonth: true,
    ...config,
  }),
  value: fakeCertificateValue.uncertainDate(value),
}))

export const fakeMedicalInvestigationListElement = fakeDataElementFactory<ConfigUeMedicalInvestigationList, ValueMedicalInvestigationList>(
  (config, value) => {
    const typeOptions = [
      { id: '1', label: 'Neuropsykiatriskt utlåtande', code: 'CODE_2' },
      { id: '2', label: 'Underlag från habiliteringen', code: 'CODE_3' },
      { id: '3', label: 'Underlag från arbetsterapeut', code: 'CODE_4' },
    ]
    const valueList = Array.from({ length: 3 }, () =>
      fakeCertificateValue.medicalInvestigation({
        investigationType: {
          id: fakeId(),
          code: faker.random.arrayElement(typeOptions.map((option) => option.code)),
        },
        date: {
          id: fakeId(),
          date: faker.date.past().toISOString().split('T')[0],
        },
        informationSource: {
          id: fakeId(),
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

export const fakeDateElement = fakeDataElementFactory<ConfigUeDate, ValueDate>((config, value) => ({
  config: fakeCertificateConfig.date(config),
  value: fakeCertificateValue.date(value),
}))

export const fakeDateRangeElement = fakeDataElementFactory<ConfigUeDateRange, ValueDateRange>((config, value) => ({
  config: fakeCertificateConfig.dateRange(config),
  value: fakeCertificateValue.dateRange(value),
}))

export const fakeYearElement = fakeDataElementFactory<ConfigUeYear, ValueYear>((config, value) => ({
  config: fakeCertificateConfig.year(config),
  value: fakeCertificateValue.year(value),
}))

export const fakeIntegerElement = fakeDataElementFactory<ConfigUeInteger, ValueInteger>((config, value) => ({
  config: fakeCertificateConfig.integer(config),
  value: fakeCertificateValue.integer(value),
}))

export const fakeHeaderElement = fakeDataElementFactory<ConfigUeHeader, ValueHeader>((config, value) => ({
  config: fakeCertificateConfig.header(config),
  value: fakeCertificateValue.header(value),
}))

export const fakeCauseOfDeathElement = fakeDataElementFactory<ConfigUeCauseOfDeath, ValueCauseOfDeath>((config, value) => {
  const descriptionId = fakeId()
  const debutId = fakeId()

  return {
    config: fakeCertificateConfig.causeOfDeath({
      description: 'Den diagnos eller det tillstånd som ledde till den terminala dödsorsaken',
      label: 'A',
      text: 'Den terminala dödsorsaken var',
      causeOfDeath: {
        id: fakeId(),
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
        id: fakeId(),
        code: faker.random.arrayElement(['UPPGIFT_SAKNAS', 'KRONISK', 'PLOTSLIG']),
      },
      ...value,
    }),
  }
})

export const fakeCauseOfDeathListElement = fakeDataElementFactory<ConfigUeCauseOfDeathList, ValueCauseOfDeathList>((config, value) => {
  const questions = new Array(8).fill(null).map(() => {
    const id = fakeId()
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

export const fakeVisualAcuityElement = fakeDataElementFactory<ConfigUeVisualAcuity, ValueVisualAcuity>((config, value) => {
  const id = fakeId()
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

export const fakeViewTextElement = fakeDataElementFactory<ConfigUeViewText, ValueViewText>((config, value) => ({
  config: fakeCertificateConfig.viewText(config),
  value: fakeCertificateValue.viewText(value),
}))

export const fakeViewListElement = fakeDataElementFactory<ConfigUeViewList, ValueViewList>((config, value) => ({
  config: fakeCertificateConfig.viewList(config),
  value: fakeCertificateValue.viewList(value),
}))

export const fakeViewTableElement = fakeDataElementFactory<ConfigUeViewTable, ValueViewTable>((config, value) => ({
  config: fakeCertificateConfig.viewTable(config),
  value: fakeCertificateValue.viewTable(value),
}))

export const fakeRadioMultipleCodesOptionalDropdown = fakeDataElementFactory<ConfigUeRadioMultipleCodesOptionalDropdown, ValueCode>(
  (config, value) => ({
    config: fakeCertificateConfig.radioMultipleCodesOptionalDropdown(config),
    value: fakeCertificateValue.code(value),
  })
)

export const fakeMessageElement = fakeDataElementFactory<ConfigUeMessage, ValueText>((config, value) => ({
  config: fakeCertificateConfig.message(config),
  value: fakeCertificateValue.text(value),
}))
