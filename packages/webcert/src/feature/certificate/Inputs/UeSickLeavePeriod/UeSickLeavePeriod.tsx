import React, { useState, useRef, useEffect } from 'react'
import DateRangePicker from './DateRangePicker'
import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeSickLeavePeriod,
  formatDateToString,
  getLatestPeriodEndDate,
  ValueDateRange,
} from '@frontend/common'
import { ConfigUeCheckboxDateRange } from '../../../../../../common/src/types/certificate'
import { ValueDateRangeList } from '../../../../../../common/src/types/certificate'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import _ from 'lodash'
import { isValid } from 'date-fns'
import addDays from 'date-fns/addDays'

const DaysRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;

  > * + * {
    margin-left: 0.5rem;
  }
`

const TextInput = styled.input`
  max-width: 35px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

interface Props {
  question: CertificateDataElement
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question }) => {
  const [hours, setHours] = useState<number | null>(null)
  // const [configList, setConfigList] = useState((question.config as ConfigUeSickLeavePeriod).list)
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()
  const configList = (question.config as ConfigUeSickLeavePeriod).list

  const dispatchEditDraft = useRef(
    _.debounce((valueList: ValueDateRange[]) => {
      const updatedQuestion = getUpdatedValue(valueList)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
    setValueList(updatedValueList)
    dispatchEditDraft(updatedValueList)
  }

  const getUpdatedValueList = (valueId: string, fromDate: string | null, toDate: string | null) => {
    let updatedValueList = [...valueList]

    const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueId)

    if (updatedValueIndex === -1) {
      updatedValueList = [...updatedValueList, { from: fromDate, to: toDate, id: valueId } as ValueDateRange]
    } else {
      updatedValueList = updatedValueList.map((val) => {
        if (val.id === valueId) {
          return { ...val, from: fromDate, to: toDate, id: valueId } as ValueDateRange
        }
        return val
      })
    }

    return updatedValueList
  }

  function getUpdatedValue(valueList: ValueDateRange[]) {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }

    updatedQuestionValue.list = valueList
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  const handleGetPeriodStartingDate = (periodId: string) => {
    const nextPeriodStart = getLatestPeriodEndDate((question.config as ConfigUeSickLeavePeriod).list, valueList, periodId)

    if (isValid(nextPeriodStart)) {
      return formatDateToString(addDays(nextPeriodStart!, 1))
    }

    return formatDateToString(new Date())
  }

  if (!question) return null

  return (
    <div>
      <div>
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
          <p>Patienten arbetar i snitt</p>
          <TextInput className="ic-textfield" type="text" value={hours?.toString()} maxLength={2} />
          <p>timmar/vecka</p>
        </DaysRangeWrapper>
      </div>
      <div>
        {(question.config as ConfigUeSickLeavePeriod).list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
              getPeriodStartingDate={handleGetPeriodStartingDate}
              updateValue={handleUpdatedValue}
              key={period.id}
              fromDate={valueList.find((x) => x.id === period.id)?.from ?? null}
              toDate={valueList.find((x) => x.id === period.id)?.to ?? null}
              label={period.label}
              periodId={period.id}
            />
          )
        })}
      </div>
    </div>
  )
}
