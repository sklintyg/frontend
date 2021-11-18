import styled, { css } from 'styled-components/macro'

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
export const DateRangeWrapper = styled.div`
  display: grid;
  grid-template-columns: 135px repeat(2, 1fr);
  align-items: baseline;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }
`

export const checkBoxStyles = css`
  margin-right: 40px;
  min-width: 120px;
`
export const DaysRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;

  > * + * {
    margin-left: 0.5rem;
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

export const TextInput = styled.input`
  max-width: 35px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

export const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
  }
`
