import type React from 'react'
import type { ValueViewList } from '../../../types'
import { Badge } from '../Badge'

export const UvViewList: React.FC<{
  value: ValueViewList
}> = ({ value }) => (
  <Badge>
    {value &&
      (value.list.length === 0 ? (
        <p>Ej angivet</p>
      ) : (
        <ul>
          {value.list.map((i, index) => (
            <li key={index}>{i.text}</li>
          ))}
        </ul>
      ))}
  </Badge>
)
