import styled, { css } from 'styled-components'
import { ConfigLayout } from '../../../types'

interface Props {
  layout: ConfigLayout
}

export const GroupWrapper = styled.div<Props>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        column-count: 2;
        gap: 0.9375rem;
      `
    }
  }}
`
