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
  grid: {
    alignItems: 'center',
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
        <div className={`iu-grid-cols iu-grid-cols-12 ${classes.grid}`}>
          <div className="iu-grid-span-3">
            <label htmlFor={'address'}>Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <input
              className="ic-textfield"
              type="text"
              disabled={disabled || !editable}
              onChange={handleChange}
              name={'address'}
              id={'address'}
              value={careUnitInfo.address}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'zipCode'}>Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <input
              disabled={disabled || !editable}
              className={`${classes.zipCode} ic-textfield`}
              onChange={handleChange}
              name={'zipCode'}
              id={'zipCode'}
              value={careUnitInfo.zipCode}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'city'}>Postort</label>
          </div>
          <div className="iu-grid-span-9">
            <input
              disabled={disabled || !editable}
              className={`${classes.city} ic-textfield`}
              onChange={handleChange}
              name={'city'}
              id={'city'}
              value={careUnitInfo.city}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'phoneNumber'}>Telefonnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <input
              disabled={disabled || !editable}
              className={`${classes.phoneNumber} ic-textfield`}
              onChange={handleChange}
              name={'phoneNumber'}
              id={'phoneNumber'}
              value={careUnitInfo.phoneNumber}
            />
          </div>
        </div>
      </QuestionWrapper>
    </>
  )
}

export default UeCareUnitAddress
