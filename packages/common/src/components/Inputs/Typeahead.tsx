import React, { ChangeEvent, useState, useEffect, useRef } from 'react'
import TextInput from './TextInput'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { scroller, Element } from 'react-scroll'
import { useKeyPress } from '../../utils/userFunctionUtils'

interface Props {
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  inputStyles?: FlattenSimpleInterpolation
  listStyles?: FlattenSimpleInterpolation
  additionalStyles?: FlattenSimpleInterpolation
  disabled?: boolean
  placeholder?: string
  suggestions: Suggestion[]
  onSuggestionSelected: (value: string) => void
  open: boolean
  onClose: () => void
  getItemText?: (item: string, value: string | undefined) => string
  highlighted?: boolean
  hasValidationError?: boolean
  moreResults?: boolean
}

export interface Suggestion {
  label: string
  disabled: boolean
  title: string | null
}

const SuggestionsList = styled.ul`
  list-style-type: none;
  text-align: left;
  position: absolute;
  margin: 0;
  padding: 5px 0;
  border-top: 1px solid gray;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.18);
  left: 0;
  right: 0;
  z-index: 100000;
  background-color: white;
  max-height: 350px;
  overflow-y: auto;
  flex: 1;
  grid-area: ul;

  .disabled {
    cursor: not-allowed !important;
  }
`
const SuggestionsListItem = styled.li`
  padding: 3px 20px;
  cursor: pointer;

  &:hover {
    background-color: #01a5a3;
    color: white;
  }
`

const MoreResultsListItem = styled.li`
  padding: 7px 3px;
  cursor: auto;
`

const Typeahead: React.FC<Props & { ref?: React.Ref<HTMLInputElement> }> = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    disabled,
    onChange,
    value,
    inputStyles,
    listStyles,
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

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const enterPress = useKeyPress('Enter')
  const escPress = useKeyPress('Escape')
  const tabPress = useKeyPress('Tab')
  const [cursor, setCursor] = useState(suggestions.length > 0 ? 0 : -1)
  const [hovered, setHovered] = useState<number>(-1)
  const typeaheadList = useRef<null | HTMLUListElement>(null)

  useEffect(() => {
    setCursor(suggestions.length > 0 && open ? 0 : -1)
  }, [suggestions])
  useEffect(() => {
    if (hovered >= 0) {
      setCursor(hovered)
    }
  }, [hovered])
  useEffect(() => {
    if (suggestions.length > 0 && downPress && open) {
      setCursor((prevState) => (prevState < suggestions.length - 1 ? prevState + 1 : 0))
    }
  }, [downPress])
  useEffect(() => {
    if (suggestions.length > 0 && upPress && open) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : suggestions.length - 1))
    }
  }, [upPress])
  useEffect(() => {
    if ((enterPress || tabPress) && suggestions.length >= cursor && cursor >= 0 && open) {
      onClick(suggestions[cursor])
    }
  }, [enterPress, tabPress])
  useEffect(() => {
    if (escPress && open) {
      handleClose()
    }
  }, [escPress])
  useEffect(() => {
    if (cursor >= 0 && suggestions[cursor].label.length > 0 && cursor !== hovered) {
      const element = typeaheadList.current
      if (element !== null && element !== undefined) {
        scroller.scrollTo('typeahead-item-' + cursor, {
          duration: 0,
          delay: 0,
          smooth: false,
          containerId: 'typeahead-list',
          offset: -10,
        })
      }
    }
  }, [cursor])

  const updateHovered = (i: number) => {
    setHovered(i)
    setCursor(i)
  }

  const handleClose = () => {
    setCursor(-1)
    setHovered(-1)
    onClose()
  }

  const getItemClassName = (item: Suggestion, index: number) => {
    const isCursor = index === cursor
    const isHoverDifferentFromCursor = cursor >= 0 && hovered === index && hovered !== cursor
    if (item.disabled) {
      return 'iu-color-muted iu-bg-white disabled'
    } else if (isHoverDifferentFromCursor) {
      return 'iu-bg-secondary-light iu-color-grey-500'
    } else if (isCursor) {
      return 'iu-bg-main iu-color-white'
    }
  }

  const onClick = (suggestion: Suggestion) => {
    if (!suggestion.disabled) {
      onSuggestionSelected(suggestion.label)
    }
  }

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null
    }
    return (
      <SuggestionsList id={'typeahead-list'} ref={typeaheadList}>
        {moreResults ? (
          <MoreResultsListItem>Det finns fler träffar än vad som kan visas i listan, förfina sökningen.</MoreResultsListItem>
        ) : (
          ''
        )}
        {suggestions.map((item, i) => (
          <SuggestionsListItem
            id={'typeahead-list-option-' + i}
            key={item.label}
            role="option"
            title={item.title ?? 'unknown-title'}
            className={getItemClassName(item, i)}
            onMouseDown={(e) => onClick(item)}
            onMouseEnter={() => updateHovered(i)}
            onMouseLeave={() => setHovered(-1)}>
            <Element
              name={'typeahead-item-' + i}
              dangerouslySetInnerHTML={{ __html: getItemText ? getItemText(item.label, value) : item.label }}
            />
          </SuggestionsListItem>
        ))}
      </SuggestionsList>
    )
  }

  return (
    <>
      <TextInput
        ref={ref}
        expanded={open}
        additionalStyles={inputStyles}
        placeholder={placeholder}
        disabled={disabled}
        hasValidationError={hasValidationError}
        onChange={onChange}
        value={value}
        onBlur={handleClose}
        activeDescendant={cursor >= 0 && open ? 'typeahead-list-option-' + cursor : undefined}
      />
      <div css={listStyles}>{open ? renderSuggestions() : ''}</div>
    </>
  )
})

export default Typeahead
