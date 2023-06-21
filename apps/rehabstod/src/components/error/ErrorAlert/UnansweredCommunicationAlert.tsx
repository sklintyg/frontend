import { ErrorAlert } from './ErrorAlert'

export function UnansweredCommunicationAlert() {
  return (
    <ErrorAlert
      heading=""
      errorType="attention"
      text="Information om ärendekommunikation kan inte hämtas på grund av ett tekniskt fel. Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand"
      dynamicLink
    />
  )
}
