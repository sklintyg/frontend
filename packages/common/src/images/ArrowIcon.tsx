import React, { ComponentProps } from 'react'
import { SVGIcon } from './SVGIcon'

export const ArrowIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 15 15" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 8.02632L10.2227 3.33709C9.84974 2.97097 9.245 2.97097 8.87201 3.33709C8.49902 3.7032 8.49902 4.2968 8.87201 4.66291L11.2813 7.0278L0.955102 7.0278C0.427614 7.0278 0 7.44754 0 7.9653C0 8.48307 0.427614 8.9028 0.955102 8.9028L11.4056 8.9028L8.87201 11.3897C8.49902 11.7558 8.49902 12.3494 8.87201 12.7155C9.245 13.0817 9.84974 13.0817 10.2227 12.7155L15 8.02632Z"
    />
  </SVGIcon>
)
