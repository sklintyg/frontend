import { Accordion, AccordionHeader, CertificateDataConfig, ConfigTypes, Icon, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getQuestion, getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'

export interface Props {
  config: CertificateDataConfig
  displayMandatory: boolean
  questionId: string
}
const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`
const HeaderErrorHighlight = styled.span<{ error?: boolean }>`
  border-bottom-width: 0.0625rem;
  border-bottom-style: solid;
  border-bottom-color: ${({ error }) => (error ? '#c12143' : 'transparent')};
`

interface AccordionProps {
  h5Text: boolean
}
const AccordionControl = styled(Accordion)<AccordionProps>`
  ${AccordionHeader}.ic-expandable-button {
    line-height: 0;
  }

  ${AccordionHeader}.ic-expandable-button .iu-color-error {
    font-weight: ${(props) => (props.h5Text ? '400' : 'inherit')};
  }
`
const QuestionHeaderAccordion: React.FC<Props> = ({ config, displayMandatory, questionId }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(questionId))
  const parent = useSelector(getQuestion(questionId))
  const questionTypeIsCategory = parent && parent.config.type === ConfigTypes.CATEGORY
  const h5text: boolean = !!config.header || !questionTypeIsCategory
  return (
    <>
      {config.header && <h4 className="iu-fs-300 iu-mb-200 iu-fw-heading">{config.header}</h4>}
      <AccordionControl h5Text={h5text}>
        <AccordionHeader>
          <HeaderErrorHighlight error={validationErrors.length > 0}>
            {displayMandatory && <MandatoryIcon />}
            <Wrapper>
              {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
              {h5text ? <h5 className="iu-fs-200 iu-lh-h4">{config.text}</h5> : <h4 className="iu-fs-300">{config.text}</h4>}
            </Wrapper>
          </HeaderErrorHighlight>
        </AccordionHeader>
        <Text className="iu-mb-300" dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
      </AccordionControl>
    </>
  )
}

export default QuestionHeaderAccordion
