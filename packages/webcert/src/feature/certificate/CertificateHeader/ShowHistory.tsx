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

interface Props {
  historyEntries: CertificateEvent[]
  certificateMetadata: CertificateMetadata
}

const ShowHistory: React.FC<Props> = ({ historyEntries, certificateMetadata }) => {
  function formatDate(date: string) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

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
      case CertificateEventType.RENEWAL_OF:
        return (
          <>
            Utkastet är skapat för att förnya ett tidigare intyg.{' '}
            <Link to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateEventType.SENT:
        return 'Intyget är skickat till Arbetsförmedlingen'
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

  return (
    <div className="iu-fs-100 iu-color-text">
      <TextWithInfoModal text="Visa alla händelser" modalTitle="Alla händelser">
        {[...historyEntries].reverse().map((entry, i) => (
          <p key={i}>
            {formatDate(entry.timestamp)} {getHistoryText(entry)}
          </p>
        ))}
      </TextWithInfoModal>
    </div>
  )
}

export default ShowHistory
