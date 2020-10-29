import React, { useRef, useState } from 'react'
import { Typography, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Unit } from '@frontend/common'
import { updateCertificateUnit } from '../../../store/certificate/certificateActions'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { getIsEditable, getIsLocked, getUnit } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    '& .MuiGrid-container + .MuiGrid-container': {
      marginTop: theme.spacing(2),
    },
  },
  zipCode: {
    maxWidth: '6em',
  },
  city: {
    maxWidth: '20em',
  },
  phoneNumber: {
    maxWidth: '15em',
  },
}))

const UeCareUnitAddress: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const unit = useSelector(getUnit())
  const disabled = useSelector(getIsLocked)
  const editable = useSelector(getIsEditable)
  const [careUnitInfo, setCareUnitInfo] = useState<Unit>(unit)

  const dispatchEditDraft = useRef(
    _.debounce((state: Unit) => {
      dispatch(updateCertificateUnit(state))
    }, 1000)
  ).current

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target
    const updatedUnit = { ...careUnitInfo, [name]: value } as Unit

    setCareUnitInfo(updatedUnit)
    dispatchEditDraft(updatedUnit)
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle>Vårdenhetens adress</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={classes.questionWrapper}>
        <Grid container>
          <Grid container alignItems="center">
            <Grid item sm={3}>
              <Typography>
                <label htmlFor={'address'}>Postadress</label>
              </Typography>
            </Grid>
            <Grid item sm={9}>
              <TextField
                disabled={disabled || !editable}
                onChange={handleChange}
                fullWidth
                size="small"
                name={'address'}
                id={'address'}
                value={careUnitInfo.address}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item sm={3}>
              <Typography>
                <label htmlFor={'zipCode'}>Postnummer</label>
              </Typography>
            </Grid>
            <Grid item sm={9}>
              <TextField
                disabled={disabled || !editable}
                className={classes.zipCode}
                onChange={handleChange}
                fullWidth
                size="small"
                name={'zipCode'}
                id={'zipCode'}
                value={careUnitInfo.zipCode}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item sm={3}>
              <Typography>
                <label htmlFor={'city'}>Postort</label>
              </Typography>
            </Grid>
            <Grid item sm={9}>
              <TextField
                disabled={disabled || !editable}
                className={classes.city}
                onChange={handleChange}
                fullWidth
                size="small"
                name={'city'}
                id={'city'}
                value={careUnitInfo.city}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item sm={3}>
              <Typography>
                <label htmlFor={'phoneNumber'}>Telefonnummer</label>
              </Typography>
            </Grid>
            <Grid item sm={9}>
              <TextField
                disabled={disabled || !editable}
                className={classes.phoneNumber}
                onChange={handleChange}
                fullWidth
                size="small"
                name={'phoneNumber'}
                id={'phoneNumber'}
                value={careUnitInfo.phoneNumber}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
      </QuestionWrapper>
    </>
  )
}

export default UeCareUnitAddress
