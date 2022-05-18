import React from 'react'
import styled from 'styled-components'

const NumberCircle = styled.span`
  min-width: 10px;
  padding: 3px 7px !important;
  white-space: nowrap;
  text-align: center;
  border-radius: 20px;
  margin-left: 8px;
`

interface Props {
  number: number | string
  style: 'primary' | 'secondary'
  className?: string
}

export const Divider: React.FC<Props> = ({ number, style, className }) => {
  return (
    <NumberCircle className={`${className} ${style === 'secondary' ? 'ic-button iu-bg-main iu-color-white' : 'iu-bg-white iu-color-main'}`}>
      {number}
    </NumberCircle>
  )
}

export default Divider
