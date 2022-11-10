import {
  CertificateDataElement,
  Dropdown,
  DatePickerCustom,
  ConfigTypes,
  ConfigureUeCauseOfDeath,
  QuestionValidationTexts,
  getValidDate,
  CertificateDataValueType,
  CertificateDataValidationType,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  TextInput,
  TextValidation,
  ValidationError,
  ConfigUeDropdownItem,
} from '@frontend/common'
import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from 'date-fns'
import styled, { css } from 'styled-components/macro'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  config?: ConfigureUeCauseOfDeath
  value?: ValueCauseOfDeath
  disabled?: boolean
  hasValidationError?: boolean
  question: CertificateDataElement
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  grid-column-gap: 20px;
`

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
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const specifications: ConfigUeDropdownItem[] = [{ id: '', label: 'Välj...' }].concat(config.specifications)

  const descriptionCss = config.label
    ? css`
        grid-column: 1 / span 2;
        grid-row: 1;
      `
    : css`
        grid-column: 1;
        grid-row: 1;
      `

  const dateAndSpecCss = config.label
    ? css`
        display: flex;
        grid-column: 1;
        grid-row: 2;
      `
    : css`
        display: flex;
        grid-column: 2;
        grid-row: 1;
      `

  const dateAndSpec = css`
    min-width: 25ch;
  `

  const inputHeight = css`
    height: 47px;
    margin-bottom: 15px;
  `
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
    <div className="ic-forms__group">
      {config.title}

      <div>
        {config.label && <div className="iu-fl iu-fs-700 iu-mr-400">{config.label}</div>}
        <Wrapper>
          <div css={descriptionCss}>
            <TextInput
              label="Beskrivning"
              id={'description_' + config.id}
              value={descriptionValue}
              onChange={handleDescriptionChange}
              disabled={disabled}
              hasValidationError={hasValidationError}
              limit={textValidation ? textValidation.limit : 100}
              additionalStyles={inputHeight}
            />
          </div>
          <div css={dateAndSpecCss}>
            <div css={dateAndSpec}>
              <DatePickerCustom
                additionalStyles="iu-mr-500"
                label="Ungefärlig debut"
                forbidFutureDates={true}
                vertical={true}
                inputString={debutString}
                disabled={disabled}
                textInputOnChange={(value: string) => {
                  handleDateChange(value)
                }}
                setDate={(date: string) => {
                  handleDateChange(date)
                }}
                id={`debut${config.id}`}
                questionId={question.id}
                componentField={`debut.${config.id}`}
                displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'debut')}
                onDispatchValidationError={dispatchValidationError}
              />
            </div>
            <div css={dateAndSpec}>
              <Dropdown
                label="Specificera tillståndet"
                id={'specification_' + config.id}
                onChange={handleSpecificationChange}
                disabled={disabled}
                value={selectedSpec}
                options={specifications.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label}
                  </option>
                ))}
                hasValidationError={hasValidationError}
                height="47px"
              />
            </div>
          </div>
        </Wrapper>
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </ValidationWrapper>
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
