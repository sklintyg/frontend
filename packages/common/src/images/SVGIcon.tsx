import React from 'react'

interface Props {
  size?: 'sm' | 'lg'
}

const LargeStyle = { verticalAlign: '-0.225em', fontSize: '1.3333333333em', lineHeight: '0.75em' }
const SmallStyle = { fontSize: '0.875em' }

export const SVGIcon = ({ style, size, ...props }: React.SVGAttributes<SVGElement> & Props): React.ReactElement => (
  <svg
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    style={{
      display: 'inline-block',
      width: '1em',
      height: '1em',
      verticalAlign: '-0.125em',
      ...(size === 'lg' ? LargeStyle : size === 'sm' ? SmallStyle : {}),
      ...style,
    }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.children}
  </svg>
)
