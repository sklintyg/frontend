import React from 'react'
import { ConfigUeInteger, ValueInteger } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvInteger: React.FC<{
  value: ValueInteger
  config: ConfigUeInteger
}> = ({ value, config }) => (
  <Badge>
    {typeof value.value === 'number' && value.value !== null
      ? value.value.toString() + config.unitOfMeasurement
      : value.value === 0 || Object.is(value.value, -0)
      ? '0' + config.unitOfMeasurement
      : 'Ej angivet'}
  </Badge>
)
