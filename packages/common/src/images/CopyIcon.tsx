import React, { ComponentProps } from 'react'
import { SVGIcon } from './SVGIcon'

export const CopyIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 40" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.7931 2C6.35317 2 6 2.35537 6 2.78947V30.2105C6 30.6446 6.35317 31 6.7931 31C7.34539 31 7.7931 31.4477 7.7931 32C7.7931 32.5523 7.34539 33 6.7931 33C5.25243 33 4 31.753 4 30.2105V2.78947C4 1.24698 5.25243 0 6.7931 0H26.3103C27.851 0 29.1034 1.24698 29.1034 2.78947C29.1034 3.34176 28.6557 3.78947 28.1034 3.78947C27.5512 3.78947 27.1034 3.34176 27.1034 2.78947C27.1034 2.35537 26.7503 2 26.3103 2H6.7931Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7931 7C11.3532 7 11 7.35537 11 7.78947V37.2105C11 37.6446 11.3532 38 11.7931 38H33.3103C33.7503 38 34.1034 37.6446 34.1034 37.2105V7.78947C34.1034 7.35537 33.7503 7 33.3103 7H11.7931ZM9 7.78947C9 6.24698 10.2524 5 11.7931 5H33.3103C34.851 5 36.1034 6.24698 36.1034 7.78947V37.2105C36.1034 38.753 34.851 40 33.3103 40H11.7931C10.2524 40 9 38.753 9 37.2105V7.78947Z"
    />
  </SVGIcon>
)
