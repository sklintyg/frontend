import React, { ChangeEvent, useState, useEffect, useRef } from 'react'
import TextInput from './TextInput'
import styled from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { scroller, Element } from 'react-scroll'

interface Props {
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  inputStyles?: FlattenSimpleInterpolation
  listStyles?: FlattenSimpleInterpolation
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

const SuggestionsList = styled.ul`
  list-style-type: none;
  text-align: left;
  position: absolute;
  margin: 0;
  padding: 0;
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
`
const SuggestionsListItem = styled.li`
  padding: 10px 5px;
  cursor: pointer;

  &:hover {
    background-color: #01a5a3;
    color: white;
  }
`

const MoreResultsListItem = styled.li`
  padding: 10px 5px;
  cursor: pointer;
`

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = React.useState(false)

  // @ts-ignore
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  // @ts-ignore
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  })

  return keyPressed
}

const Typeahead: React.FC<Props> = (props) => {
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
  const [cursor, setCursor] = useState(suggestions.length === 1 ? 0 : -1)
  const [hovered, setHovered] = useState<number | null>(null)
  const typeaheadList = useRef<null | HTMLUListElement>(null)
  const listItemsRef = useRef([])

  useEffect(() => {
    listItemsRef.current = listItemsRef.current.slice(0, suggestions.length)
  }, [suggestions])

  useEffect(() => {
    if (suggestions.length && downPress && open) {
      setCursor((prevState) => (prevState < suggestions.length - 1 ? prevState + 1 : 0))
    }
  }, [downPress])
  useEffect(() => {
    if (suggestions.length && upPress && open) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : suggestions.length - 1))
    }
  }, [upPress])
  useEffect(() => {
    if (suggestions.length >= cursor && cursor >= 0 && open) {
      onSuggestionSelected(suggestions[cursor])
    }
  }, [enterPress])

  useEffect(() => {
    if (cursor >= 0 && suggestions[cursor].length > 0) {
      const element = typeaheadList.current
      if (element !== null && element !== undefined) {
        console.log(element.children[cursor].children[0])
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

  const handleClose = () => {
    setCursor(-1)
    onClose()
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
            key={item}
            role="option"
            className={`${i === cursor ? 'iu-bg-main iu-color-white' : ''} ${
              cursor >= 0 && hovered === i && hovered !== cursor ? 'iu-bg-secondary-light iu-color-black' : ''
            }`}
            onMouseDown={(e) => onSuggestionSelected(item)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <Element name={'typeahead-item-' + i} dangerouslySetInnerHTML={{ __html: getItemText ? getItemText(item, value) : item }} />
          </SuggestionsListItem>
        ))}
      </SuggestionsList>
    )
  }

  return (
    <>
      <TextInput
        expanded={open}
        additionalStyles={inputStyles}
        placeholder={placeholder}
        disabled={disabled}
        hasValidationError={hasValidationError}
        onChange={onChange}
        value={value}
        onBlur={handleClose}
      />
      <div css={listStyles}>{open ? renderSuggestions() : ''}</div>
    </>
  )
}

export default Typeahead
