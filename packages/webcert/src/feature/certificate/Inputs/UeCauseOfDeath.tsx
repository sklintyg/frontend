import {
  CertificateDataElement,
  Dropdown,
  DatePickerCustom,
  ConfigTypes,
  ConfigureUeCauseOfDeath,
  QuestionValidationTexts,
  getValidDate,
  CertificateDataValueType,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  TextInput,
  ValidationError,
} from '@frontend/common'
import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from 'date-fns'
import styled from 'styled-components/macro'
import { updateCertificateDataElement, updateClientValidationError } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

export interface Props {
  config?: ConfigureUeCauseOfDeath
  value?: ValueCauseOfDeath
  disabled?: boolean
  hasValidationError?: boolean
  question: CertificateDataElement
}

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`

const UeCauseOfDeath: React.FC<Props> = ({ config, value, disabled, hasValidationError, question }) => {
  const isSingleCauseOfDeath = question.config.type !== ConfigTypes.UE_CAUSE_OF_DEATH_LIST
  config = (isSingleCauseOfDeath ? question.config : config) as ConfigureUeCauseOfDeath
  value = (isSingleCauseOfDeath ? question.value : value) as ValueCauseOfDeath
  const dispatch = useAppDispatch()
  const [descriptionValue, setDescriptionValue] = useState(value.description)
  const [debutString, setDebutString] = useState(value.debut)
  const [selectedSpec, setSelectedSpec] = useState(value.specification)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, config.id))

  const getUpdatedValue = (question: CertificateDataElement, id: string, description: string, debut: string, specification: string) => {
    if (isSingleCauseOfDeath) {
      return getSingleUpdatedValue(question, id, description, debut, specification)
    } else {
      return getListUpdatedValue(question, id, description, debut, specification)
    }
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setDescriptionValue(event.currentTarget.value)
    dispatch(
      updateCertificateDataElement(
        getUpdatedValue(question, (config as ConfigureUeCauseOfDeath).id, event.currentTarget.value, debutString, selectedSpec)
      )
    )
  }

  const deleteDateFromSavedValue = () => {
    dispatch(
      updateCertificateDataElement(getUpdatedValue(question, (config as ConfigureUeCauseOfDeath).id, descriptionValue, '', selectedSpec))
    )
  }

  const handleDateChange = (date: string) => {
    setDebutString(date)
    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(
        updateCertificateDataElement(
          getUpdatedValue(question, (config as ConfigureUeCauseOfDeath).id, descriptionValue, date, selectedSpec)
        )
      )
    }
  }

  const handleSpecificationChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedSpec(event.currentTarget.value)
    dispatch(
      updateCertificateDataElement(
        getUpdatedValue(question, (config as ConfigureUeCauseOfDeath).id, descriptionValue, debutString, event.currentTarget.value)
      )
    )
  }
  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    if (hasValidationError) {
      return true
    }
    if (id) {
      return validationErrors.filter((v: ValidationError) => v.field.includes(field + '.' + id) || v.field.includes('row.' + id)).length > 0
    }
    return validationErrors.length > 0
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved: shouldBeRemoved, validationError: validationError }))
    },
    [dispatch]
  )

  return (
    <div className="ic-forms__group iu-grid-cols">
      {config.title}
      <div>
        <div className="iu-fl iu-fs-600 iu-color-cta-text">{config.label}</div>
        <div>
          <TextInput
            label="Beskrivning"
            id={'description_' + config.id}
            value={descriptionValue}
            onChange={handleDescriptionChange}
            disabled={disabled}
            hasValidationError={hasValidationError}
          />
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
            id={`debut${config.id}`}
            componentField={`debut.${config.id}`}
            displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'debut')}
            onDispatchValidationError={dispatchValidationError}
          />
          <Dropdown
            label="Specificera tillståndet"
            id={'specification_' + config.id}
            onChange={handleSpecificationChange}
            disabled={disabled}
            value={selectedSpec}
            options={config.specifications.map((item) => (
              <option value={item.id}>{item.label}</option>
            ))}
            hasValidationError={hasValidationError}
          />{' '}
          <ValidationWrapper>
            <QuestionValidationTexts validationErrors={validationErrors} />
          </ValidationWrapper>
        </div>
      </div>
    </div>
  )
}

const getListUpdatedValue = (question: CertificateDataElement, id: string, description: string, debut: string, specification: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueCauseOfDeathList) }

  updatedQuestionValue.list = (updatedQuestionValue.list ?? [])
    .filter((item) => item.id !== id)
    .concat({ id: id, description: description, debut: debut, specification: specification, type: CertificateDataValueType.CAUSE_OF_DEATH })

  updatedQuestion.value = updatedQuestionValue

  return updatedQuestion
}

const getSingleUpdatedValue = (question: CertificateDataElement, id: string, description: string, debut: string, specification: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueCauseOfDeath) }
  updatedValue.description = description
  updatedValue.debut = debut
  updatedValue.specification = specification

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeCauseOfDeath
