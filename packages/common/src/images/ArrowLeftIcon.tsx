import { ComponentProps } from 'react'
import { ArrowIcon } from './ArrowIcon'

export const ArrowLeftIcon = ({ style, ...props }: ComponentProps<typeof ArrowIcon>): React.ReactElement => (
  <ArrowIcon style={{ transform: 'rotate(180deg)', ...style }} {...props} />
)
