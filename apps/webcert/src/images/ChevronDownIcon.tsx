import type { ComponentProps } from 'react';
import type React from 'react'
import { SVGIcon } from './SVGIcon'

export const ChevronDownIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 22 15" {...props}>
    <path
      d="M8.325 10.647L.585 3.259c-.78-.746-.78-1.954 0-2.7.782-.745 2.048-.745 2.83 0l9.153 8.738c.781.745.781 1.954 0 2.7l-9.154 8.737c-.78.746-2.047.746-2.828 0-.781-.745-.781-1.954 0-2.7l7.74-7.387z"
      transform="translate(-1290 -179) translate(410 141) rotate(90 432 470)"
    />
  </SVGIcon>
)
