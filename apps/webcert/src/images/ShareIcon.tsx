import React, { ComponentProps } from 'react'
import { ReplyIcon } from './ReplyIcon'

export const ShareIcon = ({ style, ...props }: ComponentProps<typeof ReplyIcon>): React.ReactElement => (
  <ReplyIcon style={{ transform: 'scaleX(-1)', ...style }} {...props} />
)
