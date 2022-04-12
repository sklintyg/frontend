import styled from 'styled-components/macro'

interface WrapperProps {
  highlighted: boolean
}

export const FilterWrapper = styled.div<WrapperProps>`
  .dropdown {
    min-width: 30ch !important;
  }

  .dropdown,
  input,
  button {
    :not(.error) {
      background-color: ${(props) => (props.highlighted ? 'rgba(1, 165, 163, 0.08)' : '')};
    }
  }
`
