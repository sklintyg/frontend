import type { ComponentProps } from 'react';
import type React from 'react'
import { SVGIcon } from './SVGIcon'

export const DoubleArrowIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 41" {...props}>
    <path
      d="M32.057 22.2529L40 14.3099L32.057 6.36691C31.5652 5.87509 30.7678 5.87509 30.276 6.36691C29.7842 6.85872 29.7842 7.65611 30.276 8.14793L35.0718 12.9438L16.3938 12.9438C15.6983 12.9438 15.1344 13.5076 15.1344 14.2031C15.1344 14.8987 15.6983 15.4625 16.3938 15.4625L35.2853 15.4625L30.276 20.4719C29.7842 20.9637 29.7842 21.7611 30.276 22.2529C30.7678 22.7447 31.5652 22.7447 32.057 22.2529Z"
      fill="currentColor"
    />
    <path
      d="M0 28.4148L7.94298 36.3578C8.4348 36.8496 9.23218 36.8496 9.724 36.3578C10.2158 35.866 10.2158 35.0686 9.724 34.5768L4.71465 29.5675L23.6062 29.5674C24.3017 29.5674 24.8656 29.0036 24.8656 28.3081C24.8656 27.6125 24.3017 27.0487 23.6062 27.0487L4.92816 27.0487L9.724 22.2529C10.2158 21.7611 10.2158 20.9637 9.724 20.4719C9.23218 19.98 8.43479 19.98 7.94298 20.4719L0 28.4148Z"
      fill="currentColor"
    />
  </SVGIcon>
)
