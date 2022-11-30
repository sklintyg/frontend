import {
  CertificateDataElement,
  Dropdown,
  QuestionValidationTexts,
  ValueUncertainDate,
  TextInput,
  DatePickerCustom,
  getValidDate,
  Accordion,
} from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigationList,
  ValueCode,
  ValueDate,
} from '@frontend/common/src/types/certificate'
import { isValid } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeMedicalInvestigationList: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionValue = question.value as ValueMedicalInvestigation
  const config = question.config as ConfigUeMedicalInvestigationList
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const typeOptions = config.typeOptions as ConfigUeCodeItem[]
  const [selected, setSelected] = useState((question.value as ValueCode).code)
  const [dateString, setDateString] = useState<string | null>(questionValue.date.date ?? '')

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue
    return updatedQuestion
  }
  const handleChange = (date: string) => {
    setDateString(date)

    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(updateCertificateDataElement(getUpdatedDateValue(question, config.type, date)))
    }
  }
  const deleteDateFromSavedValue = () => {
    dispatch(updateCertificateDataElement(getUpdatedDateValue(question, config.type, '')))
  }

  useEffect(() => {
    if (disabled === false && selected != null) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, selected)))
    }
  }, [disabled, selected, question, dispatch])

  return (
    <>
      <div className="iu-grid-cols">
        <h4>{config.typeText}</h4>
        <h4>{config.dateText}</h4>
        <Accordion title={config.informationSourceText} titleId={''} description={config.informationSourceDescription} />
      </div>
      <div className="ic-forms__group iu-grid-cols">
        <div>
          <Dropdown
            id="typeText"
            label=""
            options={typeOptions.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label}
              </option>
            ))}
            value={selected}
            disabled={disabled}
            onChange={(event) => setSelected(event.currentTarget.value)}
            hasValidationError={hasValidationError}
          />
        </div>
        <div>
          <DatePickerCustom
            id="dateText"
            forbidFutureDates={true}
            inputString={null}
            textInputOnChange={function(value: string, isValueValid?: boolean | undefined): void {
              throw new Error('Function not implemented.')
            }}
            displayValidationErrorOutline={false}
            setDate={(date: string) => {
              handleChange(date)
            }}
          />
        </div>
        <div>
          <TextInput id="informationSourceText" hasValidationError={hasValidationError} />
        </div>
        {isShowValidationError && (
          <ValidationWrapper>
            <QuestionValidationTexts validationErrors={question.validationErrors} />
          </ValidationWrapper>
        )}{' '}
      </div>
    </>
  )
}
const getDatelike = (question: CertificateDataElement) => {
  let datelike = ''
  const _dateReg = /[0-2][0-9]{3}-[0-9]{2}-[0-9]{2}/

  if (question && (question.value as ValueUncertainDate)) {
    const date: string | unknown = (question.value as ValueUncertainDate).value
    if (date) {
      datelike = _dateReg.test(date as string) ? (date as string) : ''
    }
  }
  return datelike
}
const getUpdatedDateValue = (question: CertificateDataElement, id: string, date: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueDate) }
  updatedValue.id = id
  updatedValue.date = date

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeMedicalInvestigationList
