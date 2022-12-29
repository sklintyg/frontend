import { certificateMiddleware } from '@frontend/webcert/src/store/certificate/certificateMiddleware'
import reducer from '@frontend/webcert/src/store/reducers'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Story } from '@storybook/react'
import faker from 'faker'
import React from 'react'
import { Provider } from 'react-redux'
import {
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeSickLeavePeriod,
  ConfigUeViewTable,
  ConfigViewColumn,
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
  ValueText,
  ValueTextRow,
  ValueViewList,
  ValueViewTable,
  ValueViewText,
} from '../../types/certificate'
import {
  fakeCauseOfDeathElement,
  fakeCauseOfDeathListElement,
  fakeCheckboxDateRangeList,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDiagnosesElement,
  fakeDropdownElement,
  fakeMedicalInvestigationListElement,
  fakeRadioBooleanElement,
  fakeTextAreaElement,
  fakeViewListElement,
  fakeViewTableElement,
  fakeViewTextElement,
} from '../../utils/faker/fakeCertificateData'
import UvText, { Props } from './UvText'

export default {
  title: 'Components/UvText',
  component: UvText,
}
const testStore: EnhancedStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
})

const Template: Story<Props> = (args) => (
  <Provider store={testStore}>
    <UvText {...args} />
  </Provider>
)

export const BooleanValue = Template.bind({})
const boolQuestion = fakeRadioBooleanElement({ id: '1' })['1']
;(boolQuestion.config as ConfigUeCheckboxBoolean).selectedText = 'checked text'
;(boolQuestion.value as ValueBoolean).selected = true
BooleanValue.args = {
  question: boolQuestion,
}

export const CheckboxMultiple = Template.bind({})
const checkboxMultipleQuestion = fakeCheckboxMultipleCodeElement({ id: '1' })['1']
;(checkboxMultipleQuestion.config as ConfigUeCheckboxMultipleCodes).list.forEach((item) =>
  (checkboxMultipleQuestion.value as ValueCodeList).list.push({ id: item.id, code: item.id } as ValueCode)
)
CheckboxMultiple.args = {
  question: checkboxMultipleQuestion,
}

export const TextValue = Template.bind({})
const textQuestion = fakeTextAreaElement({ id: '1' })['1']
;(textQuestion.value as ValueText).text = faker.lorem.sentence(5)
TextValue.args = {
  question: textQuestion,
}

export const DiagnosisList = Template.bind({})
const diagnosisQuestion = fakeDiagnosesElement({ id: '1' })['1']
;(diagnosisQuestion.config as ConfigUeDiagnoses).list.forEach((item) =>
  (diagnosisQuestion.value as ValueDiagnosisList).list.push({
    id: item.id,
    terminology: '',
    code: faker.random.alphaNumeric(4).toUpperCase(),
    description: faker.lorem.sentence(4),
  } as ValueDiagnosis)
)
DiagnosisList.args = {
  question: diagnosisQuestion,
}

export const DropdownValue = Template.bind({})
const dropDownQuestion = fakeDropdownElement({ id: '1' })['1']
;(dropDownQuestion.value as ValueCode).id = (dropDownQuestion.config as ConfigUeDropdown).list[3].id
DropdownValue.args = {
  question: dropDownQuestion,
}

export const CheckboxDateGroup = Template.bind({})
const checkboxDateGroupQuestion = fakeCheckboxMultipleDate({ id: '1' })['1']
;(checkboxDateGroupQuestion.config as ConfigUeCheckboxMultipleDate).list.forEach((item) =>
  (checkboxDateGroupQuestion.value as ValueDateList).list.push({
    id: item.id,
    date: faker.date
      .past()
      .toISOString()
      .split('T')[0],
  } as ValueDate)
)
CheckboxDateGroup.args = {
  question: checkboxDateGroupQuestion,
}

export const SickLeavePeriod = Template.bind({})
const checkboxDateRangeListQuestion = fakeCheckboxDateRangeList({ id: '1' })['1']
;(checkboxDateRangeListQuestion.config as ConfigUeSickLeavePeriod).list.forEach((item) =>
  (checkboxDateRangeListQuestion.value as ValueDateRangeList).list.push({
    id: item.id,
    from: faker.date
      .past()
      .toISOString()
      .split('T')[0],
    to: faker.date
      .past()
      .toISOString()
      .split('T')[0],
  } as ValueDateRange)
)
SickLeavePeriod.args = {
  question: checkboxDateRangeListQuestion,
}

export const MedicalInvestigationsList = Template.bind({})
const medicalInvestigationsListQuestion = fakeMedicalInvestigationListElement({ id: '1' })['1']
MedicalInvestigationsList.args = {
  question: medicalInvestigationsListQuestion,
}

export const CauseOfDeath = Template.bind({})
const causeOfDeathQuestion = fakeCauseOfDeathElement({ id: '1' })['1']
CauseOfDeath.args = {
  question: causeOfDeathQuestion,
}

export const CauseOfDeathList = Template.bind({})
const causeOfDeathListQuestion = fakeCauseOfDeathListElement({ id: '1' })['1']
;(causeOfDeathListQuestion.value as ValueCauseOfDeathList).list = []
;(causeOfDeathListQuestion.config as ConfigUeCauseOfDeathList).list.forEach((item) =>
  (causeOfDeathListQuestion.value as ValueCauseOfDeathList).list.push({
    id: item.id,
    description: { id: item.descriptionId, text: faker.lorem.sentence(3) },
    debut: {
      id: item.debutId,
      date: faker.date
        .past()
        .toISOString()
        .split('T')[0],
    },
    specification: {
      id: faker.random.arrayElement(['UPPGIFT_SAKNAS', 'KRONISK', 'PLOTSLIG']),
      code: faker.random.arrayElement(['UPPGIFT_SAKNAS', 'KRONISK', 'PLOTSLIG']),
    },
  } as ValueCauseOfDeath)
)
CauseOfDeathList.args = {
  question: causeOfDeathListQuestion,
}

export const ViewText = Template.bind({})
const viewTextQuestion = fakeViewTextElement({ id: '1' })['1']
;(viewTextQuestion.value as ValueViewText).text = faker.lorem.sentence(5)
ViewText.args = {
  question: viewTextQuestion,
}

export const ViewList = Template.bind({})
const viewListQuestion = fakeViewListElement({ id: '1' })['1']
;(viewListQuestion.value as ValueViewList).list = new Array(5).fill(0).map(
  () =>
    ({
      text: faker.lorem.sentence(5),
    } as ValueViewText)
)
ViewList.args = {
  question: viewListQuestion,
}

export const ViewTable = Template.bind({})
const viewTableQuestion = fakeViewTableElement({ id: '1' })['1']
const columns = new Array(4).fill(0).map(
  () =>
    ({
      id: faker.random.alphaNumeric(3),
      text: faker.lorem.sentence(5),
    } as ConfigViewColumn)
)
const rows = new Array(5).fill(0).map(
  () =>
    ({
      columns: columns.map((c) => ({ id: c.id, text: faker.lorem.sentence(3) } as ValueText)),
    } as ValueTextRow)
)
;(viewTableQuestion.config as ConfigUeViewTable).columns = columns
;(viewTableQuestion.value as ValueViewTable).rows = rows

ViewTable.args = {
  question: viewTableQuestion,
}
