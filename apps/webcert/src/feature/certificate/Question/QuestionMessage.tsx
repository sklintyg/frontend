import InfoBox from '../../../components/utils/InfoBox'
import { Text } from '../../../components/utils/Text'
import { ConfigMessage, MessageLevel } from '../../../types'

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

export function QuestionMessage({ message }: { message: ConfigMessage }) {
  return (
    <InfoBox type={messageLevelToInfoBoxLevel(message.level)}>
      <Text>{message.content}</Text>
    </InfoBox>
  )
}
