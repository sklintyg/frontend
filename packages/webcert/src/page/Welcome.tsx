import { TextArea, User } from '@frontend/common'
import { Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DatePickerCustom from '../feature/certificate/Inputs/DateRangePicker'
import Assessment from '../feature/certificate/Question/Assessment'
import { loginUser } from '../store/user/userActions'

interface JsonUser extends User {
  origin: string
  authenticationMethod: string
}

const mockData = [
  {
    hsaId: 'TSTNMT2321000156-1079',
    forNamn: 'Arnold',
    efterNamn: 'Johansson',
    enhetId: 'TSTNMT2321000156-1077',
    legitimeradeYrkesgrupper: ['Läkare'],
  },
  {
    hsaId: 'TSTNMT2321000156-10CD',
    forNamn: 'Annika',
    efterNamn: 'Larsson',
    enhetId: 'TSTNMT2321000156-1077',
  },
  {
    hsaId: 'IFV1239877878-104B',
    forNamn: 'Åsa',
    efterNamn: 'Andersson',
    enhetId: 'IFV1239877878-1046',
    legitimeradeYrkesgrupper: ['Läkare'],
  },
  {
    hsaId: 'IFV1239877878-104K',
    forNamn: 'Lars',
    efterNamn: 'Andersson',
    enhetId: 'IFV1239877878-1045',
    legitimeradeYrkesgrupper: ['Läkare'],
  },
]

const useStyles = makeStyles((theme) => ({
  userInfoWrapper: {
    flexGrow: 1,
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
  },
  form: {
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
  },
  userListWrapper: {
    flexGrow: 1,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
  },
  textArea: {
    width: '100%',
    padding: theme.spacing(0.5),
    lineHeight: theme.typography.pxToRem(20),
    fontSize: theme.typography.pxToRem(14),
    fontFamily: 'inherit',
    color: '#555',
  },
  select: {
    width: '100%',
    fontSize: theme.typography.pxToRem(14),
    fontFamily: 'inherit',
    color: '#555',
  },
  loginButton: {
    width: '100%',
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
  mainTitle: {
    fontSize: theme.typography.h4.fontSize,
    marginTop: theme.spacing(4),
  },
}))

const Welcome = () => {
  const [selectedUser, setSelectedUser] = useState(mockData[0])
  const [jsonUser, setJsonUser] = useState({ ...mockData[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
  const [certificateId, setCertificateId] = useState('')
  const [generateRandomId, setGenerateRandomId] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = mockData.find((user) => user.hsaId === event.target.value)!

    setSelectedUser(selectedUser)

    setJsonUser({ ...selectedUser, origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    const jsonString = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
    const id = generateRandomId ? uuidv4() : certificateId
    dispatch(loginUser({ user: jsonString, loginUserSuccess: { certificateId: id, history: history } }))
  }

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setGenerateRandomId(checked)
  }

  // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  return (
    <Paper square elevation={0}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Assessment></Assessment>
          </Grid>
          <Grid item xs={12}>
            <DatePickerCustom></DatePickerCustom>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.mainTitle} variant="h1">
              Testinloggningar Webcert
            </Typography>
          </Grid>
          <Grid item xs={8} className={classes.userListWrapper}>
            <Typography variant="h6">Användare</Typography>
            <select className={classes.select} value={selectedUser.hsaId} onChange={handleChangeMultiple} size={mockData.length}>
              {mockData.map((user) => (
                <option key={user.hsaId} value={user.hsaId}>
                  {user.forNamn} {user.efterNamn} ({user.legitimeradeYrkesgrupper?.[0] ?? 'Vårdadmin'})
                </option>
              ))}
            </select>
            <form onSubmit={handleLogin} className={classes.form}>
              <FormControlLabel
                control={<Checkbox onChange={handleCheckbox} value={generateRandomId} checked={generateRandomId} />}
                label="Generera id?"
              />
              <TextField
                disabled={generateRandomId}
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                size="small"
                fullWidth
                label="intygsid"
                variant="outlined"
              />
              <Button
                disabled={!generateRandomId && certificateId.length < 1}
                className={classes.loginButton}
                variant="contained"
                type="submit"
                onSubmit={handleLogin}>
                Logga in
              </Button>
            </form>
          </Grid>
          <Grid item xs={4} className={classes.userInfoWrapper}>
            <Typography variant="h6">Inloggningsprofil</Typography>
            <TextArea additionalStyles={classes.textArea} value={JSON.stringify(jsonUser, undefined, 4)}></TextArea>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

export default Welcome
