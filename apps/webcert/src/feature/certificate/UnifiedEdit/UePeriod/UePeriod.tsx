import styled from 'styled-components'
import type { ConfigUePeriod, ValuePeriod } from '../../../../types'
import UeDate from '../UeDate/UeDate'
import type { UnifiedEdit } from '../UnifiedEdit'

const PeriodGrid = styled.div`
  display: grid;
`

export function UePeriod({ question, disabled, onUpdate }: UnifiedEdit<ConfigUePeriod, ValuePeriod>) {
  const { config, value } = question

  return (
    <PeriodGrid>
      <UeDate
        question={{ ...question, id: config.fromDate.id, parent: question.id, config: config.fromDate, value: value.fromDate }}
        onUpdate={(fromDate) => onUpdate({ ...value, fromDate })}
        disabled={disabled}
      />
      <UeDate
        question={{ ...question, id: config.toDate.id, parent: question.id, config: config.toDate, value: value.toDate }}
        onUpdate={(toDate) => onUpdate({ ...value, toDate })}
        disabled={disabled}
      />
    </PeriodGrid>
  )
}
