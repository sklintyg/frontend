import React, { useState } from 'react'
import DateRangePicker from './DateRangePicker'
import { CertificateDataElement, ConfigUeSickLeavePeriod } from '@frontend/common'
import { ConfigUeCheckboxDateRange } from '../../../../../../common/src/types/certificate'
import { ValueDateRangeList } from '../../../../../../common/src/types/certificate'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

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

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value)
    const inputHours = parseInt(event.target.value)

    if (!isNaN(inputHours)) {
      console.log('is number!', inputHours)
      setHours(inputHours)
    }
  }

  if (!question) return null

  const dateConfigs = question.config as ConfigUeSickLeavePeriod
  const questionValueList = (question.value as ValueDateRangeList).list

  return (
    <div>
      <div>
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
          <p>Patienten arbetar i snitt</p>
          <TextInput className="ic-textfield" type="text" value={hours?.toString()} maxLength={2} onChange={onTextInputChange} />
          <p>timmar/vecka</p>
        </DaysRangeWrapper>
      </div>
      <div>
        {dateConfigs.list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
              key={period.id}
              fromDate={questionValueList.find((x) => x.id === period.id)?.from ?? null}
              toDate={questionValueList.find((x) => x.id === period.id)?.to ?? null}
              label={period.label}
              question={question}
              questionId={period.id}
            />
          )
        })}
      </div>
    </div>
  )
}
