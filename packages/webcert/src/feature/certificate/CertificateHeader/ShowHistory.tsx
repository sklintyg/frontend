import React from 'react'
import { Link } from 'react-router-dom'
import {
  TextWithInfoModal,
  CertificateEvent,
  CertificateEventType,
  CertificateStatus,
  CertificateMetadata,
  isHasParent,
  isParentRevoked,
} from '@frontend/common'
import { Spinner } from '@frontend/common/src'

interface Props {
  historyEntries: CertificateEvent[]
  certificateMetadata: CertificateMetadata
}

const ShowHistory: React.FC<Props> = ({ historyEntries, certificateMetadata }) => {
  const isEmpty = historyEntries.length === 0

  function formatDate(date: string) {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${[year, month, day].join('-')} ${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(-2)}`
  }

  const getHistoryText = (event: CertificateEvent) => {
    switch (event.type) {
      case CertificateEventType.CREATED:
        return 'Utkastet är skapat'
      case CertificateEventType.SIGNED:
        return 'Intyget är signerat'
      case CertificateEventType.AVAILABLE_FOR_PATIENT:
        return 'Intyget är tillgängligt för patienten'
      case CertificateEventType.REPLACED:
        switch (event.relatedCertificateStatus) {
          case CertificateStatus.UNSIGNED:
            return (
              <>
                Det finns redan ett påbörjat utkast som ska ersätta detta intyg.{' '}
                <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
              </>
            )
          case CertificateStatus.SIGNED:
            return (
              <>
                Intyget har ersatts av <Link to={`/certificate/${event.relatedCertificateId}`}>detta intyg</Link>
              </>
            )
          case CertificateStatus.REVOKED:
            return (
              <>
                Intyget ersattes av ett intyg som nu är makulerat.{' '}
                <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
              </>
            )
          case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
            return (
              <>
                Intyget ersattes av ett utkast som nu är låst. <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
              </>
            )
        }
        break
      case CertificateEventType.REPLACES:
        return (
          <>
            Utkastet skapades för att ersätta ett tidigare intyg.{' '}
            <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateEventType.EXTENDED:
        return (
          <>
            Utkastet skapades för att förnya ett tidigare intyg.{' '}
            <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateEventType.RENEWAL_OF:
        if (certificateMetadata.status === 'UNSIGNED') {
          return (
            <>
              Utkastet är skapat för att förnya ett tidigare intyg.{' '}
              <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
            </>
          )
        }
        break
      case CertificateEventType.SENT:
        if (certificateMetadata.type === 'lisjp') {
          return 'Intyget är skickat till Försäkringskassan'
        } else {
          return 'Intyget är skickat till Arbetsförmedlingen'
        }
      case CertificateEventType.REVOKED:
        const hasParent = isHasParent(certificateMetadata)
        const parentRevoked = isParentRevoked(certificateMetadata)

        if (hasParent && !parentRevoked) {
          return (
            <>
              Intyget är makulerat. Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
              <Link to={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>Öppna intyget</Link>
            </>
          )
        } else {
          return 'Intyget är makulerat'
        }
      case CertificateEventType.INCOMING_MESSAGE:
        return 'Försäkringskassan har ställt en fråga'
      case CertificateEventType.OUTGOING_MESSAGE:
        return 'En fråga har skickats till Försäkringskassan'
      case CertificateEventType.INCOMING_ANSWER:
        return 'Försäkringskassan har svarat på en fråga'
      case CertificateEventType.REQUEST_FOR_COMPLEMENT:
        return 'Försäkringkassan har begärt komplettering'
      case CertificateEventType.INCOMING_MESSAGE_HANDLED:
        return 'En fråga från Försäkringskassan är markerad som hanterad'
      case CertificateEventType.OUTGOING_MESSAGE_HANDLED:
        return 'En fråga till Försäkringskassan är markerad som hanterad'
      case CertificateEventType.COMPLEMENTS:
        if (certificateMetadata.status === CertificateStatus.UNSIGNED) {
          return (
            <>
              Utkastet är skapat för att komplettera ett tidigare intyg.{' '}
              <Link to={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>Öppna intyget</Link>
            </>
          )
        } else if (certificateMetadata.status === CertificateStatus.REVOKED) {
          return (
            <>
              Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.
              <Link to={`/certificate/${certificateMetadata.relations.parent!.certificateId}`}>Öppna intyget</Link>
            </>
          )
        } else return ''
      case CertificateEventType.COMPLEMENTED:
        if (event.relatedCertificateStatus === CertificateStatus.SIGNED) {
          return (
            <>
              Intyget har kompletterats med ett annat intyg. <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
            </>
          )
        } else if (
          event.relatedCertificateStatus === CertificateStatus.REVOKED ||
          event.relatedCertificateStatus === CertificateStatus.LOCKED_REVOKED
        ) {
          return ''
        } else {
          return (
            <>
              Det finns redan en påbörjad komplettering. <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
            </>
          )
        }
      case CertificateEventType.LOCKED:
        return 'Utkastet låstes'
      case CertificateEventType.COPIED_FROM:
        return (
          <>
            Utkastet kopierades ifrån ett tidigare låst utkast.{' '}
            <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
          </>
        )
      case CertificateEventType.COPIED_BY:
        switch (event.relatedCertificateStatus) {
          case CertificateStatus.UNSIGNED:
            return (
              <>
                Det finns redan ett påbörjat utkast som ska ersätta detta låsta utkast.{' '}
                <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
              </>
            )
          case CertificateStatus.SIGNED:
            return (
              <>
                Utkastet har ersatts av <Link to={`/certificate/${event.relatedCertificateId}`}>detta intyg</Link>
              </>
            )
          case CertificateStatus.REVOKED:
            return (
              <>
                Utkastet ersattes av ett intyg som nu är makulerat.{' '}
                <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
              </>
            )
          case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
            return (
              <>
                Utkastet ersattes av ett utkast som nu är låst.{' '}
                <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
              </>
            )
        }
        break
    }
  }

  function getHistoryEntry(index: number, entry: CertificateEvent) {
    const text = getHistoryText(entry)
    if (!text) return
    return (
      <p key={index}>
        {formatDate(entry.timestamp)} {text}
      </p>
    )
  }

  return (
    <div className="iu-fs-100 iu-color-text">
      <TextWithInfoModal text="Visa alla händelser" modalTitle="Alla händelser">
        {isEmpty && <Spinner text={'Laddar händelser'} size={'small'}></Spinner>}
        {[...historyEntries].reverse().map((entry, i) => getHistoryEntry(i, entry))}
      </TextWithInfoModal>
    </div>
  )
}

export default ShowHistory
