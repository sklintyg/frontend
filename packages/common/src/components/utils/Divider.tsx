import React from 'react'
import styled from 'styled-components'

const Hr = styled.hr`
  border: none;
  height: 1px;
  margin: 0;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.12);
`

const Divider = () => {
  return <Hr />
}

export default Divider
