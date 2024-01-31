import InfoBox from '../../../../components/utils/InfoBox'
import { Text } from '../../../../components/utils/Text'
import { CertificateDataElement, ConfigUeMessage, MessageLevel } from '../../../../types'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const messageLevelToInfoBoxLevel = (level: MessageLevel): 'info' | 'error' | 'observe' => {
  switch (level) {
    case MessageLevel.ERROR:
      return 'error'
    case MessageLevel.OBSERVE:
      return 'observe'
    default:
      return 'info'
  }
}

const UeMessage: React.FC<Props> = ({ question }) => {
  const questionConfig = question.config as ConfigUeMessage
  return (
    <InfoBox type={messageLevelToInfoBoxLevel(questionConfig.level)}>
      <Text>{questionConfig.message}</Text>
    </InfoBox>
  )
}

export default UeMessage
