import styled from 'styled-components'

export const UserHeaderMenuItem = styled.li`
  display: flex;
  align-items: center;

  :not(:last-child) {
    border-right: 1px solid #01a5a3;
    padding-right: 0.625rem;
  }
`

export const UserHeaderMenu = styled.ul.attrs({ className: 'ic-link-list--nav iu-ml-400' })`
  height: 100%;
  gap: 0.625rem;
`
