import { Accordion, AccordionHeader, CertificateDataConfig, ConfigTypes, Icon, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import * as React from 'react'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'

export interface Props {
  config: CertificateDataConfig
  displayMandatory: boolean
  questionParent: string
}

const QuestionHeaderAccordion: React.FC<Props> = ({ config, displayMandatory, questionParent }) => {
  const parent = useSelector(getQuestion(questionParent))
  const questionTypeIsCategory = parent && parent.config.type === ConfigTypes.CATEGORY

  return (
    <>
      {config.header && <h4 className={'iu-fs-300 iu-mb-200 iu-fw-heading'}>{config.header}</h4>}
      <Accordion>
        <AccordionHeader>
          {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
          {displayMandatory && <MandatoryIcon />}
          {config.header || !questionTypeIsCategory ? (
            <h5 className={'iu-fs-200 iu-lh-h4'}>{config.text}</h5>
          ) : (
            <h4 className={'iu-fs-300'}>{config.text}</h4>
          )}
        </AccordionHeader>
        <Text className={'iu-mb-300'} dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
      </Accordion>
    </>
  )
}

export default QuestionHeaderAccordion
