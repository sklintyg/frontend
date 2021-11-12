import * as React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  overflow-wrap: anywhere;
  white-space: pre-wrap;

  ul {
    list-style: unset;
    padding-left: 15px;
  }
`

const Badge: React.FC = ({ children }) => {
  return <Root className={'ic-badge ic-badge--small iu-bg-secondary-light'}>{children}</Root>
}

export default Badge
