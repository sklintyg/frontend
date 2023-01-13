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

export const Badge: React.FC<{ label?: string }> = ({ label, children }) => {
  if (label != null && label.length > 0) {
    return (
      <Root className={'ic-badge ic-badge--small iu-bg-secondary-light'}>
        {label} {children}
      </Root>
    )
  }

  if (children) {
    return <Root className={'ic-badge ic-badge--small iu-bg-secondary-light'}>{children}</Root>
  }

  return null
}
