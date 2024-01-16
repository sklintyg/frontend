import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import TextWithInfoModal from '../../../components/utils/Modal/TextWithInfoModal'
import Spinner from '../../../components/utils/Spinner'
import { CertificateEvent, CertificateEventType, CertificateMetadata, CertificateRelationType, CertificateStatus } from '../../../types'
import { isHasParent, isParentRevoked } from '../../../utils'

const LinkWithMargin = styled(Link)`
  margin-left: 3px;
`

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
      case CertificateEventType.CREATED_FROM:
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
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</LinkWithMargin>
              </>
            )
          case CertificateStatus.SIGNED:
            return (
              <>
                Intyget har ersatts av <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>detta intyg</LinkWithMargin>
              </>
            )
          case CertificateStatus.REVOKED:
            return (
              <>
                Intyget ersattes av ett intyg som nu är makulerat.{' '}
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
              </>
            )
          case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
            return (
              <>
                Intyget ersattes av ett utkast som nu är låst.{' '}
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
              </>
            )
        }
        break
      case CertificateEventType.REPLACES:
        return (
          <>
            Utkastet skapades för att ersätta ett tidigare intyg.{' '}
            <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
          </>
        )
      case CertificateEventType.EXTENDED:
        return (
          <>
            Utkastet skapades för att förnya ett tidigare intyg.{' '}
            <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
          </>
        )
      case CertificateEventType.RENEWAL_OF:
        if (certificateMetadata.status === 'UNSIGNED') {
          return (
            <>
              Utkastet är skapat för att förnya ett tidigare intyg.{' '}
              <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
            </>
          )
        }
        break
      case CertificateEventType.SENT: {
        return `Intyget är skickat till ${certificateMetadata.sentTo}`
      }
      case CertificateEventType.REVOKED: {
        const hasParent = isHasParent(certificateMetadata)
        const parentRevoked = isParentRevoked(certificateMetadata)

        if (hasParent && !parentRevoked) {
          if (certificateMetadata.relations.parent?.type === CertificateRelationType.COMPLEMENTED) {
            return (
              <>
                Intyget är makulerat. Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.{' '}
                <LinkWithMargin to={`/certificate/${certificateMetadata.relations.parent?.certificateId}`}>Öppna intyget</LinkWithMargin>
              </>
            )
          } else {
            return (
              <>
                Intyget är makulerat. Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
                <LinkWithMargin to={`/certificate/${certificateMetadata.relations.parent?.certificateId}`}>Öppna intyget</LinkWithMargin>
              </>
            )
          }
        } else if (certificateMetadata.status === CertificateStatus.LOCKED_REVOKED) {
          return 'Utkastet är makulerat'
        } else {
          return 'Intyget är makulerat'
        }
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
        return (
          <>
            Utkastet är skapat för att komplettera ett tidigare intyg.{' '}
            <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
          </>
        )
      case CertificateEventType.COMPLEMENTED:
        if (event.relatedCertificateStatus === CertificateStatus.SIGNED) {
          return (
            <>
              Intyget har kompletterats med ett annat intyg.{' '}
              <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
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
              Det finns redan en påbörjad komplettering.{' '}
              <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</LinkWithMargin>
            </>
          )
        }
      case CertificateEventType.LOCKED:
        return 'Utkastet låstes'
      case CertificateEventType.COPIED_FROM:
        return (
          <>
            Utkastet är skapat som en kopia på ett låst utkast{' '}
            <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</LinkWithMargin>
          </>
        )
      case CertificateEventType.COPIED_BY:
        switch (event.relatedCertificateStatus) {
          case CertificateStatus.UNSIGNED:
            return (
              <>
                Det finns redan ett påbörjat utkast som ska ersätta detta låsta utkast.{' '}
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</LinkWithMargin>
              </>
            )
          case CertificateStatus.SIGNED:
            return (
              <>
                Utkastet har ersatts av <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>detta intyg</LinkWithMargin>
              </>
            )
          case CertificateStatus.REVOKED:
            return (
              <>
                Utkastet ersattes av ett intyg som nu är makulerat.{' '}
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</LinkWithMargin>
              </>
            )
          case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
            return (
              <>
                Utkastet ersattes av ett utkast som nu är låst.{' '}
                <LinkWithMargin to={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</LinkWithMargin>
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
    <div>
      <TextWithInfoModal className="iu-fs-100" text="Visa alla händelser" modalTitle="Alla händelser">
        {isEmpty && <Spinner text={'Laddar händelser'} size={'small'} />}
        {[...historyEntries].reverse().map((entry, i) => getHistoryEntry(i, entry))}
      </TextWithInfoModal>
    </div>
  )
}

export default ShowHistory
