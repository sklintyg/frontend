import React from 'react'
import { ValueViewList } from '../../..'
import { Badge } from '../Badge'

export const UvViewList: React.FC<{
  value: ValueViewList
}> = ({ value }) => (
  <Badge>
    {value && (
      <ul>
        {value.list.map((i, index) => (
          <li key={index}>{i.text}</li>
        ))}
      </ul>
    )}
  </Badge>
)
