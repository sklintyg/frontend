import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { questionImage } from '../../images'

const Icon = styled.img`
  width: 14px;
  display: inline-block;
`

export function FieldLabel({ id, label, tooltip }: { id?: string; label: string; tooltip?: ReactNode }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>{' '}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon src={questionImage} tabIndex={0} />
          </TooltipTrigger>
          <TooltipContent small>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </>
  )
}
