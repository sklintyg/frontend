import { CertificateDataElement, Dropdown, QuestionValidationTexts, TextInput, DatePickerCustom, getValidDate } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigation,
  ValueCode,
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
  config: ConfigUeMedicalInvestigation
  questionId: string
  value: ValueMedicalInvestigation
}

const UeMedicalInvestigation: React.FC<Props> = ({ question, disabled, config, questionId, value }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionValue = question.value as ValueMedicalInvestigation
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const typeOptions = config.typeOptions as ConfigUeCodeItem[]
  const [selected, setSelected] = useState((question.value as ValueCode).code)
  const [dateString, setDateString] = useState<string | null>()
  const [text, setText] = useState(value != null ? value.informationSource.text : '')

  // console.log('typeOptions', typeOptions)
  //console.log('typeId', config.typeId)

  // const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: '' }, ...config.typeOptions]

  const getUpdatedValue = (question: CertificateDataElement, selected: string) => {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueCode) }
    updatedQuestionValue.id = selected
    updatedQuestionValue.code = selected
    updatedQuestion.value = updatedQuestionValue
    return updatedQuestion
  }
  const handleDescriptionChange = (text: string) => {
    // onChange({ ...value, description: { ...value.description, text } })

    setText(text)
  }

  const handleDateChange = (date: string) => {
    //onChange({ ...value, debut: { ...value.debut, date } })

    setDateString(date)

    if (isValid(getValidDate(date)) || date === '') {
      dispatch(
        updateCertificateDataElement({
          ...question,
          value: { ...questionValue, date },
        })
      )
    }
  }

  useEffect(() => {
    if (disabled === false && selected != null) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, selected)))
    }
  }, [disabled, selected, question, dispatch])

  return (
    <>
      <div className="iu-grid-cols">
        <div>
          <Dropdown
            id={config.typeId}
            label=""
            options={
              typeOptions &&
              typeOptions.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))
            }
            value={selected}
            disabled={disabled}
            onChange={(event) => setSelected(event.currentTarget.value)}
            hasValidationError={hasValidationError}
          />
        </div>
        <div>
          <DatePickerCustom
            id={config.dateId}
            questionId={questionId}
            forbidFutureDates={true}
            inputString={dateString || null}
            textInputOnChange={handleDateChange}
            displayValidationErrorOutline={false}
            setDate={(date: string) => {
              handleDateChange(date)
            }}
          />
        </div>
        <div>
          <TextInput
            onChange={(event) => {
              handleDescriptionChange(event.currentTarget.value)
            }}
            id={config.informationSourceId}
            hasValidationError={hasValidationError}
            value={text}
          />
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

export default UeMedicalInvestigation
