import type React from 'react';
import { useRef } from 'react'
import styled from 'styled-components'
import Icon from '../../../components/image/image/Icon'
import Accordion from '../../../components/utils/Accordion'
import AccordionHeader from '../../../components/utils/AccordionHeader'
import type { ConfigAccordion } from '../../../types'

export interface Props {
  accordion: ConfigAccordion
  icon?: string
  open: boolean
}

const OpenLink = styled.h5.attrs({
  className: 'iu-fs-100 iu-fw-bold iu-lh-body close',
})`
  display: block;
  text-decoration: underline;
`

const CloseLink = styled.h5.attrs({
  className: 'iu-fs-100 iu-fw-bold iu-lh-body open',
})`
  display: none;
  text-decoration: underline;
`

const AccordionControl = styled(Accordion)`
  &[open] {
    ${OpenLink} {
      display: none;
    }
    ${CloseLink} {
      display: block;
    }
    ${AccordionHeader}.ic-expandable-button--chevron::after {
      margin-top: -3px;
    }
  }
  ${AccordionHeader}.ic-expandable-button--chevron::after {
    background-image: url("data:image/svg+xml,%3Csvg class='iu-svg-icon' xmlns='http://www.w3.org/2000/svg' width='18' height='10' viewBox='0 0 22 15'%3E%3Cpath fill='rgb(95,95,95)' d='M8.325 10.647L.585 3.259c-.78-.746-.78-1.954 0-2.7.782-.745 2.048-.745 2.83 0l9.153 8.738c.781.745.781 1.954 0 2.7l-9.154 8.737c-.78.746-2.047.746-2.828 0-.781-.745-.781-1.954 0-2.7l7.74-7.387z' transform='translate(-1290 -179) translate(410 141) rotate(90 432 470)'/%3E%3C/svg%3E") !important;
    position: static;
    margin-left: 5px;
    margin-top: 5px;
  }
`

const QuestionAccordion: React.FC<Props> = ({ accordion, icon, children, open }) => {
  const isOpen = useRef(open)
  return (
    <AccordionControl open={isOpen.current}>
      <AccordionHeader>
        {icon && <Icon iconType={icon} includeTooltip={true} />}
        <OpenLink>{accordion.openText}</OpenLink>
        <CloseLink>{accordion.closeText}</CloseLink>
      </AccordionHeader>
      {accordion?.header && <h5 className={`iu-fs-200 iu-lh-body`}>{accordion.header}</h5>}
      {children}
    </AccordionControl>
  )
}

export default QuestionAccordion
