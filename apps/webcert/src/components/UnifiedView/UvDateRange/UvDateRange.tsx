import React from 'react'
import styled from 'styled-components'
import { ConfigUeDateRange, ValueDateRange } from '../../../types'
import { Badge } from '../Badge'

const DateRangeWrapper = styled.div`
  display: inline-block;
`

export const UvDateRange: React.FC<{ value: ValueDateRange; config: ConfigUeDateRange }> = ({ value, config }) => {
  return (
    <DateRangeWrapper>
      <div>
        <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>{config.fromLabel}</p>
        <Badge>{typeof value.from === 'string' && value.from.length > 0 ? value.from : 'Ej angivet'}</Badge>
      </div>
      <div className={'iu-ml-600'}>
        <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>{config.toLabel}</p>
        <Badge>{typeof value.to === 'string' && value.to.length > 0 ? value.to : 'Ej angivet'}</Badge>
      </div>
    </DateRangeWrapper>
  )
}
