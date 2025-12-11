import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import type { ReactNode } from 'react'
import { useId } from 'react'
import styled from 'styled-components'
import { questionImage } from '../../images'
import { FieldLabelMandatoryAsterix } from './FieldLabelMandatoryAsterix'

const Icon = styled.img`
  width: 14px;
  display: inline-block;
`

export function FieldLabel({
  id,
  label,
  tooltip,
  required,
  italic,
}: {
  id?: string
  label: string
  tooltip?: ReactNode
  required?: boolean
  italic?: boolean
}) {
  const tooltipId = useId()

  return (
    <div className="flex flex-row gap-1">
      {required && <FieldLabelMandatoryAsterix />}
      <label htmlFor={id} className={italic ? 'italic' : ''}>
        {label}
      </label>{' '}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon src={questionImage} tabIndex={0} aria-labelledby={tooltipId} />
          </TooltipTrigger>
          <TooltipContent small>
            <div id={tooltipId}>{tooltip}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
