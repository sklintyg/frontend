import type { ComponentProps } from 'react'
import { ChevronDownIcon } from './ChevronDownIcon'

export const ChevronUpIcon = ({ style, ...props }: ComponentProps<typeof ChevronDownIcon>): React.ReactElement => (
  <ChevronDownIcon style={{ transform: 'rotate(180deg)', ...style }} {...props} />
)
