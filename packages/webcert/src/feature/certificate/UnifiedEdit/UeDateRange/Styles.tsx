import styled from 'styled-components/macro'

export const DatesWrapper = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 8px;
  }

  label {
    margin-right: 0.625em;
  }

  & + & {
    margin-left: 8px;
  }
`
export const DateGrid = styled.div`
  display: grid;
  align-items: baseline;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }
`
