import InfoBox from '../../../components/utils/InfoBox'
import { Text } from '../../../components/utils/Text'
import type { ConfigMessage} from '../../../types';
import { MessageLevel } from '../../../types'

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
    <div className="iu-mb-200">
      <InfoBox type={messageLevelToInfoBoxLevel(message.level)}>
        <Text>{message.content}</Text>
      </InfoBox>
    </div>
  )
}
