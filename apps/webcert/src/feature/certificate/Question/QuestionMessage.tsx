import InfoBox from '../../../components/utils/InfoBox'
import type { ConfigMessage } from '../../../types'
import { MessageLevel } from '../../../types'
import TextWithDynamicLinks from '../../../utils/TextWithDynamicLinks'

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
        <TextWithDynamicLinks text={message.content} />
      </InfoBox>
    </div>
  )
}
