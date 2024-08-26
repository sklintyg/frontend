import type { KeyboardEventHandler } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { sanitizeText } from '../../utils/sanitizeText'
import TextInput from './TextInput'

interface Props extends React.ComponentProps<typeof TextInput> {
  suggestions: Suggestion[]
  onSuggestionSelected: (value: string) => void
  onClose?: () => void
  getItemText?: (item: string, value: string | number | readonly string[] | undefined) => string
  moreResults?: boolean
  'data-testid'?: string
}

export interface Suggestion {
  label: string
  disabled: boolean
  title: string | null
}

const Root = styled.div`
  position: relative;
`

const SuggestionListWrapper = styled.div`
  background: #fff;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.1),
    0 2px 4px 1px rgba(0, 0, 0, 0.18);
  border-top: 1px solid gray;
  z-index: 100000;
  position: absolute;
  left: 0;
  right: 0;
  min-width: 20rem;
`

const SuggestionList = styled.ul`
  list-style-type: none;
  text-align: left;
  max-height: 20rem;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 5px 0;

  .disabled {
    cursor: not-allowed !important;
  }
`
const SuggestionListItem = styled.li`
  padding: 3px 20px;
  cursor: pointer;

  &:hover {
    background-color: #01a5a3;
    color: white;
  }
`

const MoreResultsListItem = styled.div`
  padding: 7px 20px;
  font-style: italic;
  border-bottom: 1px solid #bbbbbb;
  cursor: auto;
`

const Typeahead = React.forwardRef<HTMLInputElement, Props>(
  ({ suggestions, onSuggestionSelected, onClose, onChange, onBlur, onKeyDown, onClick, moreResults, getItemText, ...props }, ref) => {
    const [cursor, setCursor] = useState(-1)
    const [hovered, setHovered] = useState<number>(-1)
    const typeaheadList = useRef<null | HTMLUListElement>(null)
    const [open, setOpen] = useState(false)

    const handleClose = useCallback(() => {
      setHovered(-1)
      setOpen(false)
      onClose && onClose()
    }, [onClose])

    const onSelect = useCallback(
      (suggestion: Suggestion) => {
        if (!suggestion.disabled) {
          onSuggestionSelected(suggestion.label)
          setOpen(false)
        }
      },
      [onSuggestionSelected]
    )

    useEffect(() => {
      setCursor(suggestions.length > 0 ? 0 : -1)
    }, [open, suggestions])

    const scrollToItem = useCallback((index: number) => {
      const element = typeaheadList.current
      if (index >= 0 && element != null && element.children[index] != null) {
        element.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }, [])

    const handleKeyDown: KeyboardEventHandler = useCallback(
      (event) => {
        if (open && suggestions.length > 0) {
          switch (event.key) {
            case 'ArrowDown': {
              if (suggestions.some((val) => val.disabled === false)) {
                let index = suggestions.findIndex(({ disabled }, index) => index >= (cursor + 1) % suggestions.length && disabled === false)
                if (index === -1) {
                  index = suggestions.findIndex(({ disabled }) => disabled === false, 0)
                }
                setCursor(index)
                scrollToItem(index)
              }
              event.preventDefault()
              break
            }
            case 'ArrowUp': {
              if (suggestions.some((val) => val.disabled === false)) {
                const startIndex = cursor === 0 ? suggestions.length - 1 : cursor - 1
                let index = suggestions.findLastIndex(({ disabled }) => disabled === false, startIndex % suggestions.length)
                if (index === -1) {
                  index = suggestions.findLastIndex(({ disabled }) => disabled === false, suggestions.length - 1)
                }
                setCursor(index)
                scrollToItem(index)
              }
              event.preventDefault()
              break
            }
            case 'Tab':
            case 'Enter':
              if (suggestions.length >= cursor && cursor >= 0) {
                suggestions[cursor] && onSelect(suggestions[cursor])
              }
              event.preventDefault()
              break
            case 'Escape':
              handleClose()
              break
          }
        }
      },
      [cursor, handleClose, onSelect, open, scrollToItem, suggestions]
    )

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
      <Root>
        <TextInput
          ref={ref}
          onClick={(evt) => {
            setOpen(true)
            onClick && onClick(evt)
          }}
          onChange={(evt) => {
            setOpen(true)
            onChange && onChange(evt)
          }}
          onBlur={(evt) => {
            handleClose()
            onBlur && onBlur(evt)
          }}
          onKeyDown={(evt) => {
            handleKeyDown(evt)
            onKeyDown && onKeyDown(evt)
          }}
          arial-activedescendant={cursor >= 0 && open ? `typeahead-list-option-${cursor}` : undefined}
          {...props}
        />
        {open && suggestions.length > 0 && (
          <SuggestionListWrapper>
            {moreResults && (
              <MoreResultsListItem>Det finns fler träffar än vad som kan visas i listan, förfina sökningen.</MoreResultsListItem>
            )}
            <SuggestionList data-testid={`${props['data-testid'] ?? 'typeahead'}-list`} ref={typeaheadList}>
              {suggestions.map((item, index) => (
                <SuggestionListItem
                  data-testid={`${props['data-testid'] ?? 'typeahead'}-list-option-${index}`}
                  key={item.label}
                  role="option"
                  title={item.title ?? 'unknown-title'}
                  className={getItemClassName(item, index)}
                  onMouseDown={() => onSelect(item)}
                  onMouseEnter={() => updateHovered(index)}
                  onMouseLeave={() => setHovered(-1)}
                  dangerouslySetInnerHTML={sanitizeText(getItemText ? getItemText(item.label, props.value) : item.label)}
                />
              ))}
            </SuggestionList>
          </SuggestionListWrapper>
        )}
      </Root>
    )
  }
)

export default Typeahead
