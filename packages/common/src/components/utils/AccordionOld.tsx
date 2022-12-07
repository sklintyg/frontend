import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { MandatoryIcon, sanitizeText } from '@frontend/common'
import React from 'react'
import styled, { css } from 'styled-components'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import Icon from '../image/Icon'

const mandatoryIconAdditionalStyles = css`
  top: -4px;
`
const Text = styled.p`
  max-height: 195px;
  overflow-y: auto;
  white-space: pre-wrap;

  ol {
    list-style-position: inside;
    list-style-type: decimal;
    white-space: normal;

    li {
      padding-bottom: 5px;
      padding-top: 5px;
    }
  }

  ul {
    list-style: disc;
    padding-left: 40px;
    margin-bottom: 10px;
    li {
      padding-bottom: unset;
      padding-top: unset;
    }
  }
`

const StyledSummary = styled.summary`
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 0 !important;
  & ::after {
    top: 20px !important;
  }

  &:focus {
    outline-width: 2px;
    outline-style: solid;
    outline-color: #a1958a;
    outline-offset: 3px;
  }
`
interface detailsProperties {
  isControl?: boolean
}
const StyledDetails = styled.details<detailsProperties>`
  padding: 0 !important;
  overflow: visible;
  h5.close {
    display: block;
    text-decoration: underline;
  }
  h5.open {
    display: none;
    text-decoration: underline;
  }
  &[open] {
    h5.close {
      display: none;
    }
    h5.open {
      display: block;
    }
    .ic-expandable-button.ic-inner.ic-expandable-button--chevron::after {
      ${(props) =>
        props.isControl &&
        css`
          margin-top: -3px;
        `}
    }
  }
  .ic-expandable-button.ic-inner.ic-expandable-button--chevron::after {
    ${(props) =>
      props.isControl &&
      css`
        background-image: url("data:image/svg+xml,%3Csvg class='iu-svg-icon' xmlns='http://www.w3.org/2000/svg' width='18' height='10' viewBox='0 0 22 15'%3E%3Cpath fill='rgb(95,95,95)' d='M8.325 10.647L.585 3.259c-.78-.746-.78-1.954 0-2.7.782-.745 2.048-.745 2.83 0l9.153 8.738c.781.745.781 1.954 0 2.7l-9.154 8.737c-.78.746-2.047.746-2.828 0-.781-.745-.781-1.954 0-2.7l7.74-7.387z' transform='translate(-1290 -179) translate(410 141) rotate(90 432 470)'/%3E%3C/svg%3E") !important;
        position: static;
        margin-left: 5px;
        margin-top: 5px;
      `}
  }
`

interface Props {
  title?: string
  titleClose?: string
  titleId?: string
  header?: string
  description?: string
  additionalStyles?: string
  displayMandatory?: boolean
  isCategory?: boolean
  isControl?: boolean
  icon?: string
  includeIconTooltip?: boolean
  iconSize?: FontAwesomeIconProps['size']
  wrapperStyles?: FlattenSimpleInterpolation
}

const AccordionOld: React.FC<Props> = ({
  icon,
  title,
  titleClose,
  titleId,
  description,
  additionalStyles,
  displayMandatory,
  header,
  isCategory,
  isControl,
  includeIconTooltip,
  iconSize,
  children,
  wrapperStyles,
}) => {
  const hasHeader = header !== null && header !== '' && header !== undefined

  const getTitle = () => {
    if (isControl) {
      return <h5 className={`iu-fs-100 iu-fw-bold iu-lh-body close ${additionalStyles}`}>{title}</h5>
    } else if (hasHeader) {
      return <h4 className={`${isCategory ? 'iu-fs-400' : 'iu-fs-300'} ${additionalStyles}`}>{title}</h4>
    }
    return <h5 className={`iu-fs-200 iu-lh-body ${additionalStyles}`}>{title}</h5>
  }

  const getHeader = () => {
    return (
      <StyledSummary tabIndex={0} className={`ic-expandable-button ic-inner ic-expandable-button--chevron iu-fs-400`}>
        {!title && ' '}
        <Icon iconType={icon ? icon : ''} includeTooltip={!hasHeader && includeIconTooltip} size={iconSize} />
        {displayMandatory && <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={true} />}
        {title && getTitle()}
        {titleClose && <h5 className={`iu-fs-100 iu-fw-bold iu-lh-body open ${additionalStyles}`}>{titleClose}</h5>}
        {!title && children}
      </StyledSummary>
    )
  }

  return (
    <div id={titleId} css={wrapperStyles}>
      {hasHeader && !isControl && <h4 className={`iu-fs-300 iu-mb-200 ${additionalStyles}`}>{header}</h4>}
      <StyledDetails
        isControl={isControl}
        className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable ic-card--inspiration-large iu-bg-white">
        {getHeader()}
        {isControl && (
          <>
            <h5 className={`iu-fs-200 iu-lh-body`}>{header ?? ''}</h5>
            {children}
          </>
        )}
        {description && <Text className={`${!isCategory ? 'iu-mb-400' : ''}`} dangerouslySetInnerHTML={sanitizeText(description)}></Text>}
      </StyledDetails>
    </div>
  )
}

export default AccordionOld
