import { addDays, isValid } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
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

export function UeCheckboxDateRangeListField({
  label,
  field,
  value,
  onChange,
  periodStartingDate,
  disabled,
  baseWorkHours,
  validationErrors,
  hasValidationError,
}: {
  label: string
  field: string
  value: ValueDateRange
  onChange: (value: ValueDateRange) => void
  periodStartingDate: string
  disabled: boolean
  baseWorkHours: string
  validationErrors: ValidationError[]
  hasValidationError: boolean
}) {
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<null | number | string>(null)
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<null | number>(null)

  useEffect(() => {
    const fromDateString = value.from ?? ''
    const toDateString = value.to ?? ''

    if (!baseWorkHours || baseWorkHours === '0' || baseWorkHours === '') {
      setWorkHoursPerWeek(null)
      setWorkDaysPerWeek(null)
    } else {
      if (!fromDateString || !toDateString || !parseInt(baseWorkHours)) return

      const fromDate = getValidDate(fromDateString)
      const toDate = getValidDate(toDateString)

      if (fromDate && toDate) {
        const workingHoursPerWeek = getPeriodWorkHours(parseInt(baseWorkHours), field)
        const periodWorkDays = getPeriodWorkDays(fromDate, toDate)

        setWorkHoursPerWeek(workingHoursPerWeek)
        setWorkDaysPerWeek(periodWorkDays)
      }
    }
  }, [baseWorkHours, field, value.from, value.to])

  const handleFromChanged = (from: string) => {
    onChange({ ...value, from })
  }
  const handleToChanged = (to: string) => {
    onChange({ ...value, to })
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

  const shouldDisplayValidationErrorOutline = useCallback(
    (id: string, field: string) =>
      Boolean(
        hasValidationError ||
          validationErrors.find((v: ValidationError) =>
            [`${field}.${id}`, `${id}.${field}`, `row.${id}`, `period.${id}.${field}`].includes(v.field)
          )
      ),
    [hasValidationError, validationErrors]
  )

  return (
    <>
      <DateRangeWrapper>
        <Checkbox
          id={`${field}-checkbox`}
          hasValidationError={hasValidationError || validationErrors.length > 0}
          checked={!!value.from || !!value.to}
          onChange={(event) => {
            if (event.target.checked) {
              tomTextInputRef.current?.focus()
              handleFromChanged(periodStartingDate)
            } else {
              onChange({ ...value, from: undefined, to: undefined })
              setWorkHoursPerWeek(null)
              setWorkDaysPerWeek(null)
            }
          }}
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
              textInputOnKeyDown={(event) => {
                if (event.key.toLowerCase() === 'enter') {
                  fromTextInputRef.current?.blur()
                  tomTextInputRef.current?.focus()
                }
              }}
              textInputName={`from${field}`}
              inputString={value.from ?? ''}
              setDate={handleFromChanged}
              textInputOnChange={handleFromChanged}
              textInputDataTestId={`from${field}`}
              displayValidationErrorOutline={shouldDisplayValidationErrorOutline(field, 'from')}
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
              textInputOnKeyDown={(event) => {
                if (event.key.toLowerCase() === 'enter') {
                  tomTextInputRef.current?.blur()
                }
              }}
              textInputDataTestId={`tom${field}`}
              displayValidationErrorOutline={
                shouldDisplayValidationErrorOutline(field, 'tom') || shouldDisplayValidationErrorOutline(field, 'to')
              }
            />
          </DatesWrapper>
        </DateGrid>
      </DateRangeWrapper>
      <QuestionValidationTexts validationErrors={validationErrors} />
      {workHoursPerWeek !== null && workDaysPerWeek && (
        <p className="iu-color-main">
          Arbetstid: {workHoursPerWeek} timmar/vecka{' '}
          {workDaysPerWeek !== null && workDaysPerWeek > 0 && <span>i {workDaysPerWeek} dagar.</span>}
        </p>
      )}
    </>
  )
}
