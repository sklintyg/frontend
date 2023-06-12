import { ConfigLayout } from '@frontend/common'
import styled, { css } from 'styled-components'

interface Props {
  layout: ConfigLayout
  index: number
  noItems: number
}

export const ItemWrapper = styled.div<Props>`
  ${({ noItems, index, layout }) => {
    switch (layout) {
      case ConfigLayout.INLINE:
        return css`
          display: inline-block;
          :not(:last-child) {
            padding-right: 0.9375rem;
          }
          ${noItems > 2
            ? css`
                min-width: 6.25rem;
              `
            : ''}
        `
      case ConfigLayout.COLUMNS: {
        const column = Math.trunc((2 * index) / noItems + 1)
        const row = index < noItems / 2 ? index + 1 : index - Math.ceil(noItems / 2) + 1
        return css`
          grid-column: ${column};
          grid-row: ${row};
        `
      }
      default:
        return css`
          :not(:last-child) {
            padding-bottom: 0.9375rem;
          }
        `
    }
  }}
`
