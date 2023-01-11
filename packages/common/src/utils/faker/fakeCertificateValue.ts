import faker from 'faker'
import { PartialDeep } from 'type-fest'
import {
  CertificateDataValueType,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueDiagnosis,
  ValueDiagnosisList,
  ValueHeader,
  ValueIcf,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
  ValueText,
  ValueType,
  ValueUncertainDate,
  ValueViewList,
  ValueDouble,
  ValueVisualAcuity,
  ValueEyeAcuity,
  ValueViewTable,
  ValueViewText,
} from '../../types/certificate'

type FakeElementValueCallback<T> = (value?: PartialDeep<T>) => T

const fakeDataElementValue = <T extends ValueType>(val: T | FakeElementValueCallback<T>) => (override?: PartialDeep<T>) => ({
  ...(typeof val === 'function' ? val() : val),
  ...(typeof val === 'function' ? { ...override, ...val(override) } : override),
})

const fakeBoolean = fakeDataElementValue<ValueBoolean>({
  type: CertificateDataValueType.BOOLEAN,
  id: faker.random.alpha({ count: 5 }),
  selected: false,
})

const fakeCode = fakeDataElementValue<ValueCode>({
  type: CertificateDataValueType.CODE,
  id: faker.random.alpha({ count: 5 }),
  code: '',
})

const fakeCodeList = fakeDataElementValue<ValueCodeList>({
  type: CertificateDataValueType.CODE_LIST,
  list: [],
})

const fakeDate = fakeDataElementValue<ValueDate>({
  type: CertificateDataValueType.DATE,
  id: faker.random.alpha({ count: 5 }),
  date: undefined,
})

const fakeDateList = fakeDataElementValue<ValueDateList>({
  type: CertificateDataValueType.DATE_LIST,
  list: [],
})

const fakeDateRange = fakeDataElementValue<ValueDateRange>({
  type: CertificateDataValueType.DATE_RANGE,
  id: faker.random.alpha({ count: 5 }),
})

const fakeDateRangeList = fakeDataElementValue<ValueDateRangeList>({
  type: CertificateDataValueType.DATE_RANGE_LIST,
  list: [],
})

const fakeDiagnosis = fakeDataElementValue<ValueDiagnosis>({
  type: CertificateDataValueType.DIAGNOSIS,
  id: faker.random.alpha({ count: 5 }),
  terminology: '',
  code: '',
  description: '',
})

const fakeDiagnosisList = fakeDataElementValue<ValueDiagnosisList>({
  type: CertificateDataValueType.DIAGNOSIS_LIST,
  list: [],
})

const fakeDouble = fakeDataElementValue<ValueDouble>({
  type: CertificateDataValueType.DOUBLE,
  id: faker.random.alpha({ count: 5 }),
  value: null,
})

const fakeHeader = fakeDataElementValue<ValueHeader>({
  type: CertificateDataValueType.HEADER,
  id: faker.random.alpha({ count: 5 }),
})

const fakeICF = fakeDataElementValue<ValueIcf>({
  type: CertificateDataValueType.ICF,
  id: faker.random.alpha({ count: 5 }),
  icfCodes: [],
  text: null,
})

const fakeText = fakeDataElementValue<ValueText>({
  type: CertificateDataValueType.TEXT,
  id: faker.random.alpha({ count: 5 }),
  text: null,
})

const fakeUncertainDate = fakeDataElementValue<ValueUncertainDate>({
  type: CertificateDataValueType.UNCERTAIN_DATE,
  id: faker.random.alpha({ count: 5 }),
  value: null,
})

const fakeCauseOfDeath = fakeDataElementValue<ValueCauseOfDeath>((override) => ({
  type: CertificateDataValueType.CAUSE_OF_DEATH,
  id: faker.random.alpha({ count: 5 }),
  specification: fakeCode(override?.specification),
  debut: fakeDate(override?.debut),
  description: fakeText(override?.description),
}))

const fakeCauseOfDeathList = fakeDataElementValue<ValueCauseOfDeathList>({
  type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
  list: [],
})

const fakeMedicalInvestigation = fakeDataElementValue<ValueMedicalInvestigation>((override) => ({
  type: CertificateDataValueType.MEDICAL_INVESTIGATION,
  investigationType: fakeCode(override?.investigationType),
  date: fakeDate(override?.date),
  informationSource: fakeText(override?.informationSource),
}))

const fakeMedicalInvestigationList = fakeDataElementValue<ValueMedicalInvestigationList>({
  type: CertificateDataValueType.MEDICAL_INVESTIGATION_LIST,
  list: [],
})

const fakeEyeAcuity = fakeDataElementValue<ValueEyeAcuity>((override) => ({
  type: CertificateDataValueType.VISUAL_ACUITY,
  withoutCorrection: fakeDouble(override?.withoutCorrection),
  withCorrection: fakeDouble(override?.withCorrection),
  contactLenses: fakeBoolean(override?.contactLenses),
}))

const fakeVisualAcuity = fakeDataElementValue<ValueVisualAcuity>((override) => ({
  type: CertificateDataValueType.VISUAL_ACUITIES,
  rightEye: fakeEyeAcuity(override?.rightEye),
  leftEye: fakeEyeAcuity(override?.leftEye),
  binocular: fakeEyeAcuity(override?.binocular),
}))
const fakeViewText = fakeDataElementValue<ValueViewText>({
  type: CertificateDataValueType.VIEW_TEXT,
  text: '',
})
const fakeViewList = fakeDataElementValue<ValueViewList>({
  type: CertificateDataValueType.VIEW_LIST,
  list: [],
})
const fakeViewTable = fakeDataElementValue<ValueViewTable>({
  type: CertificateDataValueType.VIEW_TABLE,
  rows: [],
})

export const fakeCertificateValue = {
  boolean: fakeBoolean,
  causeOfDeath: fakeCauseOfDeath,
  causeOfDeathList: fakeCauseOfDeathList,
  code: fakeCode,
  codeList: fakeCodeList,
  date: fakeDate,
  dateList: fakeDateList,
  dateRange: fakeDateRange,
  dateRangeList: fakeDateRangeList,
  diagnosis: fakeDiagnosis,
  diagnosisList: fakeDiagnosisList,
  double: fakeDouble,
  eyeAcuity: fakeEyeAcuity,
  header: fakeHeader,
  icf: fakeICF,
  medicalInvestigation: fakeMedicalInvestigation,
  medicalInvestigationList: fakeMedicalInvestigationList,
  text: fakeText,
  uncertainDate: fakeUncertainDate,
  viewText: fakeViewText,
  viewList: fakeViewList,
  viewTable: fakeViewTable,
  visualAcuity: fakeVisualAcuity,
}
