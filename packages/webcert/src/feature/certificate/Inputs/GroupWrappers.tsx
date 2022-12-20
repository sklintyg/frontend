import { ConfigLayout } from '@frontend/common/'
import styled, { css } from 'styled-components'

interface checkboxesProps {
  layout: ConfigLayout
}

interface checkboxProps {
  layout: ConfigLayout
  index: number
  noItems: number
}

export const GroupWrapper = styled.div<checkboxesProps>`
  ${(props) => {
    if (props.layout === ConfigLayout.COLUMNS) {
      return css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 15px;
      `
    }
  }}
`

export const ItemWrapper = styled.div<checkboxProps>`
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
