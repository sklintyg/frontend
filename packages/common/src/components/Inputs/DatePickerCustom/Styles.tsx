import styled from 'styled-components'

export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
`

interface buttonProps {
  displayValidationError: boolean
}

export const StyledButton = styled.button<buttonProps>`
  min-width: 0;
  padding: 0 !important;
  width: 55px;
  height: 2.956rem;
  box-shadow: none;

  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
`

export const TextInput = styled.input`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 15ch;
  border-right: 0 !important;
  min-width: 122px;
`

export const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
