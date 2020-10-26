import { TextArea, User } from '@frontend/common'
import { Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { loginUser } from '../store/user/userActions'

interface JsonUser extends User {
  origin: string
  authenticationMethod: string
}

const mockData: User[] = [
  {
    hsaId: 'TSTNMT2321000156-1079',
    name: 'Arnold Johansson',
    role: 'Läkare',
    loggedInUnit: 'NMT vg3 ve1',
    loggedInCareProvider: 'NMT vg3',
  },
  {
    hsaId: 'TSTNMT2321000156-10CD',
    name: 'Annika Larsson',
    role: 'Vårdadministratör',
    loggedInUnit: 'NMT vg3 ve1',
    loggedInCareProvider: 'NMT vg3',
  },
  {
    hsaId: 'IFV1239877878-104B',
    name: 'Åsa Andersson',
    role: 'Läkare',
    loggedInUnit: 'WebCert-Enhet2-Mottagning1',
    loggedInCareProvider: 'WebCert-Vårdgivare2',
  },
  {
    hsaId: 'IFV1239877878-104K',
    name: 'Lars Andersson',
    role: 'Läkare',
    loggedInUnit: 'WebCert-Enhet2-Mottagning2',
    loggedInCareProvider: 'WebCert-Vårdgivare2',
  },
]

const useStyles = makeStyles((theme) => ({
  userInfoWrapper: {
    flexGrow: 1,
    padding: theme.spacing(2),
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
  },
  userListWrapper: {
    flexGrow: 1,
    padding: theme.spacing(2),
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
}))

const Welcome = () => {
  const [selectedUser, setSelectedUser] = useState(mockData[0])
  const [jsonUser, setJsonUser] = useState<JsonUser>({ ...mockData[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
  const [certificateId, setCertificateId] = useState('')
  const [generateRandomId, setGenerateRandomId] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = mockData.find((user) => user.hsaId === event.target.value)!

    setSelectedUser(selectedUser)
    setJsonUser({ ...jsonUser, ...selectedUser })
  }

  const handleLogin = () => {
    const test = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
    const id = generateRandomId ? uuidv4() : certificateId
    dispatch(loginUser({ user: test, loginUserSuccess: { certificateId: id, history: history } }))
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
          <Grid item xs={8} className={classes.userListWrapper}>
            <Typography variant="h6">Användare</Typography>
            <select className={classes.select} value={selectedUser.hsaId} onChange={handleChangeMultiple} size={mockData.length}>
              {mockData.map((user) => (
                <option key={user.hsaId} value={user.hsaId}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <FormControlLabel
              control={<Checkbox onChange={handleCheckbox} value={generateRandomId} checked={generateRandomId} />}
              label="Generate random certificate id?"
            />
            <TextField
              disabled={generateRandomId}
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              size="small"
              fullWidth
              label="certificate id"
              variant="outlined"
            />
            <Button
              disabled={!generateRandomId && certificateId.length < 1}
              className={classes.loginButton}
              variant="contained"
              onClick={handleLogin}>
              Logga in
            </Button>
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
