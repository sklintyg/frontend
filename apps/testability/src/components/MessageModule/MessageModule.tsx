import {
  IDSColumn,
  IDSRow,
  IDSContainer,
  IDSDatePicker,
  IDSTime,
  IDSTextarea,
  IDSSelect,
  IDSRadioGroup,
  IDSRadio,
  IDSInput,
  IDSAlert,
  IDSDialog,
  IDSTooltip,
  IDSButton,
  IDSSelectMultiple,
  IDSCheckbox
} from '@inera/ids-react'
import { AmnesKodDto, PartKodDto, Amneskod, CertificateDto, MeddelandeReferensDto, MessageDto, SendMessageToCareDto } from '@src/api/dataFormat'
import { useEffect, useRef, useState } from 'react'
import { getCertificateFields, getMessages, sendMessageToCare, sendMessageToCareXml } from '@src/api/testabilityServiceApi'

type MessageModuleProps = {
  SelectedCertificate?: CertificateDto
  selectedCareUnitHsaId?: string
  onResetAll?: () => void
}

type TimestampMode = 'now' | 'custom'
type MessageIdMode = 'auto' | 'custom'
type FeedbackType = 'success' | 'error'

const boundedTextareaClassName = '[&_textarea]:max-h-80 [&_textarea]:resize-y [&_textarea]:overflow-y-auto'

type SubmissionFeedbackState = {
  type: FeedbackType
  message: string
}

const messageTypeToAmne: Record<string, AmnesKodDto> = {
  avstamning: { code: Amneskod.AVSTMN, displayName: 'Avstämning' },
  kontakt: { code: Amneskod.KONTACT, displayName: 'Kontakt' },
  ovrigt: { code: Amneskod.OVRIGT, displayName: 'Övrigt' },
  paminnelse: { code: Amneskod.PAMIN, displayName: 'Påminnelse' },
  komplettering: { code: Amneskod.KOMPLT, displayName: 'Komplettering' },
}

function toLocalDateTimeString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

function getSentTimestamp(timestampMode: TimestampMode, customDate: string, customTime: string) {
  if (timestampMode === 'now') {
    return toLocalDateTimeString(new Date())
  }

  const normalizedTime = customTime.length === 5 ? `${customTime}:00` : customTime
  return `${customDate}T${normalizedTime}`
}

function LockedValues({ SelectedCertificate }: MessageModuleProps) {
  return (
    <dl className="ids-description-list">
      <dt className="ids-description-list__term">Intygs-ID</dt>
      <dd className="ids-description-list__description">{SelectedCertificate?.certificateId ?? 'Inget intyg valt'}</dd>

      <dt className="ids-description-list__term">Typ av intyg</dt>
      <dd className="ids-description-list__description">
        {SelectedCertificate ? `${SelectedCertificate.certificateType} v${SelectedCertificate.certificateTypeVersion}` : '-'}
      </dd>

      <dt className="ids-description-list__term">Personnummer</dt>
      <dd className="ids-description-list__description">{SelectedCertificate?.personNumber ?? '-'}</dd>
    </dl>
  )
}

type DateTimeInputProps = {
  timestampMode: TimestampMode
  customDate: string
  customTime: string
  onTimestampModeChange: (mode: TimestampMode) => void
  onCustomDateChange: (date: string) => void
  onCustomTimeChange: (time: string) => void
}

function DateTimeInput({
  timestampMode,
  customDate,
  customTime,
  fieldsWithErrors,
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
}: DateTimeInputProps & { fieldsWithErrors?: Set<string> }) {
  const dateHasError = fieldsWithErrors?.has('customDate')
  const timeHasError = fieldsWithErrors?.has('customTime')

  return (
    <div className="flex flex-col gap-4">
      <IDSRadioGroup
        legend="Tidpunkt för skickat ärende (Obligatoriskt)"
        name="timestampMode"
        onRadioChange={(event) => onTimestampModeChange(event.target.value as TimestampMode)}
      >
        <IDSRadio id="timestamp-now" value="now" checked={timestampMode === 'now'}>
          Använd aktuell tid för när meddelandet skickas
        </IDSRadio>
        <IDSRadio id="timestamp-custom" value="custom" checked={timestampMode === 'custom'}>
          Sätt tid manuellt
        </IDSRadio>
      </IDSRadioGroup>

      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className={timestampMode === 'now'
            ? 'flex-1 min-w-0 [--IDS-FORM-LABEL__COLOR:var(--IDS-FORM-LABEL--DISABLED-COLOR)] [&_.ids-label]:italic [&_.ids-label]:cursor-default'
            : 'flex-1 min-w-0'}
        >
          <IDSDatePicker
            label="Datum"
            value={customDate}
            disabled={timestampMode === 'now'}
            onChange={(event) => onCustomDateChange(event.value)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <IDSTime
            label="Klockslag"
            value={customTime}
            disabled={timestampMode === 'now'}
            onChange={(event) => onCustomTimeChange(event.target.value)}
          />
        </div>
      </div>
      {(timeHasError || dateHasError) && (
            <div className="ids-error-message ids-error-message--show">
              <span className="ids-error-message__text">Datum och klockslag måste anges vid manuell tidsangivelse.</span>
            </div>
          )}
    </div>
  )
}

function Kontaktinformation({ value, fieldsWithErrors, onChange }: { value: string; fieldsWithErrors?: Set<string>; onChange: (value: string) => void }) {
  const hasError = fieldsWithErrors?.has('kontaktinformation')
  return (
    <IDSTextarea
      label="Kontaktinformation (Obligatoriskt)"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      invalid={hasError}
      errorMsg="Kontaktuppgifter måste anges"
      className={boundedTextareaClassName}
      block
      rows={4}
    />
  )
}

function MessageSelect({
  SelectedCertificate,
  selectedMessageType,
  selectedMessage,
  fieldsWithErrors,
  onSelectedMessageChange,
}: {
  SelectedCertificate?: CertificateDto
  selectedMessageType?: string
  selectedMessage: string
  fieldsWithErrors?: Set<string>
  onSelectedMessageChange: (value: string) => void
}) {
  const [messages, setMessages] = useState<MessageDto[]>([])

  useEffect(() => {
    const certificateId = SelectedCertificate?.certificateId

    if (!certificateId) {
      setMessages([])
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    getMessages(certificateId, signal)
      .then(setMessages)
      .catch((error: unknown) => {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to fetch messages:', error)
        }
      })

    return () => controller.abort()
  }, [SelectedCertificate?.certificateId])

  const hasError = fieldsWithErrors?.has('selectedMessage') && selectedMessageType === 'paminnelse'

  return (
    <IDSSelect
      label="Svar på - meddelande-id"
      value={selectedMessage}
      invalid={hasError}
      onChange={(e) => onSelectedMessageChange(e.target.value)}
      errorMsg="Du måste välja ett ärende att koppla påminnelsen till."
    >
      <option value="">Välj ärende</option>
      {messages.map((message) => (
        <option key={message.messageId} value={message.messageId}>
          {message.messageId} - {message.subject}
        </option>
      ))}
    </IDSSelect>
  )
}

function ReferenceSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <IDSInput
      label="Svar på - referens-id"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function MessageID({
  messageIdMode,
  value,
  fieldsWithErrors,
  onMessageIdModeChange,
  onChange,
}: {
  messageIdMode: MessageIdMode
  value: string
  fieldsWithErrors?: Set<string>
  onMessageIdModeChange: (mode: MessageIdMode) => void
  onChange: (value: string) => void
}) {
  const hasError = fieldsWithErrors?.has('messageId') && messageIdMode === 'custom'

  return (
    <div className="flex flex-col gap-4">
      <IDSRadioGroup
        legend="Meddelande-id"
        name="messageIdMode"
        onRadioChange={(event) => onMessageIdModeChange(event.target.value as MessageIdMode)}
      >
        <IDSRadio id="message-id-auto" value="auto" checked={messageIdMode === 'auto'}>
          Generera automatiskt
        </IDSRadio>
        <IDSRadio id="message-id-custom" value="custom" checked={messageIdMode === 'custom'}>
          Ange manuellt
        </IDSRadio>
      </IDSRadioGroup>

      <IDSInput
        label="Meddelande-id (Obligatoriskt vid manuell angivelse)"
        placeholder="Ange meddelande-id"
        value={value}
        disabled={messageIdMode === 'auto'}
        onChange={(event) => onChange(event.target.value)}
        invalid={hasError}
        errorMsg="Meddelande-id måste anges när du väljer manuell angivelse"
      />
    </div>
  )
}

function ReferenceID({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <IDSInput
      label="Referens-ID"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function Heading({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <IDSInput
      label="Rubrik"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function MessageText({ value, fieldsWithErrors, onChange }: { value: string; fieldsWithErrors?: Set<string>; onChange: (value: string) => void }) {
  const hasError = fieldsWithErrors?.has('messageText')

  return (
    <IDSTextarea
      label="Frågetext (Obligatoriskt)"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
      invalid={hasError}
      errorMsg="Ärendet måste innehålla en fråga"
      className={boundedTextareaClassName}
      block
      rows={4}
    />
  )
}

function DateToAnswer({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-row gap-4">
      <IDSDatePicker label="Sista datum för svar" value={value} onChange={(event) => onChange(event.value)} />
    </div>
  )
}

function MessageType({
  selectedMessageType,
  fieldsWithErrors,
  onSelectedMessageTypeChange,
}: {
  selectedMessageType: string
  fieldsWithErrors?: Set<string>
  onSelectedMessageTypeChange?: (value: string) => void
}) {
  const hasError = fieldsWithErrors?.has('messageType')

  return (
    <IDSRadioGroup
      legend="Ärendetyp (Obligatoriskt)"
      name="messageType"
      invalid={hasError}
      compact
      noValidation={!hasError}
      errorMsg="Du måste välja en ärendetyp"
      onRadioChange={(e) => {
        onSelectedMessageTypeChange?.(e.target.value)
      }}
    >
      <IDSRadio id="avstamning" value="avstamning" checked={selectedMessageType === 'avstamning'}>
        Avstämning
      </IDSRadio>

      <IDSRadio id="kontakt" value="kontakt" checked={selectedMessageType === 'kontakt'}>
        Kontakt
      </IDSRadio>

      <IDSRadio id="ovrigt" value="ovrigt" checked={selectedMessageType === 'ovrigt'}>
        Övrigt
      </IDSRadio>

      <IDSRadio id="paminnelse" value="paminnelse" checked={selectedMessageType === 'paminnelse'}>
        Påminnelse
      </IDSRadio>

      <IDSRadio id="komplettering" value="komplettering" checked={selectedMessageType === 'komplettering'}>
        Komplettering
      </IDSRadio>
    </IDSRadioGroup>
  )
}

function ConfirmationButtons({ onRequestReset }: { onRequestReset: () => void }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:justify-end">
      <button
        type="button"
        className="ids-button ids-button--m ids-button--secondary w-full lg:w-auto"
        aria-label="SECONDARY"
        tabIndex={0}
        onClick={onRequestReset}
      >
        Rensa fält
      </button>
      <button
        type="submit"
        className="ids-button ids-button--m ids-button--primary w-full lg:w-auto"
        aria-label="Default"
        tabIndex={0}
      >
        Skicka
      </button>
    </div>
  )
}

function About({
  SelectedCertificate,
  timestampMode,
  customDate,
  customTime,
  fieldsWithErrors,
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
}: MessageModuleProps & DateTimeInputProps & { fieldsWithErrors?: Set<string> }) {
  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <h3 className="ids-heading-s">Om intyget</h3>
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <LockedValues SelectedCertificate={SelectedCertificate} />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <h3 className="ids-heading-s">Tidpunkt</h3>
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <DateTimeInput
            timestampMode={timestampMode}
            customDate={customDate}
            customTime={customTime}
            fieldsWithErrors={fieldsWithErrors}
            onTimestampModeChange={onTimestampModeChange}
            onCustomDateChange={onCustomDateChange}
            onCustomTimeChange={onCustomTimeChange}
          />
        </IDSColumn>
      </IDSRow>
    </div>
  )
}

function Sender({
  kontaktinformation,
  fieldsWithErrors,
  onKontaktinformationChange,
}: {
  kontaktinformation: string
  fieldsWithErrors?: Set<string>
  onKontaktinformationChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <h3 className="ids-heading-s">Avsändare</h3>
        </IDSColumn>
      </IDSRow>
      <dl className="ids-description-list">
        <dt className="ids-description-list__term">
          <span className="inline-flex items-center gap-2">
            Avsändare
            <IDSTooltip
              maxWidth=""
              position="top"
              trigger={
                <span
                  aria-label="information"
                  className="ids-icon-information ids-icon--m ids-icon--color-preset-1 ids-icon--interactive"
                  role="tooltip"
                  tabIndex={0}
                />
              }
            >
              För tillfället finns endast ärendeverktyg för Försäkringskassan
            </IDSTooltip>
          </span>
        </dt>
        <dd className="ids-description-list__description">Försäkringskassan</dd>
      </dl>
      <IDSRow>
        <IDSColumn>
          <Kontaktinformation value={kontaktinformation} fieldsWithErrors={fieldsWithErrors} onChange={onKontaktinformationChange} />
        </IDSColumn>
      </IDSRow>
    </div>
  )
}

function Komplettering({
  SelectedCertificate,
  fieldsWithErrors,
  selectedQuestionIds,
  kompletteringTexts,
  onSelectedQuestionIdsChange,
  onKompletteringTextsChange,
}: {
  SelectedCertificate?: CertificateDto
  fieldsWithErrors?: Set<string>
  selectedQuestionIds: string[]
  kompletteringTexts: Record<string, string>
  onSelectedQuestionIdsChange: (ids: string[]) => void
  onKompletteringTextsChange: (texts: Record<string, string>) => void
}) {
  const [checkboxOptions, setCheckboxOptions] = useState<Array<{ id: string; label: string }>>([])

  useEffect(() => {
    const certificateType = SelectedCertificate?.certificateType
    const certificateVersion = SelectedCertificate?.certificateTypeVersion

    if (!certificateType || !certificateVersion) {
      setCheckboxOptions([])
      onSelectedQuestionIdsChange([])
      return
    }

    const currentCertificateType = certificateType
    const currentCertificateVersion = certificateVersion

    const controller = new AbortController()

    const mapFieldToOption = (field: unknown, index: number): { id: string; label: string } | null => {
      if (typeof field === 'number') {
        return {
          id: String(field),
          label: String(field),
        }
      }

      if (typeof field === 'string') {
        const value = field.trim()
        if (!value) {
          return null
        }

        return {
          id: value,
          label: value,
        }
      }

      if (typeof field !== 'object' || field === null) {
        return null
      }

      const record = field as Record<string, unknown>
      const idCandidate = record.frageId ?? record.id ?? record.key ?? record.fieldId ?? record.code
      const labelCandidate = record.displayName ?? record.name ?? record.label ?? record.text ?? record.description ?? idCandidate

      if (typeof idCandidate !== 'string' || idCandidate.trim() === '') {
        const fallbackId = `field-${index + 1}`
        const fallbackLabel = typeof labelCandidate === 'string' && labelCandidate.trim() !== '' ? labelCandidate : fallbackId

        return {
          id: fallbackId,
          label: fallbackLabel,
        }
      }

      return {
        id: idCandidate,
        label: typeof labelCandidate === 'string' && labelCandidate.trim() !== '' ? labelCandidate : idCandidate,
      }
    }

    async function loadFields() {
      try {
        const fields = (await getCertificateFields(currentCertificateType, currentCertificateVersion, controller.signal)) as unknown[]
        const mappedOptions = fields
          .map(mapFieldToOption)
          .filter((option): option is { id: string; label: string } => option !== null)

        const uniqueOptions = mappedOptions.filter((option, index, allOptions) => {
          return allOptions.findIndex((otherOption) => otherOption.id === option.id) === index
        })

        setCheckboxOptions(uniqueOptions)
        onSelectedQuestionIdsChange(selectedQuestionIds.filter((id) => uniqueOptions.some((option) => option.id === id)))
      } catch (error: unknown) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to fetch certificate fields:', error)
          setCheckboxOptions([])
          onSelectedQuestionIdsChange([])
        }
      }
    }

    loadFields()

    return () => {
      controller.abort()
    }
  }, [SelectedCertificate?.certificateType, SelectedCertificate?.certificateTypeVersion])

  const handleQuestionIdToggle = (questionId: string, isChecked: boolean) => {
    if (isChecked) {
      if (selectedQuestionIds.includes(questionId)) {
        return
      }
      onSelectedQuestionIdsChange([...selectedQuestionIds, questionId])
    } else {
      onSelectedQuestionIdsChange(selectedQuestionIds.filter((id) => id !== questionId))
    }
  }

  const handleKompletteringTextChange = (questionId: string, text: string) => {
    onKompletteringTextsChange({
      ...kompletteringTexts,
      [questionId]: text,
    })
  }

  const questionsHasError = fieldsWithErrors?.has('selectedQuestionIds')

  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <IDSSelectMultiple
            dataTestId=""
            invalid={questionsHasError}
            errorMsg=""
            label="Fråge-id (Obligatoriskt)"
            maxHeight="16.5rem"
            numbCheckedBoxes={selectedQuestionIds.length}
            placeholder="Välj fråge-id"
            selectedLabel="vald"
            selectedLabelPlural="valda"
          >
            {checkboxOptions.map((option) => (
              <IDSCheckbox
                key={option.id}
                checked={selectedQuestionIds.includes(option.id)}
                onChange={(event) => handleQuestionIdToggle(option.id, event.target.checked)}
              >
                {option.label}
              </IDSCheckbox>
            ))}
          </IDSSelectMultiple>
          {questionsHasError && (
            <div className="ids-error-message ids-error-message--show">
              <span className='ids-error-message__text'>
                Minst ett fråge-id måste väljas
              </span>
            </div>
          )}
        </IDSColumn>
      </IDSRow>

      {selectedQuestionIds.sort((a, b) => Number(a) - Number(b)).map((questionId) => {
        const textHasError = fieldsWithErrors?.has(`komplettering_${questionId}`)
        return (
          <IDSRow key={questionId} className='border rounded-md p-3'>
            <IDSColumn className="flex flex-col gap-2">
              <dl className="ids-description-list">
                <dt className="ids-description-list__term">Fråge-ID</dt>
                <dd className="ids-description-list__description">{questionId}</dd>
              </dl>
              <IDSTextarea
                label="Kontaktinformation (Obligatoriskt)"
                value={kompletteringTexts[questionId] ?? ''}
                onChange={(event) => handleKompletteringTextChange(questionId, event.target.value)}
                invalid={textHasError}
                errorMsg="Kompletteringstext måste anges"
                className={boundedTextareaClassName}
                block
                rows={4}
              />
            </IDSColumn>
          </IDSRow>
        )
      })}
    </div>
  )
}

function RightPanel({
  SelectedCertificate,
  selectedMessageType,
  selectedMessage,
  selectedReference,
  messageIdMode,
  messageId,
  referenceId,
  heading,
  messageText,
  dateToAnswer,
  fieldsWithErrors,
  selectedQuestionIds,
  kompletteringTexts,
  onSelectedMessageTypeChange,
  onSelectedMessageChange,
  onSelectedReferenceChange,
  onMessageIdModeChange,
  onMessageIdChange,
  onReferenceIdChange,
  onHeadingChange,
  onMessageTextChange,
  onDateToAnswerChange,
  onSelectedQuestionIdsChange,
  onKompletteringTextsChange,
}: MessageModuleProps & {
  selectedMessageType: string
  selectedMessage: string
  selectedReference: string
  messageIdMode: MessageIdMode
  messageId: string
  referenceId: string
  heading: string
  messageText: string
  dateToAnswer: string
  fieldsWithErrors?: Set<string>
  selectedQuestionIds: string[]
  kompletteringTexts: Record<string, string>
  onSelectedMessageTypeChange: (value: string) => void
  onSelectedMessageChange: (value: string) => void
  onSelectedReferenceChange: (value: string) => void
  onMessageIdModeChange: (mode: MessageIdMode) => void
  onMessageIdChange: (value: string) => void
  onReferenceIdChange: (value: string) => void
  onHeadingChange: (value: string) => void
  onMessageTextChange: (value: string) => void
  onDateToAnswerChange: (value: string) => void
  onSelectedQuestionIdsChange: (ids: string[]) => void
  onKompletteringTextsChange: (texts: Record<string, string>) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <h3 className="ids-heading-s">Fråga</h3>
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <MessageSelect
            SelectedCertificate={SelectedCertificate}
            selectedMessageType={selectedMessageType}
            selectedMessage={selectedMessage}
            fieldsWithErrors={fieldsWithErrors}
            onSelectedMessageChange={onSelectedMessageChange}
          />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <ReferenceSelect value={selectedReference} onChange={onSelectedReferenceChange} />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <MessageID
            messageIdMode={messageIdMode}
            value={messageId}
            fieldsWithErrors={fieldsWithErrors}
            onMessageIdModeChange={onMessageIdModeChange}
            onChange={onMessageIdChange}
          />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <MessageType
            selectedMessageType={selectedMessageType}
            fieldsWithErrors={fieldsWithErrors}
            onSelectedMessageTypeChange={onSelectedMessageTypeChange}
          />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <ReferenceID value={referenceId} onChange={onReferenceIdChange} />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <Heading value={heading} onChange={onHeadingChange} />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <MessageText value={messageText} fieldsWithErrors={fieldsWithErrors} onChange={onMessageTextChange} />
        </IDSColumn>
      </IDSRow>
      {selectedMessageType === 'komplettering' && (
        <IDSRow>
          <IDSColumn>
            <Komplettering
              SelectedCertificate={SelectedCertificate}
              fieldsWithErrors={fieldsWithErrors}
              selectedQuestionIds={selectedQuestionIds}
              kompletteringTexts={kompletteringTexts}
              onSelectedQuestionIdsChange={onSelectedQuestionIdsChange}
              onKompletteringTextsChange={onKompletteringTextsChange}
            />
          </IDSColumn>
        </IDSRow>
      )}
      <IDSRow>
        <IDSColumn>
          <DateToAnswer value={dateToAnswer} onChange={onDateToAnswerChange} />
        </IDSColumn>
      </IDSRow>
      
    </div>
  )
}

function LeftPanel({
  SelectedCertificate,
  timestampMode,
  customDate,
  customTime,
  kontaktinformation,
  fieldsWithErrors,
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
  onKontaktinformationChange,
}: MessageModuleProps & DateTimeInputProps & { kontaktinformation: string; fieldsWithErrors?: Set<string>; onKontaktinformationChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <About
            SelectedCertificate={SelectedCertificate}
            timestampMode={timestampMode}
            customDate={customDate}
            customTime={customTime}
            fieldsWithErrors={fieldsWithErrors}
            onTimestampModeChange={onTimestampModeChange}
            onCustomDateChange={onCustomDateChange}
            onCustomTimeChange={onCustomTimeChange}
          />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <Sender
            kontaktinformation={kontaktinformation}
            fieldsWithErrors={fieldsWithErrors}
            onKontaktinformationChange={onKontaktinformationChange}
          />
        </IDSColumn>
      </IDSRow>
    </div>
  )
}

function SubmissionFeedback({
  feedback,
  onDismiss,
}: {
  feedback: SubmissionFeedbackState | null
  onDismiss: () => void
}) {
  if (!feedback) {
    return null
  }

  return (
    <IDSAlert
      collapsableHeadline=""
      compact
      dismissible={feedback.type === 'success'}
      type={feedback.type}
      onClose={onDismiss}
    >
      <span>{feedback.message}</span>
    </IDSAlert>
  )
}

export function MessageModule({ SelectedCertificate, selectedCareUnitHsaId, onResetAll }: MessageModuleProps) {
  const [timestampMode, setTimestampMode] = useState<TimestampMode>('now')
  const [messageIdMode, setMessageIdMode] = useState<MessageIdMode>('auto')
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [kontaktinformation, setKontaktinformation] = useState('Vägen 11 Östersund 83132, 010-123 45 67, handlaggare@handlaggarefk.se')
  const [selectedMessageType, setSelectedMessageType] = useState('')
  const [selectedMessage, setSelectedMessage] = useState('')
  const [selectedReference, setSelectedReference] = useState('')
  const [messageId, setMessageId] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const [heading, setHeading] = useState('')
  const [messageText, setMessageText] = useState('')
  const [dateToAnswer, setDateToAnswer] = useState('')
  const [submissionFeedback, setSubmissionFeedback] = useState<SubmissionFeedbackState | null>(null)
  const [isDownloadingXml, setIsDownloadingXml] = useState(false)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
  const [kompletteringTexts, setKompletteringTexts] = useState<Record<string, string>>({})
  const [fieldsWithErrors, setFieldsWithErrors] = useState<Set<string>>(new Set())

  // Helper to clear validation state when user starts changing fields
  const withValidationClear = <T,>(fieldName: string, setter: (value: T) => void) => (value: T) => {
    setFieldsWithErrors(prev => {
      const next = new Set(prev)
      next.delete(fieldName)
      return next
    })
    setSubmissionFeedback(null)
    setter(value)
  }

  const handleTimestampModeChange = (mode: TimestampMode) => {
    setFieldsWithErrors(prev => {
      const next = new Set(prev)
      next.delete('customDate')
      next.delete('customTime')
      return next
    })
    setSubmissionFeedback(null)
    setTimestampMode(mode)

    if (mode === 'now') {
      setCustomDate('')
      setCustomTime('')
    }
  }

  const handleMessageIdModeChange = (mode: MessageIdMode) => {
    setFieldsWithErrors(prev => {
      const next = new Set(prev)
      next.delete('messageId')
      return next
    })
    setSubmissionFeedback(null)
    setMessageIdMode(mode)

    if (mode === 'auto') {
      setMessageId('')
    }
  }

  const isCustomMessageIdValid = messageIdMode === 'auto' || messageId.trim() !== ''
  const isTimestampValid = timestampMode === 'now' || (customDate !== '' && customTime !== '')
  const isCustomMessageSelectValid = selectedMessageType !== 'paminnelse' || selectedMessage !== ''
  const isKompletteringValid = selectedMessageType !== 'komplettering' || selectedQuestionIds.length > 0
  const isAmneSelected = selectedMessageType in messageTypeToAmne
  const isFormValid =
    !!SelectedCertificate &&
    isTimestampValid &&
    kontaktinformation.trim() !== '' &&
    isCustomMessageIdValid &&
    isCustomMessageSelectValid &&
    isKompletteringValid &&
    messageText.trim() !== '' &&
    isAmneSelected

  const buildPayload = (certificate: CertificateDto, sentTimestamp: string, amne: AmnesKodDto): SendMessageToCareDto => {
    const svarPa: MeddelandeReferensDto | undefined =
      selectedMessage || selectedReference
        ? {
            meddelandeId: selectedMessage,
            referensId: selectedReference,
          }
        : undefined

    const part: PartKodDto = {
      code: '',
      codeSystem: '',
      displayName: '',
    }

    return {
      meddelandeId: messageIdMode === 'auto' ? '' : messageId,
      skickatTidpunkt: sentTimestamp,
      intygsId: {
        root: '',
        extension: certificate.certificateId,
      },
      patientPersonId: {
        extension: certificate.personNumber,
      },
      logiskAdressMottagare: selectedCareUnitHsaId ?? '',
      amne,
      meddelande: messageText,
      skickatAv: {
        part: part,
        kontaktInfo: [kontaktinformation],
      },
      ...(referenceId ? { referensId: referenceId } : {}),
      ...(heading ? { rubrik: heading } : {}),
      ...(dateToAnswer ? { sistaDatumForSvar: dateToAnswer } : {}),
      ...(selectedMessageType === 'paminnelse' ? { paminnelseMeddelandeId: selectedMessage } : {}),
      ...(selectedMessageType === 'komplettering' ? {
        komplettering: selectedQuestionIds.map((questionId) => ({
          frageId: questionId,
          instans: 0,
          text: kompletteringTexts[questionId] ?? '',
        })),
      } : {}),
      ...(svarPa ? { svarPa } : {}),
    }
  }

  const handleDownloadXml = async () => {
    if (!SelectedCertificate || !isFormValid || isDownloadingXml) {
      return
    }

    const amne = messageTypeToAmne[selectedMessageType]

    if (!amne) {
      return
    }

    const sentTimestamp = getSentTimestamp(timestampMode, customDate, customTime)
    const payload = buildPayload(SelectedCertificate, sentTimestamp, amne)

    try {
      setIsDownloadingXml(true)
      const xmlBlob = await sendMessageToCareXml(payload)
      const downloadUrl = URL.createObjectURL(xmlBlob)
      const linkElement = document.createElement('a')
      linkElement.href = downloadUrl
      linkElement.download = `arende-${Date.now()}.xml`
      document.body.appendChild(linkElement)
      linkElement.click()
      linkElement.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error: unknown) {
      console.error('Failed to download XML:', error)
    } finally {
      setIsDownloadingXml(false)
    }
  }

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionFeedback(null)

    // Phase 1: Check for certificate first
    if (!SelectedCertificate) {
      setFieldsWithErrors(new Set())
      setSubmissionFeedback({
        type: 'error',
        message: 'För att kunna skicka ett ärende behöver du välja ett intyg som ärendet ska vara kopplat till.',
      })
      return
    }

    // Phase 2: Validate fields (only if certificate exists)
    const newFieldsWithErrors = new Set<string>()
    const sentTimestamp = getSentTimestamp(timestampMode, customDate, customTime)
    const amne = messageTypeToAmne[selectedMessageType]

    // Validate and collect errors for each field
    if (selectedMessageType === '') {
      newFieldsWithErrors.add('messageType')
    }

    if (kontaktinformation.trim() === '') {
      newFieldsWithErrors.add('kontaktinformation')
    }

    if (timestampMode === 'custom') {
      if (customDate === '') {
        newFieldsWithErrors.add('customDate')
      }
      if (customTime === '') {
        newFieldsWithErrors.add('customTime')
      }
    }

    if (selectedMessageType === 'paminnelse' && selectedMessage === '') {
      newFieldsWithErrors.add('selectedMessage')
    }

    if (messageIdMode === 'custom' && messageId.trim() === '') {
      newFieldsWithErrors.add('messageId')
    }

    if (messageText.trim() === '') {
      newFieldsWithErrors.add('messageText')
    }

    if (selectedMessageType === 'komplettering') {
      if (selectedQuestionIds.length === 0) {
        newFieldsWithErrors.add('selectedQuestionIds')
      }
      // Check each komplettering text
      for (const questionId of selectedQuestionIds) {
        if ((kompletteringTexts[questionId] ?? '').trim() === '') {
          newFieldsWithErrors.add(`komplettering_${questionId}`)
        }
      }
    }

    setFieldsWithErrors(newFieldsWithErrors)

    // If there are field errors, show feedback and return
    if (newFieldsWithErrors.size > 0) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Ärendet kunde inte skickas. Kontrollera att alla obligatoriska fält är korrekt ifyllda.',
      })
      return
    }

    // All validation passed, proceed to send
    const payload = buildPayload(SelectedCertificate, sentTimestamp, amne!)

    try {
      await sendMessageToCare(payload)
      setSubmissionFeedback({
        type: 'success',
        message: 'Ditt ärende har skickats!',
      })
      console.log('Message sent successfully with timestamp:', sentTimestamp)
      console.log('Message payload:', payload)
    } catch (error: unknown) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Ärendet kunde inte skickas just nu. Försök igen om en liten stund.',
      })
      console.error('Failed to send message:', error)
    }
  }

  const handleReset = () => {
    setIsResetDialogOpen(false)
    formRef.current?.reset()
    setFieldsWithErrors(new Set())
    setSubmissionFeedback(null)
    setKontaktinformation('Vägen 11 Östersund 83132, 010-123 45 67, handlaggare@handlaggarefk.se')
    setSelectedMessageType('')
    setSelectedMessage('')
    setSelectedReference('')
    setMessageIdMode('auto')
    setMessageId('')
    setReferenceId('')
    setHeading('')
    setMessageText('')
    setDateToAnswer('')
    setTimestampMode('now')
    setCustomDate('')
    setCustomTime('')
    setSelectedQuestionIds([])
    setKompletteringTexts({})
    onResetAll?.()
  }

  const handleRequestReset = () => {
    setIsResetDialogOpen(true)
  }

  // Auto-dismiss certificate alert when certificate is selected
  useEffect(() => {
    if (submissionFeedback?.type === 'error' && 
        submissionFeedback.message.includes('välja ett intyg') && 
        SelectedCertificate) {
      setSubmissionFeedback(null)
    }
  }, [SelectedCertificate, submissionFeedback])

  return (
    <IDSContainer gutterless className="flex flex-col gap-4">
      <form ref={formRef} onSubmit={handleSend}>
        <IDSRow className='mb-4 mt-4'>
          <IDSColumn>
            <h2 className="ids-heading-m">Ärendeformulär</h2>
          </IDSColumn>
          <IDSColumn 
            className='flex justify-end'>
            <IDSButton
              type="button"
              disabled={!isFormValid || isDownloadingXml}
              icon="download"
              onClick={handleDownloadXml}
              size="m"
              tertiary
            >
                Hämta XML
            </IDSButton>
          </IDSColumn>
        </IDSRow>
        {submissionFeedback && (
          <IDSRow className="mb-4">
            <IDSColumn>
              <SubmissionFeedback feedback={submissionFeedback} onDismiss={() => setSubmissionFeedback(null)} />
            </IDSColumn>
          </IDSRow>
        )}
        <IDSRow className="flex flex-col lg:flex-row gap-4">
          <IDSColumn className="flex-1">
            <LeftPanel
              SelectedCertificate={SelectedCertificate}
              timestampMode={timestampMode}
              customDate={customDate}
              customTime={customTime}
              kontaktinformation={kontaktinformation}
              fieldsWithErrors={fieldsWithErrors}
              onTimestampModeChange={handleTimestampModeChange}
              onCustomDateChange={withValidationClear('customDate', setCustomDate)}
              onCustomTimeChange={withValidationClear('customTime', setCustomTime)}
              onKontaktinformationChange={withValidationClear('kontaktinformation', setKontaktinformation)}
            />
          </IDSColumn>
          <IDSColumn className="flex-1">
            <RightPanel
              SelectedCertificate={SelectedCertificate}
              selectedMessageType={selectedMessageType}
              selectedMessage={selectedMessage}
              selectedReference={selectedReference}
              messageIdMode={messageIdMode}
              messageId={messageId}
              referenceId={referenceId}
              heading={heading}
              messageText={messageText}
              dateToAnswer={dateToAnswer}
              fieldsWithErrors={fieldsWithErrors}
              selectedQuestionIds={selectedQuestionIds}
              kompletteringTexts={kompletteringTexts}
              onSelectedMessageTypeChange={withValidationClear('messageType', setSelectedMessageType)}
              onSelectedMessageChange={withValidationClear('selectedMessage', setSelectedMessage)}
              onSelectedReferenceChange={withValidationClear('selectedReference', setSelectedReference)}
              onMessageIdModeChange={handleMessageIdModeChange}
              onMessageIdChange={withValidationClear('messageId', setMessageId)}
              onReferenceIdChange={withValidationClear('selectedReference', setReferenceId)}
              onHeadingChange={withValidationClear('heading', setHeading)}
              onMessageTextChange={withValidationClear('messageText', setMessageText)}
              onDateToAnswerChange={withValidationClear('dateToAnswer', setDateToAnswer)}
              onSelectedQuestionIdsChange={withValidationClear('selectedQuestionIds', setSelectedQuestionIds)}
              onKompletteringTextsChange={withValidationClear('komplettering', setKompletteringTexts)}
            />
          </IDSColumn>
        </IDSRow>
        <IDSRow className='mt-4'>
          <IDSColumn>
            <ConfirmationButtons onRequestReset={handleRequestReset} />
          </IDSColumn>
        </IDSRow>
      </form>
      <IDSDialog role="dialog" show={isResetDialogOpen} onVisibilityChange={setIsResetDialogOpen}>
        <div className="ids-content">
          <h3 className="ids-heading-s">Rensa alla fält?</h3>
          <p>Detta tar bort alla inmatningar i formuläret och avmarkerar valt intyg.</p>
          <div className="mt-4 flex justify-end gap-4">
            <button type="button" className="ids-button ids-button--m ids-button--secondary" onClick={() => setIsResetDialogOpen(false)}>
              Avbryt
            </button>
            <button type="button" className="ids-button ids-button--m ids-button--primary" onClick={handleReset}>
              Rensa
            </button>
          </div>
        </div>
      </IDSDialog>
    </IDSContainer>
  )
}