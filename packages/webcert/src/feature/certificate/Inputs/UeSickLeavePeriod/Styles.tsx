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
`
export const DateRangeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  & + & {
    margin-top: 20px;
  }

  & #fromWrapper {
    margin-right: 40px;
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
`

export const TextInput = styled.input`
  max-width: 35px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`
