import {
  CertificateDataElement,
  CertificateDataValidationType,
  ConfigTypes,
  ConfigUeDropdownItem,
  ConfigureUeCauseOfDeathControl,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  DatePickerCustom,
  Dropdown,
  getValidDate,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValidationError,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import trash from '@frontend/common/src/images/trash.svg'
import { isValid } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components/macro'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  config: ConfigureUeCauseOfDeathControl
  value: ValueCauseOfDeath
  disabled?: boolean
  hasValidationError?: boolean
  question: CertificateDataElement
  canBeDeleted?: boolean
  deleteRow?: () => void
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
const Description = styled.div<{ oneLine: boolean }>`
  grid-column: ${(props) => (props.oneLine ? 1 : 1 / 2)};
  grid-row: 1;
`

const DateAndSpec = styled.div<{ oneLine: boolean }>`
  display: flex;
  grid-column: ${(props) => (props.oneLine ? 2 : 1)};
  grid-row: ${(props) => (props.oneLine ? 1 : 2)};
`
const UeCauseOfDeathControl: React.FC<Props> = ({ config, value, disabled, hasValidationError, question, canBeDeleted, deleteRow }) => {
  const isSingleCauseOfDeath = question.config.type !== ConfigTypes.UE_CAUSE_OF_DEATH_LIST
  const dispatch = useAppDispatch()
  const [descriptionValue, setDescriptionValue] = useState(value.description !== undefined ? value.description.text ?? '' : '')
  const [debutValue, setDebutValue] = useState(value.debut !== undefined ? value.debut.date ?? '' : '')
  const [specificationValue, setSpecificationValue] = useState(value.specification !== undefined ? value.specification.code : '')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, config.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const specifications: ConfigUeDropdownItem[] = [{ id: '', label: 'Välj...' }].concat(config.specifications)

  const dateAndSpec = css`
    min-width: 25ch;
  `
  const deleteBtn = css`
    min-width: 10ch;
    padding-top: 1.46rem;
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
    const description = event.currentTarget.value
    setDescriptionValue(description)
    dispatch(
      updateCertificateDataElement(
        getUpdatedValue(question, (config as ConfigureUeCauseOfDeathControl).id, description, debutValue, specificationValue)
      )
    )
  }

  const deleteDateFromSavedValue = () => {
    setDebutValue('')
    dispatch(updateCertificateDataElement(getUpdatedValue(question, config.id, descriptionValue, '', specificationValue)))
  }

  const handleDateChange = (date: string) => {
    setDebutValue(date)
    if (date === '') {
      deleteDateFromSavedValue()
    }

    const parsedDate = getValidDate(date)

    if (isValid(parsedDate)) {
      dispatch(
        updateCertificateDataElement(
          getUpdatedValue(question, (config as ConfigureUeCauseOfDeathControl).id, descriptionValue, date, specificationValue)
        )
      )
    }
  }

  const handleSpecificationChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selected = event.currentTarget.value
    setSpecificationValue(selected)
    dispatch(
      updateCertificateDataElement(
        getUpdatedValue(question, (config as ConfigureUeCauseOfDeathControl).id, descriptionValue, debutValue, selected)
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

  const deleteItem = () => {
    if (deleteRow) deleteRow()
  }

  const getDeleteButtonDiv = () => {
    if (!isSingleCauseOfDeath) {
      return (
        <div css={deleteBtn} className="iu-ml-500">
          {getDeleteButton()}
        </div>
      )
    } else return <></>
  }

  const getDeleteButton = () => {
    if (canBeDeleted) {
      return (
        <CustomButton
          startIcon={<img src={trash} alt="Radera rad" />}
          disabled={disabled}
          buttonStyle="secondary"
          onClick={deleteItem}
          height="47px"
        />
      )
    } else return <></>
  }

  return (
    <>
      <Wrapper>
        <Description oneLine={!isSingleCauseOfDeath}>
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
        </Description>
        <DateAndSpec oneLine={!isSingleCauseOfDeath}>
          <div css={dateAndSpec}>
            <DatePickerCustom
              additionalStyles="iu-mr-500"
              label="Ungefärlig debut"
              forbidFutureDates={true}
              vertical={true}
              inputString={debutValue}
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
              value={specificationValue}
              options={specifications.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
              hasValidationError={hasValidationError}
              height="47px"
            />
          </div>
          {getDeleteButtonDiv()}
        </DateAndSpec>
      </Wrapper>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

const getListUpdatedValue = (question: CertificateDataElement, id: string, description: string, debut: string, specification: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueCauseOfDeathList) }

  const updatedQuestionItem: ValueCauseOfDeath = updatedQuestionValue.list.find((item) => item.id === id) as ValueCauseOfDeath

  updatedQuestionItem.description.text = description
  updatedQuestionItem.debut.date = debut
  updatedQuestionItem.specification.code = specification
  updatedQuestionItem.specification.id = specification

  updatedQuestionValue.list = updatedQuestionValue.list.filter((item) => item.id !== id).concat(updatedQuestionItem)

  updatedQuestion.value = updatedQuestionValue

  return updatedQuestion
}

const deleteItem = (question: CertificateDataElement, id: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }
  const questionConfig = { ...(updatedQuestion.config as ConfigureUeCauseOfDeathList) }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueCauseOfDeathList) }

  let previousId: string | undefined
  let move = false

  questionConfig.list.forEach((config) => {
    if (previousId && (config.id === id || move)) {
      const updatedQuestionItem: ValueCauseOfDeath = updatedQuestionValue.list.find((item) => item.id === config.id) as ValueCauseOfDeath
      updatedQuestionItem.id = previousId
      move = true
    }
    previousId = config.id
  })

  return updatedQuestion
}

const getSingleUpdatedValue = (question: CertificateDataElement, id: string, description: string, debut: string, specification: string) => {
  const updatedQuestion: CertificateDataElement = { ...question }

  const updatedValue = { ...(updatedQuestion.value as ValueCauseOfDeath) }
  updatedValue.description.text = description
  updatedValue.debut.date = debut
  updatedValue.specification.code = specification
  updatedValue.specification.id = specification

  updatedQuestion.value = updatedValue

  return updatedQuestion
}

export default UeCauseOfDeathControl
