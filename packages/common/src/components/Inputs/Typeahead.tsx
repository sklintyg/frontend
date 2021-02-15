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
  } = props

  const TypeaheadWrapper = styled.div`
    ${additionalStyles}
  
    width: 100%;

    input {
      width: 100%;
      box-sizing: border-box;
      outline: none;
      max-height: 135px;
    }

    ul::before {
      content: '';
    }

    ul {
      list-style-type: none;
      text-align: left;
      margin: 0;
      padding: 0;
      border-top: 1px solid gray;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.18);
    }

    li {
      padding: 10px 5px;
      cursor: pointer;
    }

    li:hover {
      background: lightgray;
      text-decoration: underline;
    }
  `

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null
    }
    return (
      <ul>
        {suggestions.map((item) => (
          <li key={item} onClick={(e) => onSuggestionSelected(item)} dangerouslySetInnerHTML={{ __html: getItemText(item)}}>
          </li>
        ))}
      </ul>
    )
  }

  const getItemText = (item: string) => {
    const index = item.indexOf(item)
    if(index !== -1) {
      return `${item.substr(0, index)}<span class="iu-fw-bold">${item.substr(index, value?.length)}</span>${item.substr(index + value?.length, item.length)}`
    } else return item
  }

  return (
    <TypeaheadWrapper>
      <TextInput
        placeholder={placeholder}
        disabled={disabled}
        hasValidationError={hasValidationError}
        onChange={onChange}
        value={value}
        key={id + '-input'}
      />
      {open ? renderSuggestions() : ''}
    </TypeaheadWrapper>
  )
}

export default Typeahead
