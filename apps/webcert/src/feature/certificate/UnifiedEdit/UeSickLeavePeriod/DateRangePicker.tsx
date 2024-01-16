import { addDays, isValid } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Checkbox from '../../../../components/Inputs/Checkbox'
import DatePickerCustom from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { ValidationError, ValueDateRange } from '../../../../types'
import {
  _dateReg,
  _dateRegDashesOptional,
  dayCodeReg,
  formatDateToString,
  getPeriodWorkDays,
  getPeriodWorkHours,
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
  }

  & + & {
    margin-left: 8px;
  }
`
const DateRangeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }

  @media (max-width: 820px) {
    flex-direction: column;
  }
`
const DateGrid = styled.div`
  display: grid;
  align-items: baseline;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }
`

interface Props {
  label: string
  field: string
  value: ValueDateRange
  onChange: (value: ValueDateRange) => void
  getPeriodStartingDate: () => string
  disabled: boolean
  baseWorkHours: string
  validationErrors: ValidationError[]
  hasValidationError: boolean
}

const DateRangePicker: React.FC<Props> = ({
  label,
  field,
  value,
  onChange,
  getPeriodStartingDate,
  disabled,
  baseWorkHours,
  validationErrors,
  hasValidationError,
}) => {
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<null | number | string>(null)
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<null | number>(null)

  const updateWorkingPeriod = useCallback(
    (fromDateString: string | null, toDateString: string | null) => {
      if (!baseWorkHours || baseWorkHours === '0' || baseWorkHours === '') {
        setWorkHoursPerWeek(null)
        setWorkDaysPerWeek(null)
        return
      }

      if (!fromDateString || !toDateString || !parseInt(baseWorkHours)) return

      const fromDate = getValidDate(fromDateString)
      const toDate = getValidDate(toDateString)

      if (fromDate && toDate) {
        const workingHoursPerWeek = getPeriodWorkHours(parseInt(baseWorkHours), field)
        const periodWorkDays = getPeriodWorkDays(fromDate, toDate)

        setWorkHoursPerWeek(workingHoursPerWeek)
        setWorkDaysPerWeek(periodWorkDays)
      }
    },
    [baseWorkHours, field]
  )

  useEffect(() => {
    updateWorkingPeriod(value.from ?? '', value.to ?? '')
  }, [value.from, value.to, updateWorkingPeriod])

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

  const handleToTextInputOnBlur = () => {
    if (!value.to || !value.from || !getValidDate(value.from)) {
      return
    }

    const fromDate = getValidDate(value.from)

    const inputMatchesRegex = regexArray.some((reg) => reg.test(value.to ?? ''))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(value.to)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        handleToChanged(formatDateToString(newDate))
      }
    } else if (_dateReg.test(value.to) || _dateRegDashesOptional.test(value.to)) {
      const newDate = getValidDate(value.to)

      if (newDate && isValid(newDate)) {
        handleToChanged(formatDateToString(newDate))
      }
    }
  }

  const handleFromChanged = (from: string) => {
    onChange({ ...value, from })
  }
  const handleToChanged = (to: string) => {
    onChange({ ...value, to })
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      handleFromChanged(getPeriodStartingDate())
    } else {
      onChange({ ...value, from: undefined, to: undefined })
      setWorkHoursPerWeek(null)
      setWorkDaysPerWeek(null)
    }
  }

  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    return hasValidationError === true
      ? hasValidationError
      : validationErrors.filter(
          (v: ValidationError) =>
            v.field.includes(field + '.' + id) ||
            v.field.includes('row.' + id) ||
            v.field.includes('sjukskrivningar.period.' + id + '.' + field)
        ).length > 0
  }

  return (
    <>
      <DateRangeWrapper>
        <Checkbox
          id={`${field}-checkbox`}
          hasValidationError={hasValidationError || validationErrors.length > 0}
          checked={!!value.from || !!value.to}
          onChange={handleCheckboxClick}
          label={label}
          disabled={disabled}
        />
        <DateGrid>
          <DatesWrapper id="fromWrapper">
            <DatePickerCustom
              disabled={disabled}
              label={'Fr.o.m'}
              id={`from${field}`}
              textInputRef={fromTextInputRef}
              textInputOnKeyDown={handleFromTextInputOnKeyDown}
              textInputName={`from${field}`}
              inputString={value.from ?? ''}
              setDate={handleFromChanged}
              textInputOnChange={handleFromChanged}
              textInputDataTestId={`from${field}`}
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(field, 'from')}
            />
          </DatesWrapper>
          <DatesWrapper>
            <DatePickerCustom
              disabled={disabled}
              label={'t.o.m'}
              id={`tom${field}`}
              textInputName={`tom${field}`}
              textInputRef={tomTextInputRef}
              inputString={value.to ?? ''}
              setDate={handleToChanged}
              textInputOnChange={handleToChanged}
              textInputOnBlur={handleToTextInputOnBlur}
              textInputOnKeyDown={handleToTextInputOnKeyDown}
              textInputDataTestId={`tom${field}`}
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(field, 'tom')}
            />
          </DatesWrapper>
        </DateGrid>
      </DateRangeWrapper>
      <QuestionValidationTexts validationErrors={validationErrors} />
      {workHoursPerWeek !== null && workDaysPerWeek && (
        <p className="iu-color-main">
          Arbetstid: {workHoursPerWeek} timmar/vecka {workDaysPerWeek && workDaysPerWeek > 0 && <span>i {workDaysPerWeek} dagar.</span>}
        </p>
      )}
    </>
  )
}

export default DateRangePicker
