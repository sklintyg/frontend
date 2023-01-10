import { ConfigLayout } from '@frontend/common/'
import styled, { css } from 'styled-components'

interface Props {
  layout: ConfigLayout
  index: number
  noItems: number
}

export const ItemWrapper = styled.div<Props>`
  ${(props) => {
    switch (props.layout) {
      case ConfigLayout.INLINE:
        return css`
          display: inline-block;
          min-width: 100px;
        `
      case ConfigLayout.COLUMNS: {
        const column = Math.trunc((2 * props.index) / props.noItems + 1)
        const row = props.index < props.noItems / 2 ? props.index + 1 : props.index - Math.ceil(props.noItems / 2) + 1
        return css`
          grid-column: ${column};
          grid-row: ${row};
        `
      }
    }
  }}
`
