import React, { useRef } from 'react'
import styled from 'styled-components'
import { MandatoryIcon } from '@frontend/common'

const ArrowUp = styled.div`
  width: 0;
  height: 0;
  content: '';
  left: 35px;
  margin-left: 35px;
  border-width: 10px;
  border-height: 10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid;
  border-bottom-color: #e0e0e0;
`
interface Props {
  title: string
  header?: string
  description: string
  additionalStyles?: string
  displayMandatory?: boolean
}

const Text = styled.p`
  ul {
    list-style: unset;
    padding-left: 40px;
    margin-bottom: 10px;
  }
`

const Accordion: React.FC<Props> = ({ title, description, additionalStyles, displayMandatory, header }) => {
  const expandableRef = useRef<null | HTMLDivElement>(null)
  const expandBtn = useRef<null | HTMLButtonElement>(null)
  const hasHeader = header !== null && header !== '' && header !== undefined

  const toggleExpanded = () => {
    const btn = expandBtn.current
    const item = expandableRef.current

    if (!btn || !item) return

    btn.setAttribute('aria-expanded', item.classList.contains('ic-expandable--expanded') ? 'false' : 'true')
    item.classList.toggle('ic-expandable--expanded')
  }

  const getHeader = () => {
    if (!hasHeader) {
      return <h4 className={`iu-fs-300 iu-color-black ${additionalStyles}`}>{getContents()}</h4>
    } else {
      return <h5 className={`iu-fs-200 iu-color-black ${additionalStyles}`}>{getContents()}</h5>
    }
  }

  const getContents = () => {
    return (
      <>
        <MandatoryIcon display={displayMandatory as boolean}></MandatoryIcon>
        <button
          onClick={toggleExpanded}
          ref={expandBtn}
          className="ic-expandable-button ic-inner ic-expandable-button--chevron"
          aria-controls="content-1"
          aria-expanded="false"
          type="button">
          {title}
          <span className="ic-expandable-button__icon">
            <svg
              aria-hidden="true"
              focusable="false"
              className="iu-svg-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="15"
              viewBox="0 0 22 15">
              <path
                fill="currentColor"
                d="M8.325 10.647L.585 3.259c-.78-.746-.78-1.954 0-2.7.782-.745 2.048-.745 2.83 0l9.153 8.738c.781.745.781 1.954 0 2.7l-9.154 8.737c-.78.746-2.047.746-2.828 0-.781-.745-.781-1.954 0-2.7l7.74-7.387z"
                transform="translate(-1290 -179) translate(410 141) rotate(90 432 470)"
              />
            </svg>
          </span>
        </button>
      </>
    )
  }

  return (
    <>
      {hasHeader && <h4 className={`iu-fs-300 iu-color-black ${additionalStyles}`}>{header}</h4>}
      <div className="ic-expandable" ref={expandableRef}>
        {getHeader()}
        <div id="content-1" className="ic-expandable__content ic-expandable-target">
          <ArrowUp aria-hidden="true" />
          <Text
            className="iu-bg-grey-300 iu-p-300 iu-mb-300 iu-fs-200 iu-color-text"
            dangerouslySetInnerHTML={{ __html: description }}></Text>
        </div>
      </div>
    </>
  )
}

export default Accordion
