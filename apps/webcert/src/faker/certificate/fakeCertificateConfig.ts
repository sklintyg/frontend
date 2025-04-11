import faker from 'faker'
import { merge } from 'lodash-es'
import type { PartialDeep } from 'type-fest'
import type {
  CertificateDataConfigType,
  ConfigAccordion,
  ConfigCategory,
  ConfigEyeAcuity,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxDate,
  ConfigUeCheckboxDateRange,
  ConfigUeCheckboxDateRangeList,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeCodeItem,
  ConfigUeDate,
  ConfigUeDateRange,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeHeader,
  ConfigUeIcf,
  ConfigUeInteger,
  ConfigUeMedicalInvestigationList,
  ConfigUeMessage,
  ConfigUePeriod,
  ConfigUeRadioBoolean,
  ConfigUeRadioCode,
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
} from '../../types/certificate'
import { ConfigLayout, ConfigTypes, MessageLevel } from '../../types/certificate'
import { fakeId } from '../fakeId'

export const fakeConfigAccordion = (data?: Partial<ConfigAccordion>): ConfigAccordion => ({
  openText: faker.lorem.words(),
  closeText: faker.lorem.words(),
  header: faker.lorem.words(),
  ...data,
})

type FakeElementConfigCallback<T> = (config?: PartialDeep<T>) => T
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

const fakeDataElementConfig =
  <T extends CertificateDataConfigType>(callback: FakeElementConfigCallback<Optional<T, 'text' | 'description'>>) =>
  (override?: PartialDeep<T>): T =>
    merge(callback(override), {
      text: 'test',
      description: 'description',
      accordion: fakeConfigAccordion(override?.accordion),
      ...override,
    }) as T

const fakeCategory = fakeDataElementConfig<ConfigCategory>(() => ({
  type: ConfigTypes.CATEGORY,
}))

const fakeCodeItem = (data?: Partial<ConfigUeCodeItem>): ConfigUeCodeItem => ({
  id: fakeId(),
  code: fakeId().toUpperCase(),
  label: faker.lorem.sentence(3),
  ...data,
})

const fakeCauseOfDeath = fakeDataElementConfig<ConfigUeCauseOfDeath>((override) => ({
  type: ConfigTypes.UE_CAUSE_OF_DEATH,
  label: 'A',
  title: faker.lorem.sentence(),
  causeOfDeath: {
    id: fakeId(),
    debutId: fakeId(),
    descriptionId: fakeId(),
    ...override?.causeOfDeath,
    specifications: (override?.causeOfDeath?.specifications ?? []).map(fakeCodeItem),
  },
}))

const fakeCauseOfDeathList = fakeDataElementConfig<ConfigUeCauseOfDeathList>((override) => ({
  type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
  itemCount: undefined,
  list: (override?.list ?? []).map((data) => fakeCauseOfDeath({ causeOfDeath: data }).causeOfDeath),
}))

const fakeCheckboxBoolean = fakeDataElementConfig<ConfigUeCheckboxBoolean>(() => ({
  type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
  id: fakeId(),
  label: faker.lorem.sentence(3),
  selectedText: 'Ja',
  unselectedText: 'Nej',
}))

const fakeCheckboxDate = fakeDataElementConfig<ConfigUeCheckboxDate>(() => ({
  type: ConfigTypes.UE_CHECKBOX_DATE,
  id: fakeId(),
  label: faker.lorem.sentence(3),
}))

const fakeCheckboxDateRange = fakeDataElementConfig<ConfigUeCheckboxDateRange>(() => ({
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE_RANGE,
  id: fakeId(),
  label: faker.lorem.sentence(3),
}))

const fakeCheckboxMultipleCodes = fakeDataElementConfig<ConfigUeCheckboxMultipleCodes>((override) => ({
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
  list: (override?.list ?? []).map((data) => ({
    id: fakeId(),
    label: faker.lorem.sentence(3),
    disabled: undefined,
    ...data,
  })),
  layout: ConfigLayout.ROWS,
}))

const fakeCheckboxMultipleDate = fakeDataElementConfig<ConfigUeCheckboxMultipleDate>((override) => ({
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
  list: (override?.list ?? []).map((data) => fakeCheckboxDate(data)),
}))

const fakeDate = fakeDataElementConfig<ConfigUeDate>(() => ({
  type: ConfigTypes.UE_DATE,
  id: fakeId(),
}))

const fakeDateRange = fakeDataElementConfig<ConfigUeDateRange>(() => ({
  type: ConfigTypes.UE_DATE_RANGE,
  id: fakeId(),
  fromLabel: 'Fr.o.m',
  toLabel: 't.o.m',
}))

const fakeDiagnoses = fakeDataElementConfig<ConfigUeDiagnoses>((override) => ({
  type: ConfigTypes.UE_DIAGNOSES,
  terminology: (override?.terminology ?? []).map((data) => ({
    id: fakeId(),
    label: faker.lorem.sentence(3),
    ...data,
  })),
  list: (override?.list ?? []).map((data) => ({
    id: fakeId(),
    ...data,
  })),
}))

const fakeDropdown = fakeDataElementConfig<ConfigUeDropdown>((override) => ({
  type: ConfigTypes.UE_DROPDOWN,
  label: faker.lorem.sentence(3),
  list: (override?.list ?? []).map((data) => ({
    id: fakeId(),
    label: faker.lorem.sentence(3),
    ...data,
  })),
}))

const fakeHeader = fakeDataElementConfig<ConfigUeHeader>(() => ({
  type: ConfigTypes.UE_HEADER,
  id: fakeId(),
  label: faker.lorem.sentence(3),
}))

const fakeIcf = fakeDataElementConfig<ConfigUeIcf>(() => ({
  type: ConfigTypes.UE_ICF,
  modalLabel: faker.lorem.sentence(3),
  collectionsLabel: faker.lorem.sentence(3),
  placeholder: faker.lorem.sentence(3),
  id: fakeId(),
  label: faker.lorem.sentence(3),
}))

const fakeMedicalInvestigationList = fakeDataElementConfig<ConfigUeMedicalInvestigationList>((override) => ({
  type: ConfigTypes.UE_MEDICAL_INVESTIGATION,
  typeText: faker.lorem.sentence(),
  dateText: faker.lorem.sentence(),
  informationSourceText: faker.lorem.sentence(),
  informationSourceDescription: faker.lorem.sentence(),
  list: (override?.list ?? []).map((data) => ({
    investigationTypeId: fakeId(),
    informationSourceId: fakeId(),
    dateId: fakeId(),
    ...data,
    typeOptions: (data?.typeOptions ?? []).map(fakeCodeItem),
  })),
}))

const fakeMessage = fakeDataElementConfig<ConfigUeMessage>((override) => ({
  type: ConfigTypes.UE_MESSAGE,
  id: fakeId(),
  message: {
    level: MessageLevel.INFO,
    content: faker.lorem.sentence(),
    ...override?.message,
  },
}))

const fakeRadioBoolean = fakeDataElementConfig<ConfigUeRadioBoolean>(() => ({
  type: ConfigTypes.UE_RADIO_BOOLEAN,
  id: fakeId(),
  selectedText: 'Ja',
  unselectedText: 'Nej',
}))

const fakeRadioCode = fakeDataElementConfig<ConfigUeRadioCode>(() => ({
  type: ConfigTypes.UE_RADIO_CODE,
  id: fakeId(),
  label: faker.lorem.sentence(3),
}))

const fakeRadioMultipleCodes = fakeDataElementConfig<ConfigUeRadioMultipleCodes>((override) => ({
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
  id: fakeId(),
  list: (override?.list ?? []).map(fakeRadioCode),
  layout: ConfigLayout.ROWS,
}))

const fakeRadioMultipleCodesOptionalDropdown = fakeDataElementConfig<ConfigUeRadioMultipleCodesOptionalDropdown>((override) => ({
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN,
  id: fakeId(),
  list: (override?.list ?? []).map((data) => ({
    id: fakeId(),
    label: faker.lorem.sentence(3),
    dropdownQuestionId: fakeId(),
    ...data,
  })),
}))

const fakeCheckboxDateRangeList = fakeDataElementConfig<ConfigUeCheckboxDateRangeList>((override) => ({
  type: ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST,
  previousDateRangeText: faker.lorem.sentence(3),
  hideWorkingHours: true,
  list: (override?.list ?? []).map(fakeCheckboxDateRange),
}))

const fakeTextArea = fakeDataElementConfig<ConfigUeTextArea>(() => ({
  type: ConfigTypes.UE_TEXTAREA,
  id: fakeId(),
}))

const fakeTextField = fakeDataElementConfig<ConfigUeTextField>(() => ({
  type: ConfigTypes.UE_TEXTFIELD,
  id: fakeId(),
}))

const fakeTypeahead = fakeDataElementConfig<ConfigUeTypeahead>((override) => ({
  type: ConfigTypes.UE_TYPE_AHEAD,
  id: fakeId(),
  typeAhead: (override?.typeAhead ?? []).map((data) => data ?? ''),
  text: faker.lorem.sentence(),
  label: faker.lorem.sentence(3),
  placeholder: faker.lorem.sentence(3),
}))

const fakeUncertainDate = fakeDataElementConfig<ConfigUeUncertainDate>((override) => ({
  type: ConfigTypes.UE_UNCERTAIN_DATE,
  id: fakeId(),
  label: faker.lorem.sentence(3),
  allowedYears: (override?.allowedYears ?? []).map((data) => data ?? ''),
  unknownYear: false,
  unknownMonth: false,
}))

const fakeViewList = fakeDataElementConfig<ConfigUeViewList>(() => ({
  type: ConfigTypes.UE_VIEW_LIST,
  label: undefined,
}))

const fakeViewTable = fakeDataElementConfig<ConfigUeViewTable>((override) => ({
  type: ConfigTypes.UE_VIEW_TABLE,
  columns: (override?.columns ?? []).map((data) => ({
    id: fakeId(),
    text: faker.lorem.sentence(),
    ...data,
  })),
}))

const fakeViewText = fakeDataElementConfig<ConfigUeViewText>(() => ({
  type: ConfigTypes.UE_VIEW_TEXT,
  label: undefined,
}))

const fakeEyeAcuity = (data?: PartialDeep<ConfigEyeAcuity>): ConfigEyeAcuity => ({
  label: faker.lorem.sentence(3),
  withoutCorrectionId: fakeId(),
  withCorrectionId: fakeId(),
  ...data,
})

const fakeVisualAcuity = fakeDataElementConfig<ConfigUeVisualAcuity>((override) => ({
  type: ConfigTypes.UE_VISUAL_ACUITY,
  withoutCorrectionLabel: faker.lorem.sentence(3),
  withCorrectionLabel: faker.lorem.sentence(3),
  contactLensesLabel: faker.lorem.sentence(3),
  rightEye: fakeEyeAcuity(override?.rightEye),
  leftEye: fakeEyeAcuity(override?.leftEye),
  binocular: fakeEyeAcuity(override?.binocular),
}))

const fakeYear = fakeDataElementConfig<ConfigUeYear>(() => ({
  type: ConfigTypes.UE_YEAR,
  id: fakeId(),
  minYear: undefined,
  maxYear: undefined,
}))

const fakeInteger = fakeDataElementConfig<ConfigUeInteger>(() => ({
  type: ConfigTypes.UE_INTEGER,
  id: fakeId(),
  min: undefined,
  max: undefined,
}))

const fakePeriod = fakeDataElementConfig<ConfigUePeriod>((override) => ({
  type: ConfigTypes.UE_PERIOD,
  fromDate: fakeDate(override?.fromDate),
  toDate: fakeDate(override?.toDate),
}))

export const fakeCertificateConfig = {
  category: fakeCategory,
  causeOfDeath: fakeCauseOfDeath,
  causeOfDeathList: fakeCauseOfDeathList,
  checkboxBoolean: fakeCheckboxBoolean,
  checkboxDate: fakeCheckboxDate,
  checkboxDateRange: fakeCheckboxDateRange,
  checkboxMultipleCodes: fakeCheckboxMultipleCodes,
  checkboxMultipleDate: fakeCheckboxMultipleDate,
  date: fakeDate,
  dateRange: fakeDateRange,
  diagnoses: fakeDiagnoses,
  dropdown: fakeDropdown,
  header: fakeHeader,
  icf: fakeIcf,
  medicalInvestigationList: fakeMedicalInvestigationList,
  message: fakeMessage,
  radioBoolean: fakeRadioBoolean,
  radioCode: fakeRadioCode,
  radioMultipleCodes: fakeRadioMultipleCodes,
  radioMultipleCodesOptionalDropdown: fakeRadioMultipleCodesOptionalDropdown,
  checkboxDateRangeList: fakeCheckboxDateRangeList,
  textArea: fakeTextArea,
  textField: fakeTextField,
  typeahead: fakeTypeahead,
  uncertainDate: fakeUncertainDate,
  viewList: fakeViewList,
  viewTable: fakeViewTable,
  viewText: fakeViewText,
  visualAcuity: fakeVisualAcuity,
  year: fakeYear,
  integer: fakeInteger,
  period: fakePeriod,
}
