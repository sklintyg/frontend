import React, { ChangeEvent } from 'react'
import TextInput from './TextInput'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { css } from 'styled-components'

interface Props {
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  additionalStyles?: FlattenSimpleInterpolation
  disabled?: boolean
  placeholder?: string
  suggestions: string[]
  onSuggestionSelected: (value: string) => void
  open: boolean
  onClose: () => void
  getItemText?: (item: string, value: string | undefined) => string
  highlighted?: boolean
  hasValidationError?: boolean
  moreResults?: boolean
}

const styles = css`
  position: relative;
`

const SuggestionsList = styled.ul`
  flex: 0 0 100%;
  position: absolute;
  list-style-type: none;
  text-align: left;
  margin: 0;
  padding: 0;
  border-top: 1px solid gray;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.18);
  left: 0;
  right: 0;
  z-index: 100000;
  background-color: white;
  max-height: 350px;
  overflow-y: scroll;
`
const SuggestionsListItem = styled.li`
  padding: 10px 5px;
  cursor: pointer;

  :hover {
    background: #00706e; // SECONDARY DARK
    color: white;
  }
`

const MoreResultsListItem = styled.li`
  padding: 10px 5px;
  cursor: pointer;
`

const Typeahead: React.FC<Props> = (props) => {
  const {
    disabled,
    onChange,
    value,
    additionalStyles,
    hasValidationError,
    placeholder,
    suggestions,
    onSuggestionSelected,
    open,
    onClose,
    moreResults,
    getItemText,
  } = props

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null
    }
    return (
      <SuggestionsList className="ic-block-list">
        {moreResults ? (
          <MoreResultsListItem>Det finns fler träffar än vad som kan visas i listan, förfina sökningen.</MoreResultsListItem>
        ) : (
          ''
        )}
        {suggestions.map((item) => (
          <SuggestionsListItem
            key={item}
            onMouseDown={(e) => onSuggestionSelected(item)}
            dangerouslySetInnerHTML={{ __html: getItemText ? getItemText(item, value) : item }}></SuggestionsListItem>
        ))}
      </SuggestionsList>
    )
  }

  return (
    <div
      className="iu-fullwidth"
      onBlur={onClose}
      css={`
        ${additionalStyles} ${styles}
      `}>
      <TextInput placeholder={placeholder} disabled={disabled} hasValidationError={hasValidationError} onChange={onChange} value={value} />
      {open ? renderSuggestions() : ''}
    </div>
  )
}

export default Typeahead
