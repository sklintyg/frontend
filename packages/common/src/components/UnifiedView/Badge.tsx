import styled from 'styled-components'

export const Badge = styled.div.attrs({
  className: 'ic-badge ic-badge--small iu-bg-secondary-light',
})`
  overflow-wrap: anywhere;
  white-space: pre-wrap;

  ul {
    list-style: unset;
    padding-left: 15px;
  }

  &:empty {
    display: none;
  }
`
