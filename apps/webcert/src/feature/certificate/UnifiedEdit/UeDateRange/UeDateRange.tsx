import { addDays, isValid } from 'date-fns'
import type React from 'react'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import DatePickerCustom from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type { CertificateDataElement, ConfigUeDateRange, ValidationError, ValueDateRange } from '../../../../types'
import {
  _dateReg,
  _dateRegDashesOptional,
  dayCodeReg,
  formatDateToString,
  getValidDate,
  monthCodeReg,
  parseDayCodes,
  weekCodeReg,
} from '../../../../utils'

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

const DatesWrapper = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 8px;
  }

  label {
    margin-right: 0.625em;
    width: 42px;
    @media (min-width: 1200px) {
      text-align: right;
    }
  }
`
const DateGrid = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-direction: column;
  @media (min-width: 1200px) {
    flex-direction: row;
  }
`

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeDateRange: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeDateRange
  const value = question.value as ValueDateRange
  const [fromDateInput, setFromDateInput] = useState<string | null>(value.from ?? null)
  const [toDateInput, setToDateInput] = useState<string | null>(value.to ?? null)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)

  const dispatch = useDispatch()
  const validationErrors = useAppSelector(getVisibleValidationErrors(question.id))

  const handleFromTextInputChange = (fromValue: string) => {
    setFromDateInput(fromValue)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...value, from: fromValue && fromValue.length > 0 ? fromValue : undefined, to: toDateInput ?? undefined },
      })
    )
  }

  const handleToTextInputChange = (toValue: string | null) => {
    setToDateInput(toValue)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...value, from: fromDateInput ?? undefined, to: toValue && toValue.length > 0 ? toValue : undefined },
      })
    )
  }

  const handleToTextInputOnBlur = () => {
    if (!toDateInput || !fromDateInput || !getValidDate(fromDateInput)) {
      handleToTextInputChange(tomTextInputRef.current?.value ?? null)
      return
    }

    const fromDate = getValidDate(fromDateInput)

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateInput ?? ''))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateInput)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        handleToTextInputChange(formatDateToString(newDate))
      }
    } else if (_dateReg.test(toDateInput) || _dateRegDashesOptional.test(toDateInput)) {
      const newDate = getValidDate(toDateInput)

      if (newDate && isValid(newDate)) {
        handleToTextInputChange(formatDateToString(newDate))
      }
    }
  }

  const handleFromTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      fromTextInputRef.current?.blur()
      tomTextInputRef.current?.focus()
    }
  }

  const handleToTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      tomTextInputRef.current?.blur()
    }
  }

  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    if (id) {
      return (
        validationErrors.filter(
          (v: ValidationError) =>
            v.field.includes(field + '.' + id) || v.field.includes(id + '.' + field) || v.field.includes('row.' + id) || v.field == id
        ).length > 0
      )
    }
    return validationErrors.length > 0
  }

  return (
    <>
      <DateGrid>
        <DatesWrapper id="fromWrapper">
          <DatePickerCustom
            disabled={disabled}
            label={config.fromLabel}
            id={`from${config.id}`}
            textInputRef={fromTextInputRef}
            textInputOnKeyDown={handleFromTextInputOnKeyDown}
            textInputName={`from${config.id}`}
            inputString={fromDateInput}
            setDate={handleFromTextInputChange}
            textInputOnChange={handleFromTextInputChange}
            textInputDataTestId={`from${config.id}`}
            displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'from')}
          />
        </DatesWrapper>
        <DatesWrapper>
          <DatePickerCustom
            disabled={disabled}
            label={config.toLabel}
            id={`tom${config.id}`}
            textInputName={`tom${config.id}`}
            textInputRef={tomTextInputRef}
            inputString={toDateInput}
            setDate={handleToTextInputChange}
            textInputOnChange={handleToTextInputChange}
            textInputOnBlur={handleToTextInputOnBlur}
            textInputOnKeyDown={handleToTextInputOnKeyDown}
            textInputDataTestId={`tom${config.id}`}
            displayValidationErrorOutline={
              getShouldDisplayValidationErrorOutline(config.id, 'tom') || getShouldDisplayValidationErrorOutline(config.id, 'to')
            }
          />
        </DatesWrapper>
      </DateGrid>

      <div className={'iu-pb-300'}>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </div>
    </>
  )
}

export default UeDateRange
