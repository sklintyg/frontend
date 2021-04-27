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
import _, { isObject } from 'lodash'
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

interface Obj {
  [id: string]: {
    id: string
    from: string | null
    to: string | null
  }
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question }) => {
  // const [hours, setHours] = useState<number | null>(null)
  // const [configList, setConfigList] = useState((question.config as ConfigUeSickLeavePeriod).list)
  // const [valueList, setValueList] = useState<ValueDateRange[]>([])
  const dispatch = useDispatch()
  const configList = (question.config as ConfigUeSickLeavePeriod).list
  const valueList = (question.value as ValueDateRangeList).list
  const [config, setConfig] = useState<Obj>()

  useEffect(() => {
    const x = getValueObject(configList, valueList)
    setConfig(x)
  }, [])

  useEffect(() => {
    console.log('config', config)
  })

  const dispatchEditDraft = useRef(
    _.debounce((valueList: ValueDateRange[]) => {
      const updatedQuestion = getUpdatedValue(valueList)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  if (!config) return null

  // const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   console.log(event.target.value)
  //   const inputHours = parseInt(event.target.value)

  //   if (!isNaN(inputHours)) {
  //     console.log('is number!', inputHours)
  //     setHours(inputHours)
  //   }
  // }

  // useEffect(() => {
  //   dispatchEditDraft(valueList)
  // }, [valueList])

  // useEffect(() => {
  //   dispatchEditDraft(valueList)
  // }, [valueList])

  function getValueObject(configList: ConfigUeCheckboxDateRange[], valueList: ValueDateRange[]) {
    const obj: Obj = {}

    for (let i = 0; i < configList.length; i++) {
      obj[configList[i].id] = {
        id: configList[i].id,
        from: valueList.find((x) => x.id === configList[i].id)?.from ?? null,
        to: valueList.find((x) => x.id === configList[i].id)?.to ?? null,
      }
    }

    return obj
  }

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedObject = { ...config[valueId] }
    updatedObject.from = fromDate
    updatedObject.to = toDate
    const test = { ...config }
    test[valueId] = updatedObject
    setConfig(test)
    const valueList = getUpdatedValueList(test)
    dispatchEditDraft(valueList)
  }

  const getUpdatedValueList = (obj: Obj) => {
    const valueList: any[] = []

    for (const id in obj) {
      if (obj[id].from || obj[id].to) {
        valueList.push({ id: id, from: obj[id].from, to: obj[id].to, type: CertificateDataValueType.DATE_RANGE })
      }
    }

    return valueList
  }

  // const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
  //   const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
  //   // setValueList(updatedValueList)
  //   console.log('test är nu', test)
  //   // dispatchEditDraft(updatedValueList)
  // }

  // const getUpdatedValueList = (valueId: string, fromDate: string | null, toDate: string | null) => {
  //   // const updatedQuestion: CertificateDataElement = { ...question }

  //   // const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }
  //   let updatedValueList = [...valueList]

  //   const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueId)

  //   if (updatedValueIndex === -1) {
  //     updatedValueList = [...updatedValueList, { from: fromDate, to: toDate, id: valueId } as ValueDateRange]
  //   } else {
  //     updatedValueList = updatedValueList.map((val) => {
  //       if (val.id === valueId) {
  //         return { ...val, from: fromDate, to: toDate, id: valueId } as ValueDateRange
  //       }
  //       return val
  //     })
  //   }

  //   return updatedValueList
  // }

  function getUpdatedValue(valueList: ValueDateRange[]) {
    // const updatedQuestion = { ...question }
    // ;(updatedQuestion.value as ValueDateRangeList).list = { ...valueList }

    // return updatedQuestion

    const updatedQuestion: CertificateDataElement = { ...question }

    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }
    // let updatedValueList = [...updatedQuestionValue.list]

    // const updatedValueIndex = updatedValueList.findIndex((val) => val.id === questionId)

    // if (updatedValueIndex === -1) {
    //   updatedValueList = [...updatedValueList, { from: fromDate, to: toDate, id: questionId } as ValueDateRange]
    // } else {
    //   updatedValueList = updatedValueList.map((val) => {
    //     if (val.id === questionId) {
    //       return { ...val, from: fromDate, to: toDate, id: questionId } as ValueDateRange
    //     }
    //     return val
    //   })
    // }
    updatedQuestionValue.list = valueList
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  const handleGetPeriodStartingDateString = (periodId: string) => {
    const valueList: any[] = []

    for (const id in config) {
      if (config[id].from && config[id].to) {
        valueList.push({ ...config[id], type: CertificateDataValueType.DATE_RANGE })
      }
    }

    const nextPeriodStart = getLatestPeriodEndDate((question.config as ConfigUeSickLeavePeriod).list, valueList, periodId)

    if (isValid(nextPeriodStart)) {
      return formatDateToString(addDays(nextPeriodStart!, 1))
    }

    return formatDateToString(new Date())
  }

  const handleResetPeriod = (periodId: string) => {
    const updatedObject = { ...config[periodId] }
    updatedObject.from = null
    updatedObject.to = null
    const test = { ...config }
    test[periodId] = updatedObject
    setConfig(test)
  }

  if (!question) return null

  // const dateConfigs = question.config as ConfigUeSickLeavePeriod
  // const questionValueList = (question.value as ValueDateRangeList).list

  return (
    <div>
      {/* <div>
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
          <p>Patienten arbetar i snitt</p>
          <TextInput className="ic-textfield" type="text" value={hours?.toString()} maxLength={2} onChange={onTextInputChange} />
          <p>timmar/vecka</p>
        </DaysRangeWrapper>
      </div> */}
      <div>
        {(question.config as ConfigUeSickLeavePeriod).list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
              getPeriodStartingDateString={handleGetPeriodStartingDateString}
              updateValue={handleUpdatedValue}
              resetPeriod={handleResetPeriod}
              key={period.id}
              fromDate={config[period.id].from}
              toDate={config[period.id].to}
              label={period.label}
              periodId={period.id}
            />
          )
        })}
      </div>
    </div>
  )
}
