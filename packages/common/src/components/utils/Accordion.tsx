import React from 'react'
import styled from 'styled-components'
import { MandatoryIcon } from '@frontend/common'
import Icon from '../image/Icon'

const Text = styled.p`
  max-height: 188px;
  overflow-y: auto;

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
`

const StyledDetails = styled.details`
  padding: 0 !important;
  overflow: visible;
`

interface Props {
  title: string
  titleId: string
  header?: string
  description: string
  additionalStyles?: string
  displayMandatory?: boolean
  isCategory?: boolean
  icon?: string
  includeIconTooltip?: boolean
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
}) => {
  const hasHeader = header !== null && header !== '' && header !== undefined

  const getHeader = () => {
    if (!hasHeader) {
      return (
        <StyledSummary className="ic-expandable-button ic-inner ic-expandable-button--chevron iu-fs-400">
          <Icon iconType={icon ? icon : ''} includeTooltip={includeIconTooltip} />
          <MandatoryIcon display={displayMandatory as boolean} />{' '}
          <h4 className={`${isCategory ? 'iu-fs-400' : 'iu-fs-300'} ${additionalStyles}`}>{title}</h4>
        </StyledSummary>
      )
    } else {
      return (
        <StyledSummary className="ic-expandable-button ic-inner ic-expandable-button--chevron iu-fs-400">
          <Icon iconType={icon ? icon : ''} />
          <MandatoryIcon display={displayMandatory as boolean} /> <h5 className={`iu-fs-200 ${additionalStyles}`}>{title}</h5>
        </StyledSummary>
      )
    }
  }

  return (
    <div id={titleId}>
      {hasHeader && <h4 className={`iu-fs-300 ${additionalStyles}`}>{header}</h4>}
      <StyledDetails className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable ic-card--inspiration-large iu-bg-white">
        {getHeader()}
        <Text className={`${!isCategory ? 'iu-mb-400' : ''}`} dangerouslySetInnerHTML={{ __html: description }}></Text>
      </StyledDetails>
    </div>
  )
}

export default Accordion
