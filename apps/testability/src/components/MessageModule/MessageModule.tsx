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
} from '@inera/ids-react'
import { AmnesKodDto, PartKodDto, Amneskod, CertificateDto, MeddelandeReferensDto, MessageDto, SendMessageToCareDto } from '@src/api/dataFormat'
import { useEffect, useRef, useState } from 'react'
import { getMessages, sendMessageToCare, sendMessageToCareXml } from '@src/api/testabilityServiceApi'

type MessageModuleProps = {
  SelectedCertificate?: CertificateDto
  selectedCareUnitHsaId?: string
  onResetAll?: () => void
}

type TimestampMode = 'now' | 'custom'
type MessageIdMode = 'auto' | 'custom'
type FeedbackType = 'success' | 'error'

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
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
}: DateTimeInputProps) {
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
        <div className="flex-1 min-w-0">
          <IDSDatePicker
            label="Datum"
            value={customDate}
            disabled={timestampMode === 'now'}
            onChange={(event) => onCustomDateChange(event.value)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <IDSTime
            label="Tid"
            value={customTime}
            disabled={timestampMode === 'now'}
            onChange={(event) => onCustomTimeChange(event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function Kontaktinformation({ value, showValidation, onChange }: { value: string; showValidation: boolean; onChange: (value: string) => void }) {
  return (
    <IDSTextarea
      label="Kontaktinformation (Obligatoriskt)"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      invalid={showValidation && value.trim() === ''}
      errorMsg="Kontaktuppgifter måste anges"
      block
      rows={4}
    />
  )
}

function MessageSelect({
  SelectedCertificate,
  selectedMessageType,
  selectedMessage,
  showCustomValidation,
  onSelectedMessageChange,
}: {
  SelectedCertificate?: CertificateDto
  selectedMessageType?: string
  selectedMessage: string
  showCustomValidation: boolean
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

  return (
    <IDSSelect
      label="Svar på - meddelande-id"
      value={selectedMessage}
      invalid={showCustomValidation && selectedMessage === '' && selectedMessageType === 'paminnelse'}
      onChange={(e) => onSelectedMessageChange(e.target.value)}
      errorMsg="Du måste välja ett ärende att koppla påminnelsen till."
    >
      <option value="">Inget ärende kopplat</option>
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
    <IDSSelect label="Svar på - referens-id" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Ingen referens vald</option>
      <option value="1">Alternativ 1</option>
      <option value="2">Alternativ 2</option>
    </IDSSelect>
  )
}

function MessageID({
  messageIdMode,
  value,
  showValidation,
  onMessageIdModeChange,
  onChange,
}: {
  messageIdMode: MessageIdMode
  value: string
  showValidation: boolean
  onMessageIdModeChange: (mode: MessageIdMode) => void
  onChange: (value: string) => void
}) {
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
        invalid={showValidation && messageIdMode === 'custom' && value.trim() === ''}
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

function Heading({ value, showValidation, onChange }: { value: string; showValidation: boolean; onChange: (value: string) => void }) {
  return (
    <IDSInput
      label="Rubrik"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
      invalid={showValidation && value.trim() === ''}
      errorMsg="Rubrik måste anges"
    />
  )
}

function MessageText({ value, showValidation, onChange }: { value: string; showValidation: boolean; onChange: (value: string) => void }) {
  return (
    <IDSTextarea
      label="Frågetext (Obligatoriskt)"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
      invalid={showValidation && value.trim() === ''}
      errorMsg="Ärendet måste innehålla en fråga"
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

function RadioButtons({
  selectedMessageType,
  showValidation,
  onSelectedMessageTypeChange,
}: {
  selectedMessageType: string
  showValidation: boolean
  onSelectedMessageTypeChange?: (value: string) => void
}) {
  return (
    <IDSRadioGroup
      legend="Ärendetyp (Obligatoriskt)"
      name="messageType"
      invalid={showValidation && selectedMessageType === ''}
      compact
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

function ConfirmationButtons({ onRequestReset, isSendDisabled }: { onRequestReset: () => void; isSendDisabled: boolean }) {
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
        disabled={isSendDisabled}
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
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
}: MessageModuleProps & DateTimeInputProps) {
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
  showValidation,
  onKontaktinformationChange,
}: {
  kontaktinformation: string
  showValidation: boolean
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
          <Kontaktinformation value={kontaktinformation} showValidation={showValidation} onChange={onKontaktinformationChange} />
        </IDSColumn>
      </IDSRow>
    </div>
  )
}

function Question({
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
  showCustomValidation,
  onSelectedMessageTypeChange,
  onSelectedMessageChange,
  onSelectedReferenceChange,
  onMessageIdModeChange,
  onMessageIdChange,
  onReferenceIdChange,
  onHeadingChange,
  onMessageTextChange,
  onDateToAnswerChange,
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
  showCustomValidation: boolean
  onSelectedMessageTypeChange: (value: string) => void
  onSelectedMessageChange: (value: string) => void
  onSelectedReferenceChange: (value: string) => void
  onMessageIdModeChange: (mode: MessageIdMode) => void
  onMessageIdChange: (value: string) => void
  onReferenceIdChange: (value: string) => void
  onHeadingChange: (value: string) => void
  onMessageTextChange: (value: string) => void
  onDateToAnswerChange: (value: string) => void
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
            showCustomValidation={showCustomValidation}
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
            showValidation={showCustomValidation}
            onMessageIdModeChange={onMessageIdModeChange}
            onChange={onMessageIdChange}
          />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <RadioButtons
            selectedMessageType={selectedMessageType}
            showValidation={showCustomValidation}
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
          <Heading value={heading} showValidation={showCustomValidation} onChange={onHeadingChange} />
        </IDSColumn>
      </IDSRow>
      <IDSRow>
        <IDSColumn>
          <MessageText value={messageText} showValidation={showCustomValidation} onChange={onMessageTextChange} />
        </IDSColumn>
      </IDSRow>
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
  showCustomValidation,
  onTimestampModeChange,
  onCustomDateChange,
  onCustomTimeChange,
  onKontaktinformationChange,
}: MessageModuleProps & DateTimeInputProps & { kontaktinformation: string; showCustomValidation: boolean; onKontaktinformationChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <IDSRow>
        <IDSColumn>
          <About
            SelectedCertificate={SelectedCertificate}
            timestampMode={timestampMode}
            customDate={customDate}
            customTime={customTime}
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
            showValidation={showCustomValidation}
            onKontaktinformationChange={onKontaktinformationChange}
          />
        </IDSColumn>
      </IDSRow>
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
  showCustomValidation,
  onSelectedMessageTypeChange,
  onSelectedMessageChange,
  onSelectedReferenceChange,
  onMessageIdModeChange,
  onMessageIdChange,
  onReferenceIdChange,
  onHeadingChange,
  onMessageTextChange,
  onDateToAnswerChange,
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
  showCustomValidation: boolean
  onSelectedMessageTypeChange: (value: string) => void
  onSelectedMessageChange: (value: string) => void
  onSelectedReferenceChange: (value: string) => void
  onMessageIdModeChange: (mode: MessageIdMode) => void
  onMessageIdChange: (value: string) => void
  onReferenceIdChange: (value: string) => void
  onHeadingChange: (value: string) => void
  onMessageTextChange: (value: string) => void
  onDateToAnswerChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <Question
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
        showCustomValidation={showCustomValidation}
        onSelectedMessageTypeChange={onSelectedMessageTypeChange}
        onSelectedMessageChange={onSelectedMessageChange}
        onSelectedReferenceChange={onSelectedReferenceChange}
        onMessageIdModeChange={onMessageIdModeChange}
        onMessageIdChange={onMessageIdChange}
        onReferenceIdChange={onReferenceIdChange}
        onHeadingChange={onHeadingChange}
        onMessageTextChange={onMessageTextChange}
        onDateToAnswerChange={onDateToAnswerChange}
      />
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
      dismissible
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
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false)
  const [submissionFeedback, setSubmissionFeedback] = useState<SubmissionFeedbackState | null>(null)
  const [isDownloadingXml, setIsDownloadingXml] = useState(false)

  const handleTimestampModeChange = (mode: TimestampMode) => {
    setTimestampMode(mode)

    if (mode === 'now') {
      setCustomDate('')
      setCustomTime('')
    }
  }

  const handleMessageIdModeChange = (mode: MessageIdMode) => {
    setMessageIdMode(mode)

    if (mode === 'auto') {
      setMessageId('')
    }
  }

  const isSendDisabled = timestampMode === 'custom' && (!customDate || !customTime)
  const isCustomMessageIdValid = messageIdMode === 'auto' || messageId.trim() !== ''
  const isTimestampValid = timestampMode === 'now' || (customDate !== '' && customTime !== '')
  const isCustomMessageSelectValid = selectedMessageType !== 'paminnelse' || selectedMessage !== ''
  const isAmneSelected = selectedMessageType in messageTypeToAmne
  const isFormValid =
    !!SelectedCertificate &&
    isTimestampValid &&
    kontaktinformation.trim() !== '' &&
    isCustomMessageIdValid &&
    isCustomMessageSelectValid &&
    heading.trim() !== '' &&
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
      komplettering: [],
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
    setHasTriedSubmit(true)
    setSubmissionFeedback(null)

    const sentTimestamp = getSentTimestamp(timestampMode, customDate, customTime)
    const amne = messageTypeToAmne[selectedMessageType]

    if (!SelectedCertificate) {
      setSubmissionFeedback({
        type: 'error',
        message: 'För att kunna skicka ett ärende behöver du välja ett intyg som ärendet ska vara kopplat till.',
      })
      return
    }

    if (!isCustomMessageSelectValid || !isCustomMessageIdValid || !amne) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Formuläret kunde inte skickas. Kontrollera att alla obligatoriska fält är korrekt ifyllda.',
      })
      return
    }

    const payload = buildPayload(SelectedCertificate, sentTimestamp, amne)

    try {
      await sendMessageToCare(payload)
      setSubmissionFeedback({
        type: 'success',
        message: 'Ditt ärende har skapats!',
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
    setHasTriedSubmit(false)
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
    onResetAll?.()
  }

  const handleRequestReset = () => {
    setIsResetDialogOpen(true)
  }

  return (
    <IDSContainer className="flex flex-col gap-4">
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
              showCustomValidation={hasTriedSubmit}
              onTimestampModeChange={handleTimestampModeChange}
              onCustomDateChange={setCustomDate}
              onCustomTimeChange={setCustomTime}
              onKontaktinformationChange={setKontaktinformation}
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
              showCustomValidation={hasTriedSubmit}
              onSelectedMessageTypeChange={setSelectedMessageType}
              onSelectedMessageChange={setSelectedMessage}
              onSelectedReferenceChange={setSelectedReference}
              onMessageIdModeChange={handleMessageIdModeChange}
              onMessageIdChange={setMessageId}
              onReferenceIdChange={setReferenceId}
              onHeadingChange={setHeading}
              onMessageTextChange={setMessageText}
              onDateToAnswerChange={setDateToAnswer}
            />
          </IDSColumn>
        </IDSRow>
        <IDSRow className='mt-4'>
          <IDSColumn>
            <ConfirmationButtons onRequestReset={handleRequestReset} isSendDisabled={isSendDisabled} />
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