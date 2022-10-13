import {
  CertificateDataElement,
  CertificateDataValidationType,
  ConfigUeTypeahead,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValueText,
} from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import styled, { css } from 'styled-components'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'
import { Element, scroller } from 'react-scroll'

export interface Props {
  question: CertificateDataElement
  disabled?: boolean
}

const UeTypeahead: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const questionConfig = question.config as ConfigUeTypeahead
  const [text, setText] = useState((question.value as ValueText).text)
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([] as string[])
  const dispatch = useDispatch()
  const questionHasValidationError = useSelector(getQuestionHasValidationError(question.id))
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const dispatchEditDraft = useRef(
    _.debounce((question: CertificateDataElement, value: string) => {
      const updatedValue = getUpdatedValue(question, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  const SuggestionsList = styled.ul`
    list-style-type: none;
    text-align: left;
    position: absolute;
    margin: 43px 0 0 17px;
    grid-column: span 6;
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
    display: ${open ? 'block' : 'none'};
    width: 494px;
  `

  const SuggestionsListItem = styled.li`
    padding: 3px 20px;
    cursor: pointer;

    &:hover {
      background-color: #01a5a3;
      color: white;
    }
  `

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
  }, [open, suggestions])
  useEffect(() => {
    if (hovered >= 0) {
      setCursor(hovered)
    }
  }, [hovered])
  useEffect(() => {
    if (suggestions.length > 0 && downPress && open) {
      setCursor((prevState) => (prevState < suggestions.length - 1 ? prevState + 1 : 0))
    }
  }, [downPress, open, suggestions.length])
  useEffect(() => {
    if (suggestions.length > 0 && upPress && open) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : suggestions.length - 1))
    }
  }, [open, suggestions.length, upPress])
  useEffect(() => {
    if ((enterPress || tabPress) && suggestions.length >= cursor && cursor >= 0 && open) {
      handleEnter(suggestions[cursor])
    }
  }, [cursor, enterPress, open, suggestions, tabPress])
  useEffect(() => {
    if (escPress && open) {
      handleClose()
    }
  }, [escPress, open])
  useEffect(() => {
    if (cursor >= 0 && suggestions[cursor].length > 0 && cursor !== hovered) {
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
  }, [cursor, hovered, suggestions])

  const updateHovered = (i: number) => {
    setHovered(i)
    setCursor(i)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEnter = (selectedValue: string) => {
    setText(selectedValue)
    setOpen(false)
  }

  const onClick = (suggestion: string) => {
    if (suggestion) {
      setText(suggestion)
      setOpen(false)
    }
  }

  const wholeRowGrid = css`
    position: relative;
    grid-column-end: diagnosis;
    grid-column-start: code;
  `

  const getItemClassName = (item: string, index: number) => {
    const isCursor = index === cursor
    const isHoverDifferentFromCursor = cursor >= 0 && hovered === index && hovered !== cursor
    if (isHoverDifferentFromCursor) {
      return 'iu-bg-secondary-light iu-color-grey-500'
    } else if (isCursor) {
      return 'iu-bg-main iu-color-white'
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newText = event.currentTarget.value
    setText(newText)
    if (!open) {
      setCursor(0)
    }
    setOpen(true)
    dispatchEditDraft(question, newText)

    if (newText === undefined || newText === null) {
      return []
    }
    setSuggestions(questionConfig.typeahead.filter((suggestion: string) => suggestion.toLowerCase().indexOf(newText.toLowerCase()) >= 0))
  }

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null
    }
    return (
      <SuggestionsList id={'typeahead-list'} ref={typeaheadList}>
        {suggestions.map((item, i) => (
          <SuggestionsListItem
            id={'typeahead-list-option-' + i}
            key={item}
            role="option"
            title={item}
            className={getItemClassName(item, i)}
            onMouseDown={(e) => onClick(item)}
            onMouseEnter={() => updateHovered(i)}
            onMouseLeave={() => setHovered(-1)}>
            <Element name={item}>{item}</Element>
          </SuggestionsListItem>
        ))}
      </SuggestionsList>
    )
  }

  return (
    <div className="iu-pt-200 iu-grid-cols iu-grid-cols-12">
      <TextInput
        className="iu-grid-span-6"
        disabled={disabled}
        hasValidationError={questionHasValidationError}
        onChange={handleChange}
        value={text === null ? '' : text}
        limit={textValidation ? textValidation.limit : 100}
      />
      <div css={wholeRowGrid}>{open ? renderSuggestions() : ''}</div>

      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

function getUpdatedValue(question: CertificateDataElement, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueText) }
  ;(updatedQuestion.value as ValueText).text = text
  return updatedQuestion
}

export default UeTypeahead
