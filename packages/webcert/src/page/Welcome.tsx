import { CustomButton, TextArea, User } from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
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

// const useStyles = makeStyles((theme) => ({
//   userInfoWrapper: {
//     flexGrow: 1,
//     paddingTop: theme.spacing(2),
//     paddingLeft: theme.spacing(2),
//     '& > *:not(:first-child)': {
//       marginTop: theme.spacing(1),
//     },
//   },
//   form: {
//     '& > *:not(:first-child)': {
//       marginTop: theme.spacing(1),
//     },
//   },
//   userListWrapper: {
//     flexGrow: 1,
//     paddingTop: theme.spacing(2),
//     paddingRight: theme.spacing(2),
//     '& > *:not(:first-child)': {
//       marginTop: theme.spacing(1),
//     },
//   },
//   textArea: {
//     width: '100%',
//     padding: theme.spacing(0.5),
//     lineHeight: theme.typography.pxToRem(20),
//     fontSize: theme.typography.pxToRem(14),
//     fontFamily: 'inherit',
//     color: '#555',
//   },
//   select: {
//     width: '100%',
//     fontSize: theme.typography.pxToRem(14),
//     fontFamily: 'inherit',
//     color: '#555',
//   },
//   loginButton: {
//     width: '100%',
//     backgroundColor: theme.palette.primary.light,
//     color: '#fff',
//   },
//   mainTitle: {
//     fontSize: theme.typography.h4.fontSize,
//     marginTop: theme.spacing(4),
//   },
// }))

const JsonInfo = styled.pre`
  display: inline-block;
  width: 100%;
  padding: 8px;
  line-height: 20px;
  font-size: 14px;
  color: #555;
  background-color: #f7f4f2;
  border-bottom: 2px solid #01a5a3;
  border-left: 0.0625rem solid #8d8d8d;
  border-right: 0.0625rem solid #8d8d8d;
  border-top: 0.0625rem solid #8d8d8d;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  > *:not(:first-child) {
    margin-top: 8px;
  }
`

const StyledSelect = styled.select`
  width: 100%;
  font-size: 14px;
  font-family: inherit;
  color: #555;
  max-width: 600px;
`

const StyledInput = styled.input.attrs((props) => ({
  type: 'text',
  placeholder: 'intygsid',
}))`
  max-width: 600px;
`

const Welcome = () => {
  const [selectedUser, setSelectedUser] = useState(mockData[0])
  const [jsonUser, setJsonUser] = useState({ ...mockData[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
  const [certificateId, setCertificateId] = useState('')
  const [generateRandomId, setGenerateRandomId] = useState(false)
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

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenerateRandomId(event.target.checked)
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
    <div>
      <div className="ic-container">
        <div className="iu-grid-cols">
          <div className="iu-grid-span-12">
            <h1>Testinloggningar Webcert</h1>
          </div>
          <div className="iu-grid-span-5">
            <h2>Användare</h2>
            <StyledSelect value={selectedUser.hsaId} onChange={handleChangeMultiple} size={mockData.length}>
              {mockData.map((user) => (
                <option key={user.hsaId} value={user.hsaId}>
                  {user.forNamn} {user.efterNamn} ({user.legitimeradeYrkesgrupper?.[0] ?? 'Vårdadmin'})
                </option>
              ))}
            </StyledSelect>
            <StyledForm onSubmit={handleLogin}>
              <input onChange={handleCheckbox} className="ic-forms__checkbox" type="checkbox" checked={generateRandomId} id="generateId" />
              <label htmlFor="generateId">Generera id?</label>
              <StyledInput
                disabled={generateRandomId}
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                type="text"
                className="ic-textfield"
                placeholder="intygsid"
              />
              <CustomButton style="primary" type="submit" disabled={!generateRandomId && certificateId.length < 1} onSubmit={handleLogin}>
                Logga in
              </CustomButton>
            </StyledForm>
          </div>
          <div className="iu-grid-span-7">
            <h3>Inloggningsprofil</h3>
            <JsonInfo>{JSON.stringify(jsonUser, undefined, 4)}</JsonInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
