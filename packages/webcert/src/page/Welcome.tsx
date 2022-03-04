import { CustomButton, RadioButton } from '@frontend/common'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import {
  clearWelcome,
  createNewCertificate,
  loginUser,
  populateFmb,
  updateCertificateId,
  updateCreateCertificate,
  updateNavigateToCertificate,
} from '../store/welcome/welcomeActions'
import WelcomeCertificateTypes from '../components/welcome/WelcomeCertificateTypes'
import { getAvailableUsers, getCertificateId, getCreateCertificate, getNavigateToCertificate } from '../store/welcome/welcomeSelectors'
import { triggerLogoutNow } from '../store/user/userActions'
import WelcomeDeepIntegration from '../components/welcome/WelcomeDeepIntegration'
import { MockUser } from '../store/welcome/welcomeReducer'
import WelcomeIntegrationParameters from '../components/welcome/WelcomeIntegrationParameters'

interface JsonUser extends MockUser {
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

const StyledInput = styled.input.attrs(() => ({
  type: 'text',
  placeholder: 'intygsid',
}))`
  max-width: 600px;
`

const ExpandableDetails = styled.details`
  max-width: 600px;
`

const Welcome: React.FC = () => {
  const certificateId = useSelector(getCertificateId())
  const createCertificate = useSelector(getCreateCertificate())
  const availableUsers = useSelector(getAvailableUsers())
  const navigateToCertificate = useSelector(getNavigateToCertificate())

  const [selectedUser, setSelectedUser] = useState(availableUsers[0])
  const [jsonUser, setJsonUser] = useState({ ...availableUsers[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' } as JsonUser)
  const [existingCertificateId, setExistingCertificateId] = useState('')
  const [isCreateNewCertificate, setIsCreateNewCertificate] = useState(false)
  const [isDeepIntegration, setIsDeepIntegration] = useState(false)
  const [isFakeLogin, setFakeLogin] = useState(true)

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.personId = selectedUser.hsaId
    updatedCreateCertificate.unitId = selectedUser.enhetId
    dispatch(updateCreateCertificate(updatedCreateCertificate))
    dispatch(triggerLogoutNow())
  }, [])

  useEffect(() => {
    if (!certificateId) {
      return
    }

    if (!isFakeLogin) {
      dispatch(updateNavigateToCertificate(true))
    } else {
      const jsonString = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
      dispatch(loginUser(jsonString))
    }
  }, [certificateId])

  useEffect(() => {
    if (!navigateToCertificate) {
      return
    }

    if (!isDeepIntegration) {
      history.push(`/certificate/${certificateId}`)
      dispatch(clearWelcome())
    }
  }, [navigateToCertificate])

  if (navigateToCertificate && isDeepIntegration) {
    return <WelcomeDeepIntegration certificateId={certificateId} unitId={isFakeLogin ? selectedUser.enhetId : ''} sjf={true} />
  }

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
      dispatch(updateCertificateId(existingCertificateId))
    }
  }

  const handleCreateNewCertificateCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCreateNewCertificate(event.target.checked)
  }

  const handleDeepIntegrationCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeepIntegration(event.target.checked)
    if (!event.target.checked) {
      setFakeLogin(true)
    }
  }

  const dispatchPopulateFmb = () => {
    dispatch(populateFmb)
  }

  return (
    <div>
      <div className="ic-container">
        <div className="iu-grid-span-12">
          <h1>Testinloggningar för Webcert</h1>
        </div>
        <div className="iu-grid-rows iu-mt-500">
          <div className="iu-grid-cols iu-grid-cols-12">
            <div className="iu-grid-span-7">
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
                  onChange={handleCreateNewCertificateCheckbox}
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
                    value={existingCertificateId}
                    onChange={(e) => setExistingCertificateId(e.target.value)}
                    type="text"
                    className="ic-textfield"
                    placeholder="intygsid"
                  />
                )}
                <input
                  onChange={handleDeepIntegrationCheckbox}
                  className="ic-forms__checkbox"
                  type="checkbox"
                  checked={isDeepIntegration}
                  id="isDeepIntegration"
                />
                <label htmlFor="isDeepIntegration">Djupintegrerat uthopp?</label>
                <div>
                  <RadioButton
                    key={'fake'}
                    label={'Fake-inloggning'}
                    value={'fake'}
                    checked={isFakeLogin}
                    id={'fake'}
                    name={'fake'}
                    disabled={!isDeepIntegration}
                    onChange={() => setFakeLogin(true)}
                  />
                  <RadioButton
                    key={'siths'}
                    label={'SITHS-inloggning'}
                    value={'siths'}
                    checked={!isFakeLogin}
                    id={'siths'}
                    name={'siths'}
                    disabled={!isDeepIntegration}
                    onChange={() => setFakeLogin(false)}
                  />
                </div>
                {isDeepIntegration && <WelcomeIntegrationParameters />}
                <CustomButton
                  buttonStyle="primary"
                  type="submit"
                  disabled={!isCreateNewCertificate && existingCertificateId.length < 1}
                  onSubmit={handleLogin}>
                  Logga in
                </CustomButton>
              </StyledForm>
            </div>
            <div className="iu-grid-span-5">
              <h3>Inloggningsprofil</h3>
              <JsonInfo>{JSON.stringify(jsonUser, undefined, 4)}</JsonInfo>
            </div>
          </div>
        </div>
        <div className="iu-grid-rows iu-mt-500">
          <div className="iu-grid-cols iu-grid-cols-12">
            <div className="iu-grid-span-7">
              <ExpandableDetails className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable">
                <summary className="ic-expandable-button ic-inner ic-expandable-button--chevron">Övriga parametrar</summary>
                <CustomButton buttonStyle="primary" type="button" onClick={dispatchPopulateFmb}>
                  Populera FMB
                </CustomButton>
              </ExpandableDetails>
              <ExpandableDetails className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable iu-mt-500">
                <summary className="ic-expandable-button ic-inner ic-expandable-button--chevron">Hjälplänkar</summary>
                <p>Nedan finns ett antal snabblänkar till hjälpfunktioner för utvecklings- och teständamål.</p>
                <p>
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/version.jsp" target="_blank">
                    Versions- och bygginformation
                  </a>
                </p>
                <p>
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/pubapp/apis/index.html" target="_blank">
                    REST-endpoints
                  </a>
                </p>
                <p>
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/pubapp/simulator/index.html" target="_blank">
                    Ärendeverktyget
                  </a>
                </p>
              </ExpandableDetails>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
