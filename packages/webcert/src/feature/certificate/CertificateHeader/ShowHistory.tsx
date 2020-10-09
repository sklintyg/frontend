import React from 'react'
import { TextWithInfoModal, CertificateEvent, CertificateEventType, CertificateStatus } from '@frontend/common'
import { Link, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '12px',
    color: theme.palette.info.dark,
  },
}))

interface Props {
  historyEntries: CertificateEvent[]
}

const ShowHistory: React.FC<Props> = ({ historyEntries }) => {
  const classes = useStyles()

  function formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${[year, month, day].join('-')} ${d.getHours()}:${`0${d.getMinutes()}`.slice(-2)}`
  }

  const getHistoryText = (event: CertificateEvent, i: number) => {
    const date = formatDate(event.timestamp)

    switch (event.type) {
      case CertificateEventType.CREATED:
        return <Typography key={i}>{date} Utkastet är skapat</Typography>
      case CertificateEventType.SIGNED:
        return <Typography key={i}>{date} Intyget är signerat</Typography>
      case CertificateEventType.AVAILABLE_FOR_PATIENT:
        return <Typography key={i}>{date} Intyget är tillgängligt för patienten</Typography>
      case CertificateEventType.REPLACED:
        switch (event.relatedCertificateStatus) {
          case CertificateStatus.UNSIGNED:
            return (
              <Typography key={i}>
                {date} Det finns redan ett påbörjat utkast som ska ersätta detta intyg.{' '}
                <Link href={`/certificate/${event.relatedCertificateId}`}>Öppna utkastet</Link>
              </Typography>
            )
          case CertificateStatus.SIGNED:
            return (
              <Typography key={i}>
                {date} Intyget har ersatts av <Link href={`/certificate/${event.relatedCertificateId}`}>detta intyg</Link>
              </Typography>
            )
          case CertificateStatus.INVALIDATED:
            return (
              <Typography key={i}>
                {date} Intyget ersattes av ett intyg som nu är makulerat.{' '}
                <Link href={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
              </Typography>
            )
        }
      case CertificateEventType.REPLACES:
        return (
          <Typography key={i}>
            {date} Utkastet skapades för att ersätta ett tidigare intyg.{' '}
            <Link href={`/certificate/${event.relatedCertificateId}`}>Öppna intyget</Link>
          </Typography>
        )
      case CertificateEventType.SENT:
        return <Typography key={i}>{date} Intyget är skickat till Arbetsförmedlingen</Typography>
      case CertificateEventType.REVOKED:
        return <Typography key={i}>{date} Intyget är makulerat</Typography>
    }
  }

  return (
    <Typography className={classes.root}>
      <TextWithInfoModal text="Visa alla händelser" modalTitle="Alla händelser">
        {[...historyEntries].reverse().map((entry, i) => getHistoryText(entry, i))}
      </TextWithInfoModal>
    </Typography>
  )
}

export default ShowHistory
