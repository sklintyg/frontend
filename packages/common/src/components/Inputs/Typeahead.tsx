import React, { ChangeEvent } from 'react'
import TextInput from './TextInput'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import type {} from "styled-components/cssprop"

interface Props {
  id: string
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: FlattenSimpleInterpolation
  disabled?: boolean
  placeholder?: string
  suggestions: string[]
  onSuggestionSelected: (value: string) => void
  open: boolean
  highlight?: boolean
}

const Typeahead: React.FC<Props> = (props) => {
  const {
    disabled,
    id,
    onChange,
    value,
    additionalStyles,
    hasValidationError,
    placeholder,
    suggestions,
    onSuggestionSelected,
    open,
    highlight,
  } = props

  const SuggestionsList = styled.ul`
      list-style-type: none;
      text-align: left;
      margin: 0;
      padding: 0;
      border-top: 1px solid gray;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.18);
  `
  const SuggestionsListItem  = styled.li`
      padding: 10px 5px;
      cursor: pointer;

    :hover {
      background: lightgray;
      text-decoration: underline;
    }
  `

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null
    }
    return (
      <SuggestionsList>
        {suggestions.map((item) => (
          <SuggestionsListItem key={item} onClick={(e) => onSuggestionSelected(item)} dangerouslySetInnerHTML={{ __html: getItemText(item)}}>
          </SuggestionsListItem>
        ))}
      </SuggestionsList>
    )
  }

  const getItemText = (item: string) => {
    if(value !== undefined) {
      const searchedDescription = value?.indexOf('|') !== -1 ? value.split('|')[1] : value
      const index = item.toLowerCase().indexOf(searchedDescription.toLowerCase())
      if (index !== -1 && highlight) {
        return `${item.substr(0, index)} <span class="iu-fw-bold">${item.substr(index, searchedDescription?.length)}</span>${item.substr(index + searchedDescription?.length, item.length)}`
      } else return item
    } else return item
  }

  return (
    <div className="iu-fullwidth" css={additionalStyles}>
      <TextInput
        placeholder={placeholder}
        disabled={disabled}
        hasValidationError={hasValidationError}
        onChange={onChange}
        value={value}
        key={id + '-input'}
      />
      {open ? renderSuggestions() : ''}
    </div>
  )
}

export default Typeahead
