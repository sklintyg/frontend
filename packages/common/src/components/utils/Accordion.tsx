import React from 'react'
import styled, { css } from 'styled-components'
import { MandatoryIcon } from '@frontend/common'
import Icon from '../image/Icon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

const mandatoryIconAdditionalStyles = css`
  top: -4px;
`
const Text = styled.p`
  max-height: 195px;
  overflow-y: auto;
  white-space: pre-wrap;

  ul {
    list-style: unset;
    padding-left: 40px;
    margin-bottom: 10px;
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

const StyledDetails = styled.details`
  padding: 0 !important;
  overflow: visible;
`

interface Props {
  title?: string
  titleId: string
  header?: string
  description: string
  additionalStyles?: string
  displayMandatory?: boolean
  isCategory?: boolean
  icon?: string
  includeIconTooltip?: boolean
  iconSize?: FontAwesomeIconProps['size']
  wrapperStyles: FlattenSimpleInterpolation
}

const Accordion: React.FC<Props> = ({
  icon,
  title,
  titleId,
  description,
  additionalStyles,
  displayMandatory,
  header,
  isCategory,
  includeIconTooltip,
  iconSize,
  children,
  wrapperStyles,
}) => {
  const hasHeader = header !== null && header !== '' && header !== undefined

  const getHeader = () => {
    if (!hasHeader) {
      return (
        <StyledSummary tabIndex={0} className="ic-expandable-button ic-inner ic-expandable-button--chevron iu-fs-400">
          <Icon iconType={icon ? icon : ''} includeTooltip={includeIconTooltip} size={iconSize} />
          <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={displayMandatory as boolean} />
          <h4 className={`${isCategory ? 'iu-fs-400' : 'iu-fs-300'} ${additionalStyles}`}>{title}</h4>
        </StyledSummary>
      )
    } else {
      return (
        <StyledSummary tabIndex={0} className="ic-expandable-button ic-inner ic-expandable-button--chevron iu-fs-400">
          <Icon iconType={icon ? icon : ''} size={iconSize} />
          <MandatoryIcon display={displayMandatory as boolean} additionalStyles={mandatoryIconAdditionalStyles} />{' '}
          <h5 className={`iu-fs-200 iu-lh-body ${additionalStyles}`}>{title}</h5>
        </StyledSummary>
      )
    }
  }

  return (
    <div id={titleId} css={wrapperStyles}>
      {hasHeader && <h4 className={`iu-fs-300 iu-mb-200 ${additionalStyles}`}>{header}</h4>}
      <StyledDetails className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable ic-card--inspiration-large iu-bg-white">
        {title ? (
          getHeader()
        ) : (
          <StyledSummary tabIndex={0} className="ic-expandable-button ic-inner ic-expandable-button--chevron">
            {' '}
            <Icon iconType={icon ? icon : ''} includeTooltip={includeIconTooltip} size={iconSize} />
            {children}
          </StyledSummary>
        )}
        <Text className={`${!isCategory ? 'iu-mb-400' : ''}`} dangerouslySetInnerHTML={{ __html: description }}></Text>
      </StyledDetails>
    </div>
  )
}

export default Accordion
