import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import CategoryHeader from '../CategoryHeader'
import CategoryTitle from '../CategoryTitle'
import DateRangeIcon from '@material-ui/icons/DateRange'
import QuestionWrapper from '../QuestionWrapper'
import { useSelector } from 'react-redux'
import { getUnit } from '../../../store/certificate/certificateSelectors'
import { mockGetUserSelector, Unit } from '@frontend/common'

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: theme.palette.primary.light,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  dateWrapper: {
    display: 'flex',
  },
  date: {
    marginLeft: theme.spacing(1),
  },
  contentWrapper: {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
  infoTitle: {
    fontSize: theme.typography.fontSize * 1.2,
    marginBottom: theme.spacing(1),
  },
}))

const UvCareUnitAddress: React.FC = (props) => {
  const classes = useStyles()
  const unit = useSelector(getUnit())
  const doctor = useSelector(mockGetUserSelector)

  const unitData = () => {
    let unitData: string[] = []

    for (const prop in unit) {
      unitData = unitData.concat(unit[prop].value)
    }

    return unitData.map((curr, i) => <Typography key={i}>{curr}</Typography>)
  }

  return (
    <>
      <CategoryHeader additionalStyles={classes.header}>
        <CategoryTitle>Ovanstående uppgifter och bedömningar bekräftas</CategoryTitle>
        <div className={classes.dateWrapper}>
          <DateRangeIcon></DateRangeIcon>
          <Typography className={classes.date}>2020-09-23</Typography>
        </div>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={`${classes.contentWrapper}`}>
        <Typography variant="h6" className={classes.infoTitle}>
          Namn och kontaktuppgifter till vårdenheten
        </Typography>
        <Typography>{doctor.name}</Typography>
        {unitData()}
      </QuestionWrapper>
    </>
  )
}

export default UvCareUnitAddress
