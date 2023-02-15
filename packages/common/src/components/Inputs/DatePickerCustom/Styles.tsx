import styled from 'styled-components'

interface datePickerProps {
  vertical?: boolean
}

export const DatePickerWrapper = styled.div<datePickerProps>`
  display: ${(props) => (props.vertical === true ? 'block' : 'flex')};
  align-items: center;
`

interface buttonProps {
  displayValidationError: boolean
}

export const StyledButton = styled.button<buttonProps>`
  min-width: 0;
  padding: 0 !important;
  width: 55px;
  height: 3rem;
  box-shadow: none;
  background-color: ${(props) => (props.displayValidationError ? '#fbf2f4' : '#f7f4f2')};
  color: #000000;

  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
  border-right: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
  border-bottom: ${(props) => (props.displayValidationError ? '2px solid rgb(193, 33, 67)' : '0.125rem solid #01a5a3')};

  &:hover {
    background-color: ${(props) => (props.displayValidationError ? '#fbf2f4' : '#f7f4f2')};
    color: #000000;
  }
`

export const TextInput = styled.input`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 15ch;
  border-right: 0 !important;
  min-width: 124px;
  min-height: unset !important;

  &:focus {
    box-shadow: none;
  }
`

export const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

export const Wrapper = styled.div`
  display: inline-block;
`
export const FocusWrapper = styled.div`
  display: flex;
  height: 3rem;

  &:focus-within {
    box-shadow: 0 0 0.9375rem 0 rgb(27 27 27 / 40%);
    border-radius: 0.1875rem;
    width: 99%;
  }
`
