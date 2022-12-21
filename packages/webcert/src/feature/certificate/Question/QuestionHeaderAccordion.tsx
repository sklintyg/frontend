import { Accordion, AccordionHeader, CertificateDataConfig, Icon, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import * as React from 'react'
import { css } from 'styled-components'

export interface QuestionHeaderAccordionProps {
  config: CertificateDataConfig
  displayMandatory: boolean
}

const mandatoryIconAdditionalStyles = css`
  top: -5px;
`
const QuestionHeaderAccordion: React.FC<QuestionHeaderAccordionProps> = ({ config, displayMandatory }) => {
  return (
    <>
      {config.header && <h4 className={'iu-fs-300 iu-mb-200 iu-fw-heading'}>{config.header}</h4>}
      <Accordion>
        <AccordionHeader>
          {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
          {displayMandatory && <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={true} />}
          {config.header ? <h5 className={'iu-fs-200 iu-lh-h4'}>{config.text}</h5> : <h4 className={'iu-fs-300'}>{config.text}</h4>}
        </AccordionHeader>
        <Text className={'iu-mb-300'} dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
      </Accordion>
    </>
  )
}

export default QuestionHeaderAccordion
