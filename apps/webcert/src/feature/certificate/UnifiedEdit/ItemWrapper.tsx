import styled, { css } from 'styled-components'
import { ConfigLayout } from '../../../types'

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
        return css`
          display: inline-block;
          width: 100%;
          padding-bottom: 0.9375rem;
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
