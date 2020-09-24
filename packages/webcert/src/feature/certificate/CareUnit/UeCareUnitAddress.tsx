import React, { useEffect, useRef, useState } from 'react'
import { Typography, Paper, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CategoryHeader from '../CategoryHeader'
import { Unit } from '@frontend/common'
import { updateCertificateUnit } from '../../../store/certificate/certificateActions'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { getUnit } from '../../../store/certificate/certificateSelectors'
import CategoryTitle from '../CategoryTitle'
import QuestionWrapper from '../QuestionWrapper'

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    '& .MuiGrid-container + .MuiGrid-container': {
      marginTop: theme.spacing(2),
    },
  },
  zipCode: {
    maxWidth: '5em',
  },
  city: {
    maxWidth: '20em',
  },
  phoneNumber: {
    maxWidth: '15em',
  },
}))

interface address {
  key: string
  title: string
  value: string
}

const UeCareUnitAddress: React.FC = () => {
  const classes: any = useStyles()
  const dispatch = useDispatch()
  const unit = useSelector(getUnit())
  const [careUnitInfo, setCareUnitInfo] = useState<address[]>([])

  useEffect(() => {
    let addressData: address[] = []

    // TODO: Get info FROM HSA catalog and perhaps have default value in unit so it's not hard-coded
    if (unit) {
      for (const prop in unit) {
        addressData = [
          ...addressData,
          {
            key: prop,
            // TODO: Set default values as displaytext
            // title: unit[x].displayText,
            title: prop,
            value: unit[prop].value,
          },
        ]
      }
    } else {
      addressData = [
        ...addressData,
        {
          key: 'postalAddress',
          title: 'Postadress',
          value: '',
        },
        {
          key: 'zipCode',
          title: 'Postnummer',
          value: '',
        },
        {
          key: 'city',
          title: 'Postort',
          value: '',
        },
        {
          key: 'phoneNumber',
          title: 'Telefonnummer',
          value: '',
        },
      ]
    }

    setCareUnitInfo(addressData)
  }, [])

  const dispatchEditDraft = useRef(
    _.debounce((state: address[]) => {
      const unit = getUpdatedUnit(state)
      dispatch(updateCertificateUnit(unit))
    }, 1000)
  ).current

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const updatedState = careUnitInfo.map((item) => {
      if (item.key === event.target.id) {
        item = { ...item, value: event.target.value }
      }

      return item
    })

    setCareUnitInfo(updatedState)
    dispatchEditDraft(updatedState)
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle>Vårdenhetens adress</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={classes.questionWrapper}>
        <Grid container>
          {careUnitInfo.map((field, i) => (
            <Grid key={i} container alignItems="center">
              <Grid item sm={3}>
                <Typography>
                  <label htmlFor={field.key}>{field.title}</label>
                </Typography>
              </Grid>
              <Grid item sm={9}>
                <TextField
                  className={classes[field.key]}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  id={field.key}
                  value={field.value}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </QuestionWrapper>
    </>
  )
}

function getUpdatedUnit(state: address[]): Unit {
  return state.reduce((obj, item) => {
    return {
      ...obj,
      [item.key]: { ...obj[item.key], value: item.value },
    } as Unit
  }, {} as Unit)
}

export default UeCareUnitAddress
