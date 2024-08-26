import type { ResourceLink} from '../../../types';
import { CannotComplementOption, ResourceLinkType } from '../../../types'
import TextArea from '../../Inputs/TextArea'
import MandatoryIcon from '../../utils/MandatoryIcon'

export function CannotComplementTextarea({
  option,
  message,
  link,
  onChange,
}: {
  option: string
  message: string
  link: ResourceLink
  onChange: (val: string) => void
}) {
  return (
    <div className="iu-ml-700 iu-my-300">
      {option === CannotComplementOption.NO_FURTHER_MED_INFO && (
        <>
          {message.length < 1 && <MandatoryIcon />}
          {link.type === ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE && (
            <p className="iu-fs-200 iu-mb-300">
              Kommentera varför det inte är möjligt att ange ytterligare medicinsk information. När du skickar svaret skapas en kopia av
              intyget med din kommentar i fältet "Övriga upplysningar". Intyget måste därefter signeras och skickas till Försäkringskassan.
            </p>
          )}
          {link.type === ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE && (
            <p className="iu-fs-200 iu-my-300">
              Om ingen ytterligare medicinsk information kan anges, så ska du delge Försäkringskassan det genom att svara med ett
              meddelande.
            </p>
          )}
        </>
      )}
      {option === CannotComplementOption.NO_RESP_MEDICAL_CONTENT && (
        <>
          {message.length < 1 && <MandatoryIcon />}
          <p className="iu-fs-200 iu-my-300">
            Om intygsutfärdaren inte längre finns tillgänglig och ingen annan på vårdenheten kan ta det medicinska ansvaret för intyget, så
            ska du delge Försäkringskassan det genom att svara med ett meddelande.
          </p>
        </>
      )}
      {option && (
        <TextArea
          data-testid="question-answer-textarea"
          rows={3}
          value={message}
          maxLength={500}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  )
}
