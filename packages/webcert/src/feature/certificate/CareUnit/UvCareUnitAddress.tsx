import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import CategoryHeader from '../CategoryHeader'
import CategoryTitle from '../CategoryTitle'
import DateRangeIcon from '@material-ui/icons/DateRange'
import QuestionWrapper from '../QuestionWrapper'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    //TODO: Add this backgroundcolor to theme, should it be in secondary?
    backgroundColor: '#4b566f',
    borderBottom: `2px solid ${theme.palette.primary.dark}`,
  },
  dateWrapper: {
    display: 'flex',
  },
  date: {
    marginLeft: theme.spacing(1),
  },
  contentWrapper: {
    backgroundColor: '#4b566f',
    color: '#fff',
  },
  infoTitle: {
    fontSize: theme.typography.fontSize * 1.2,
    marginBottom: theme.spacing(1),
  },
}))

const UvCareUnitAddress: React.FC = (props) => {
  const classes = useStyles()
  const metadata = useSelector(getCertificateMetaData)

  if (!metadata) return null

  function formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${[year, month, day].join('-')}`
  }

  return (
    <>
      <CategoryHeader additionalStyles={classes.header}>
        <CategoryTitle>Ovanstående uppgifter och bedömningar bekräftas</CategoryTitle>
        <div className={classes.dateWrapper}>
          <DateRangeIcon></DateRangeIcon>
          <Typography className={classes.date}>{formatDate(metadata.created)}</Typography>
        </div>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={`${classes.contentWrapper}`}>
        <Typography variant="h6" className={classes.infoTitle}>
          Namn och kontaktuppgifter till vårdenheten
        </Typography>
        <Typography>{metadata.issuedBy.fullName}</Typography>
        <Typography>{metadata.unit.address}</Typography>
        <Typography>{metadata.unit.zipCode}</Typography>
        <Typography>{metadata.unit.city}</Typography>
        <Typography>{metadata.unit.phoneNumber}</Typography>
      </QuestionWrapper>
    </>
  )
}

export default UvCareUnitAddress
