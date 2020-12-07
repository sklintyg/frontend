import React from 'react'
import DateRangePicker from './DateRangePicker'

interface Props {}

const mockArray = [
  {
    id: 'EN_FJARDEDEL',
    label: '25 procent',
  },
  {
    id: 'HALFTEN',
    label: '50 procent',
  },
  {
    id: 'TRE_FJARDEDEL',
    label: '75 procent',
  },
  {
    id: 'HELT_NEDSATT',
    label: '100 procent',
  },
]

export const MultipleDateRanges: React.FC<Props> = (props) => {
  return (
    <div>
      {mockArray.map((period) => {
        return <DateRangePicker label={period.label} />
      })}
    </div>
  )
}
