import React from 'react'
import { ConfigUeCheckboxMultipleDate, ValueDateList } from '../../../types'
import { Badge } from '../Badge'

export const UvDateList: React.FC<{
  config: ConfigUeCheckboxMultipleDate
  value: ValueDateList
}> = ({ config, value }) => (
  <>
    {config.list.map((element, index) => {
      const foundValue = value.list.find((v) => v.id === element.id)
      return (
        <React.Fragment key={index}>
          <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-400'}>{element.label}</p>
          <Badge>
            <div className={'iu-fs-200'}>{foundValue ? foundValue.date : 'Ej angivet'}</div>
          </Badge>
        </React.Fragment>
      )
    })}
  </>
)
