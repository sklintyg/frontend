import { CustomButton, User } from '@frontend/common'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { loginUser } from '../store/user/userActions'
import { createNewCertificate, updateCreateCertificate, updateCreatedCertificateId } from '../store/welcome/welcomeActions'
import WelcomeCertificateTypes from '../components/welcome/WelcomeCertificateTypes'
import { getAvailableUsers, getCreateCertificate, getCreatedCertificateId } from '../store/welcome/welcomeSelectors'

interface JsonUser extends User {
  origin: string
  authenticationMethod: string
}

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
  const createdCertificateId = useSelector(getCreatedCertificateId())
  const createCertificate = useSelector(getCreateCertificate())
  const availableUsers = useSelector(getAvailableUsers())
  const [selectedUser, setSelectedUser] = useState(availableUsers[0])
  const [jsonUser, setJsonUser] = useState({ ...availableUsers[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
  const [certificateId, setCertificateId] = useState('')
  const [isCreateNewCertificate, setIsCreateNewCertificate] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.personId = selectedUser.hsaId
    updatedCreateCertificate.unitId = selectedUser.enhetId
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }, [])

  useEffect(() => {
    if (!createdCertificateId) {
      return
    }

    const jsonString = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
    dispatch(loginUser({ user: jsonString, loginUserSuccess: { certificateId: createdCertificateId, history: history } }))
    dispatch(updateCreatedCertificateId(''))
  }, [createdCertificateId])

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = availableUsers.find((user) => user.hsaId === event.target.value)!

    setSelectedUser(selectedUser)

    setJsonUser({ ...selectedUser, origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })

    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.personId = selectedUser.hsaId
    updatedCreateCertificate.unitId = selectedUser.enhetId
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    if (isCreateNewCertificate) {
      dispatch(createNewCertificate(createCertificate))
    } else {
      const jsonString = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
      dispatch(loginUser({ user: jsonString, loginUserSuccess: { certificateId: certificateId, history: history } }))
    }
  }

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCreateNewCertificate(event.target.checked)
  }

  return (
    <div>
      <div className="ic-container">
        <div className="iu-grid-cols">
          <div className="iu-grid-span-12">
            <h1>Testinloggningar för Webcert</h1>
          </div>
          <div className="iu-grid-span-5">
            <h2>Användare</h2>
            <StyledSelect value={selectedUser.hsaId} onChange={handleChangeMultiple} size={availableUsers.length}>
              {availableUsers.map((user) => (
                <option key={user.hsaId} value={user.hsaId}>
                  {user.forNamn} {user.efterNamn} ({user.legitimeradeYrkesgrupper?.[0] ?? 'Vårdadmin'}){' '}
                </option>
              ))}
            </StyledSelect>
            <StyledForm onSubmit={handleLogin}>
              <input
                onChange={handleCheckbox}
                className="ic-forms__checkbox"
                type="checkbox"
                checked={isCreateNewCertificate}
                id="isCreateNewCertificate"
              />
              <label htmlFor="isCreateNewCertificate">Skapa nytt utkast/intyg?</label>
              {isCreateNewCertificate && <WelcomeCertificateTypes />}
              {!isCreateNewCertificate && (
                <StyledInput
                  disabled={isCreateNewCertificate}
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  type="text"
                  className="ic-textfield"
                  placeholder="intygsid"
                />
              )}
              <CustomButton
                style="primary"
                type="submit"
                disabled={!isCreateNewCertificate && certificateId.length < 1}
                onSubmit={handleLogin}>
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
