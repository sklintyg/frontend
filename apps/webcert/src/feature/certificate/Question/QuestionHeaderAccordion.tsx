import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Icon from '../../../components/image/image/Icon'
import Accordion from '../../../components/utils/Accordion'
import AccordionHeader from '../../../components/utils/AccordionHeader'
import MandatoryIcon from '../../../components/utils/MandatoryIcon'
import { Text } from '../../../components/utils/Text'
import { getQuestion, getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import type { CertificateDataConfig} from '../../../types';
import { ConfigTypes } from '../../../types'
import { sanitizeText } from '../../../utils'

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
`
const QuestionHeaderAccordion: React.FC<Props> = ({ config, displayMandatory, questionId }) => {
  const validationErrors = useSelector(getVisibleValidationErrors(questionId))
  const parent = useSelector(getQuestion(questionId))
  const questionTypeIsCategory = parent && parent.config.type === ConfigTypes.CATEGORY
  const h5text = Boolean(config.header) || !questionTypeIsCategory
  const heading = h5text ? (
    <h5 className="iu-fs-200 iu-mb-200 iu-lh-h4">{config.text}</h5>
  ) : (
    <h4 className="iu-fs-300 iu-mb-200">{config.text}</h4>
  )

  return (
    <>
      {config.header && <h4 className="iu-fs-300 iu-mb-200 iu-fw-heading">{config.header}</h4>}
      {config.description ? (
        <AccordionControl h5Text={h5text}>
          <AccordionHeader>
            <HeaderErrorHighlight error={validationErrors.length > 0}>
              {displayMandatory && <MandatoryIcon />}
              <Wrapper>
                {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
                {heading}
              </Wrapper>
            </HeaderErrorHighlight>
          </AccordionHeader>
          <Text className="iu-mb-300" dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
        </AccordionControl>
      ) : (
        <div>
          {displayMandatory && <MandatoryIcon />}
          {heading}
        </div>
      )}
    </>
  )
}

export default QuestionHeaderAccordion
