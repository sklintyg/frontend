import { ConfigLayout } from '@frontend/common'
import styled, { css } from 'styled-components'

interface Props {
  layout: ConfigLayout
}

export const GroupWrapper = styled.div<Props>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 0.9375rem;
      `
    }
  }}
`
