import {
  CertificateDataElement,
  Dropdown,
  DatePickerCustom,
  ConfigureUeCauseOfDeath,
  QuestionValidationTexts,
  getValidDate,
  ValueCauseOfDeath,
  TextInput,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from 'date-fns'
import styled from 'styled-components/macro'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import {
  getQuestionHasValidationError,
  getShowValidationErrors,
  getVisibleValidationErrors,
} from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

const UeCauseOfDeath: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const config = question.config as ConfigureUeCauseOfDeath
  const dispatch = useAppDispatch()
  const hasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [descriptionValue, setDescriptionValue] = useState((question.value as ValueCauseOfDeath).description)
  const [debutString, setDebutString] = useState((question.value as ValueCauseOfDeath).debut)
  const [selectedSpec, setSelectedSpec] = useState((question.value as ValueCauseOfDeath).specification)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, (question.value as ValueCauseOfDeath).id))

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setDescriptionValue(event.currentTarget.value)
    dispatch(updateCertificateDataElement(getUpdatedValue(question, event.currentTarget.value, debutString, selectedSpec)))
  }

  const deleteDateFromSavedValue = () => {
    dispatch(updateCertificateDataElement(getUpdatedValue(question, descriptionValue, '', selectedSpec)))
  }

  const handleDateChange = (date: string) => {
    setDebutString(date)
    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(updateCertificateDataElement(getUpdatedValue(question, descriptionValue, date, selectedSpec)))
    }
  }

  const handleSpecificationChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedSpec(event.currentTarget.value)
    dispatch(updateCertificateDataElement(getUpdatedValue(question, descriptionValue, debutString, event.currentTarget.value)))
  }

  return (
    <div className="ic-forms__group iu-grid-cols">
      {config.title}
      <div>
        <div className="iu-fl iu-fs-600 iu-color-cta-text">{config.label}</div>
        <div>
          <TextInput
            label="Beskrivning"
            id={'description_' + question.id}
            value={descriptionValue}
            onChange={handleDescriptionChange}
            disabled={disabled}></TextInput>
          <DatePickerCustom
            label="Ungefärlig debut"
            forbidFutureDates={true}
            inputString={debutString}
            disabled={disabled}
            textInputOnChange={(value: string) => {
              handleDateChange(value)
            }}
            setDate={(date: string) => {
              handleDateChange(date)
            }}
            id={'debut_' + question.id}
            displayValidationErrorOutline={hasValidationError || validationErrors.length > 0}
          />
          <Dropdown
            label="Specificera tillståndet"
            id={'specification_' + question.id}
            onChange={handleSpecificationChange}
            disabled={disabled}
            value={selectedSpec}
            options={config.specifications.map((item) => (
              <option value={item.id}>{item.label}</option>
            ))}></Dropdown>
          {isShowValidationError && (
            <ValidationWrapper>
              <QuestionValidationTexts validationErrors={validationErrors} />
            </ValidationWrapper>
          )}
        </div>
      </div>
    </div>
  )
}

const getUpdatedValue = (question: CertificateDataElement, description: string, debut: string, specification: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueCauseOfDeath) }
  updatedValue.description = description
  updatedValue.debut = debut
  updatedValue.specification = specification

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeCauseOfDeath
