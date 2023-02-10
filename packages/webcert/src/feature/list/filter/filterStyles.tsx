import styled from 'styled-components'

interface WrapperProps {
  highlighted: boolean
}

export const FilterWrapper = styled.div<WrapperProps>`
  .dropdown {
    min-width: 30ch !important;
  }

  ${({ highlighted }) =>
    highlighted &&
    `
      .dropdown,
      input,
      button {
        :not(.error) {
          background-color: rgba(1, 165, 163, 0.08);
        }
      }
  `}
`
