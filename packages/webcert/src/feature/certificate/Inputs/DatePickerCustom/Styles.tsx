import styled from 'styled-components'

export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
`

interface buttonProps {
  displayValidationError: boolean
}

export const StyledButton = styled.button<buttonProps>`
  padding: 13px !important;
  min-width: 0;
  box-shadow: none;
  border-width: 1px !important;
  border-bottom-width: 2px !important;

  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
`

export const TextInput = styled.input`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 15ch;
  border-right: 0 !important;
`

export const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
