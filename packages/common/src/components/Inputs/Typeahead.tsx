import { sanitizeText } from '@frontend/common'
import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { Element, scroller } from 'react-scroll'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import TextInput from './TextInput'

interface Props {
  value?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  inputStyles?: FlattenSimpleInterpolation
  listStyles?: FlattenSimpleInterpolation
  additionalStyles?: FlattenSimpleInterpolation
  disabled?: boolean
  placeholder?: string
  suggestions: Suggestion[]
  onSuggestionSelected: (value: string) => void
  onClose: () => void
  getItemText?: (item: string, value: string | undefined) => string
  highlighted?: boolean
  hasValidationError?: boolean
  moreResults?: boolean
  limit?: number
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

const Typeahead = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      disabled,
      onChange,
      value,
      inputStyles,
      listStyles,
      hasValidationError,
      placeholder,
      suggestions,
      onSuggestionSelected,
      onClose,
      moreResults,
      getItemText,
      limit,
    },
    ref
  ) => {
    const [cursor, setCursor] = useState(suggestions.length > 0 ? 0 : -1)
    const [hovered, setHovered] = useState<number>(-1)
    const typeaheadList = useRef<null | HTMLUListElement>(null)
    const [open, setOpen] = useState(false)

    const handleClose = useCallback(() => {
      setCursor(-1)
      setHovered(-1)
      setOpen(false)
      onClose()
    }, [onClose])

    const onClick = useCallback(
      (suggestion: Suggestion) => {
        if (!suggestion.disabled) {
          onSuggestionSelected(suggestion.label)
        }
      },
      [onSuggestionSelected]
    )

    const handleKeyDown: KeyboardEventHandler = useCallback(
      (event) => {
        if (open) {
          switch (event.key) {
            case 'ArrowDown':
              setCursor((prevState) => (prevState + 1) % suggestions.length)
              event.preventDefault()
              break
            case 'ArrowUp':
              setCursor((prevState) => (prevState - 1) % suggestions.length)
              event.preventDefault()
              break
            case 'Tab':
            case 'Enter':
              if (suggestions.length >= cursor && cursor >= 0) {
                onClick(suggestions[cursor])
                handleClose()
              }
              event.preventDefault()
              break
            case 'Escape':
              handleClose()
              break
          }
        }
      },
      [cursor, handleClose, onClick, open, suggestions]
    )

    useEffect(() => {
      if (cursor >= 0 && suggestions[cursor].label.length > 0 && cursor !== hovered) {
        const element = typeaheadList.current
        if (element !== null && element !== undefined) {
          scroller.scrollTo(`typeahead-item-${cursor}`, {
            duration: 0,
            delay: 0,
            smooth: false,
            containerId: 'typeahead-list',
            offset: -300,
          })
        }
      }
    }, [cursor, hovered, suggestions])

    const updateHovered = (i: number) => {
      setHovered(i)
      setCursor(i)
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

    return (
      <>
        <TextInput
          ref={ref}
          css={inputStyles}
          placeholder={placeholder}
          disabled={disabled}
          error={hasValidationError}
          onChange={(e) => {
            setOpen(true)
            onChange(e)
          }}
          value={value}
          onBlur={handleClose}
          limit={limit}
          onKeyDown={handleKeyDown}
          arial-activeDescendant={cursor >= 0 && open ? `typeahead-list-option-${cursor}` : undefined}
        />
        <div css={listStyles}>
          {open && suggestions.length > 0 && (
            <SuggestionsList id={'typeahead-list'} ref={typeaheadList}>
              {moreResults && (
                <MoreResultsListItem>Det finns fler träffar än vad som kan visas i listan, förfina sökningen.</MoreResultsListItem>
              )}
              {suggestions.map((item, index) => (
                <SuggestionsListItem
                  id={`typeahead-list-option-${index}`}
                  key={item.label}
                  role="option"
                  title={item.title ?? 'unknown-title'}
                  className={getItemClassName(item, index)}
                  onMouseDown={() => onClick(item)}
                  onMouseEnter={() => updateHovered(index)}
                  onMouseLeave={() => setHovered(-1)}>
                  <Element
                    name={`typeahead-item-${index}`}
                    dangerouslySetInnerHTML={sanitizeText(getItemText ? getItemText(item.label, value) : item.label)}
                  />
                </SuggestionsListItem>
              ))}
            </SuggestionsList>
          )}
        </div>
      </>
    )
  }
)

export default Typeahead
