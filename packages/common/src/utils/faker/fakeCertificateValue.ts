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
import { merge } from 'lodash'

type FakeElementValueCallback<T> = (value?: PartialDeep<T>) => T

const fakeDataElementValue = <T extends ValueType>(callback: FakeElementValueCallback<T>) => (override?: PartialDeep<T>): T =>
  merge(callback(override), override)

const fakeBoolean = fakeDataElementValue<ValueBoolean>(() => ({
  type: CertificateDataValueType.BOOLEAN,
  id: faker.random.alpha({ count: 5 }),
  selected: false,
}))

const fakeCode = fakeDataElementValue<ValueCode>(() => ({
  type: CertificateDataValueType.CODE,
  id: faker.random.alpha({ count: 5 }),
  code: '',
}))

const fakeCodeList = fakeDataElementValue<ValueCodeList>((override) => ({
  type: CertificateDataValueType.CODE_LIST,
  list: (override?.list ?? []).map(fakeCode),
}))

const fakeDate = fakeDataElementValue<ValueDate>(() => ({
  type: CertificateDataValueType.DATE,
  id: faker.random.alpha({ count: 5 }),
  date: undefined,
}))

const fakeDateList = fakeDataElementValue<ValueDateList>((override) => ({
  type: CertificateDataValueType.DATE_LIST,
  list: (override?.list ?? []).map(fakeDate),
}))

const fakeDateRange = fakeDataElementValue<ValueDateRange>(() => ({
  type: CertificateDataValueType.DATE_RANGE,
  id: faker.random.alpha({ count: 5 }),
}))

const fakeDateRangeList = fakeDataElementValue<ValueDateRangeList>((override) => ({
  type: CertificateDataValueType.DATE_RANGE_LIST,
  list: (override?.list ?? []).map(fakeDateRange),
}))

const fakeDiagnosis = fakeDataElementValue<ValueDiagnosis>(() => ({
  type: CertificateDataValueType.DIAGNOSIS,
  id: faker.random.alpha({ count: 5 }),
  terminology: '',
  code: '',
  description: '',
}))

const fakeDiagnosisList = fakeDataElementValue<ValueDiagnosisList>((override) => ({
  type: CertificateDataValueType.DIAGNOSIS_LIST,
  list: (override?.list ?? []).map(fakeDiagnosis),
}))

const fakeDouble = fakeDataElementValue<ValueDouble>(() => ({
  type: CertificateDataValueType.DOUBLE,
  id: faker.random.alpha({ count: 5 }),
  value: null,
}))

const fakeHeader = fakeDataElementValue<ValueHeader>(() => ({
  type: CertificateDataValueType.HEADER,
  id: faker.random.alpha({ count: 5 }),
}))

const fakeICF = fakeDataElementValue<ValueIcf>(() => ({
  type: CertificateDataValueType.ICF,
  id: faker.random.alpha({ count: 5 }),
  // icfCodes: [],
  text: null,
}))

const fakeText = fakeDataElementValue<ValueText>(() => ({
  type: CertificateDataValueType.TEXT,
  id: faker.random.alpha({ count: 5 }),
  text: null,
}))

const fakeUncertainDate = fakeDataElementValue<ValueUncertainDate>(() => ({
  type: CertificateDataValueType.UNCERTAIN_DATE,
  id: faker.random.alpha({ count: 5 }),
  value: null,
}))

const fakeCauseOfDeath = fakeDataElementValue<ValueCauseOfDeath>((override) => ({
  type: CertificateDataValueType.CAUSE_OF_DEATH,
  id: faker.random.alpha({ count: 5 }),
  specification: fakeCode(override?.specification),
  debut: fakeDate(override?.debut),
  description: fakeText(override?.description),
}))

const fakeCauseOfDeathList = fakeDataElementValue<ValueCauseOfDeathList>((override) => ({
  type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
  list: (override?.list ?? []).map(fakeCauseOfDeath),
}))

const fakeMedicalInvestigation = fakeDataElementValue<ValueMedicalInvestigation>((override) => ({
  type: CertificateDataValueType.MEDICAL_INVESTIGATION,
  investigationType: fakeCode(override?.investigationType),
  date: fakeDate(override?.date),
  informationSource: fakeText(override?.informationSource),
}))

const fakeMedicalInvestigationList = fakeDataElementValue<ValueMedicalInvestigationList>((override) => ({
  type: CertificateDataValueType.MEDICAL_INVESTIGATION_LIST,
  list: (override?.list ?? []).map(fakeMedicalInvestigation),
}))

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

const fakeViewText = fakeDataElementValue<ValueViewText>(() => ({
  type: CertificateDataValueType.VIEW_TEXT,
  text: '',
}))

const fakeViewList = fakeDataElementValue<ValueViewList>((override) => ({
  type: CertificateDataValueType.VIEW_LIST,
  list: (override?.list ?? []).map((data) => ({
    type: CertificateDataValueType.VIEW_TEXT,
    text: '',
    ...data,
  })),
}))

const fakeViewTable = fakeDataElementValue<ValueViewTable>((override) => ({
  type: CertificateDataValueType.VIEW_TABLE,
  rows: (override?.rows ?? []).map((row) => ({
    type: CertificateDataValueType.VIEW_ROW,
    ...row,
    columns: (row?.columns ?? []).map((column) => ({
      id: faker.random.alpha({ count: 5 }),
      type: CertificateDataValueType.TEXT,
      text: null,
      ...column,
    })),
  })),
}))

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
  viewList: fakeViewList,
  viewTable: fakeViewTable,
  viewText: fakeViewText,
  visualAcuity: fakeVisualAcuity,
}
