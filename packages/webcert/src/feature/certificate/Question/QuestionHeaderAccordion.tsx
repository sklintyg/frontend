import { Accordion, AccordionHeader, CertificateDataConfig, ConfigTypes, Icon, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import * as React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
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

const QuestionHeaderAccordion: React.FC<Props> = ({ config, displayMandatory, questionId }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(questionId))
  const parent = useSelector(getQuestion(questionId))
  const questionTypeIsCategory = parent && parent.config.type === ConfigTypes.CATEGORY

  return (
    <>
      {config.header && <h4 className="iu-fs-300 iu-mb-200 iu-fw-heading">{config.header}</h4>}
      <Accordion>
        <AccordionHeader>
          <HeaderErrorHighlight error={validationErrors.length > 0}>
            {displayMandatory && <MandatoryIcon />}
            <Wrapper>
              {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
              {config.header || !questionTypeIsCategory ? (
                <h5 className="iu-fs-200 iu-lh-h4">{config.text}</h5>
              ) : (
                <h4 className="iu-fs-300">{config.text}</h4>
              )}
            </Wrapper>
          </HeaderErrorHighlight>
        </AccordionHeader>
        <Text className="iu-mb-300" dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
      </Accordion>
    </>
  )
}

export default QuestionHeaderAccordion
