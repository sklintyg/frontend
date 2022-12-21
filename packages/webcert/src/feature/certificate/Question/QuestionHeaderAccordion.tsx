import { Accordion, AccordionHeader, CertificateDataConfig, Icon, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import * as React from 'react'

export interface Props {
  config: CertificateDataConfig
  displayMandatory: boolean
}

const QuestionHeaderAccordion: React.FC<Props> = ({ config, displayMandatory }) => {
  return (
    <>
      {config.header && <h4 className={'iu-fs-300 iu-mb-200 iu-fw-heading'}>{config.header}</h4>}
      <Accordion>
        <AccordionHeader>
          {config.icon && <Icon iconType={config.icon} includeTooltip={true} />}
          {displayMandatory && <MandatoryIcon />}
          <h4 className={'iu-fs-300'}>{config.text}</h4>
        </AccordionHeader>
        <Text dangerouslySetInnerHTML={sanitizeText(config.description)}></Text>
      </Accordion>
    </>
  )
}

export default QuestionHeaderAccordion
