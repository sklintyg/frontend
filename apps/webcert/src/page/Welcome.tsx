import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import WelcomeCertificateTypes from '../components/welcome/WelcomeCertificateTypes'
import WelcomeDeepIntegration from '../components/welcome/WelcomeDeepIntegration'
import WelcomeIntegrationParameters from '../components/welcome/WelcomeIntegrationParameters'
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect'
import { triggerLogoutNow } from '../store/user/userActions'
import { getConfig } from '../store/utils/utilsSelectors'
import {
  clearWelcome,
  createNewCertificate,
  loginUser,
  populateFmb,
  updateCertificateId,
  updateCreateCertificate,
  updateNavigateToCertificate,
} from '../store/welcome/welcomeActions'
import { MockUser } from '../store/welcome/welcomeReducer'
import { getAvailableUsers, getCertificateId, getCreateCertificate, getNavigateToCertificate } from '../store/welcome/welcomeSelectors'
import { CustomButton } from '../components/Inputs/CustomButton'
import RadioButton from '../components/Inputs/RadioButton'
import TextArea from '../components/Inputs/TextArea'

interface JsonUser extends MockUser {
  origin: string
  authenticationMethod: string
}

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

const StyledInput = styled.input`
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
  const config = useSelector(getConfig)

  const [selectedUser, setSelectedUser] = useState(availableUsers[0])
  const [jsonUser, setJsonUser] = useState({ ...availableUsers[0], origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' } as JsonUser)
  const [existingCertificateId, setExistingCertificateId] = useState('')
  const [isCreateNewCertificate, setIsCreateNewCertificate] = useState(false)
  const [isFreestanding, setIsFreestanding] = useState(false)
  const [isFakeLogin, setFakeLogin] = useState(true)
  const [showDeepIntegrationParameters, setShowDeepIntegrationParameters] = useState(false)

  const sithsUrl = '/saml/login/alias/defaultAliasNormal?idp=' + config.sakerhetstjanstIdpUrl

  const dispatch = useDispatch()
  const history = useHistory()

  const performLogin = useCallback(() => {
    const jsonString = `userJsonDisplay= ${JSON.stringify(jsonUser)}`
    dispatch(loginUser(jsonString))
  }, [dispatch, jsonUser])

  useDeepCompareEffect(() => {
    const updatedCreateCertificate = {
      ...createCertificate,
      personId: jsonUser.hsaId,
      unitId: jsonUser.enhetId,
    }
    dispatch(updateCreateCertificate(updatedCreateCertificate))
    dispatch(triggerLogoutNow())
  }, [createCertificate, dispatch, jsonUser.enhetId, jsonUser.hsaId])

  useEffect(() => {
    if (!certificateId) {
      return
    }

    if (!isFakeLogin) {
      dispatch(updateNavigateToCertificate(true))
    } else {
      performLogin()
    }
  }, [certificateId, dispatch, isFakeLogin, performLogin])

  useEffect(() => {
    if (!navigateToCertificate) {
      return
    }

    if (certificateId.length === 0) {
      if (!jsonUser.legitimeradeYrkesgrupper) {
        history.push('/list/unhandledcertificates')
      } else {
        history.push('/search')
      }
    } else {
      if (isFreestanding) {
        history.push(`/certificate/${certificateId}`)
        dispatch(clearWelcome())
      }
    }
  }, [certificateId, dispatch, history, isFreestanding, jsonUser.legitimeradeYrkesgrupper, navigateToCertificate])

  if (navigateToCertificate && !isFreestanding) {
    return <WelcomeDeepIntegration certificateId={certificateId} unitId={isFakeLogin ? jsonUser.enhetId : ''} />
  }

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = availableUsers.find((user) => user.hsaId === event.target.value) as MockUser

    setSelectedUser(selectedUser)

    setJsonUser({ ...selectedUser, origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })

    handleUpdateCreateCertificate(selectedUser.hsaId, selectedUser.enhetId)
  }

  const handleUpdateCreateCertificate = (hsaId: string, unitId: string) => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.personId = hsaId
    updatedCreateCertificate.unitId = unitId
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    if (isCreateNewCertificate && !isFakeLogin) {
      window.open(sithsUrl, '_self')
    } else if (isCreateNewCertificate) {
      dispatch(createNewCertificate(createCertificate))
    } else if (existingCertificateId.length > 1) {
      dispatch(updateCertificateId(existingCertificateId))
    } else if (jsonUser.origin === 'NORMAL') {
      performLogin()
    }
  }

  const handleCreateNewCertificateCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCreateNewCertificate(event.target.checked)
  }

  const handleDeepIntegrationParametersCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeepIntegrationParameters(event.target.checked)
    if (!event.target.checked) {
      setFakeLogin(true)
    }
  }

  const handleFreestandingOriginCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFreestanding(event.target.checked)

    if (event.target.checked) {
      setJsonUser({ ...selectedUser, origin: 'NORMAL', authenticationMethod: 'FAKE' })
    } else {
      setJsonUser({ ...selectedUser, origin: 'DJUPINTEGRATION', authenticationMethod: 'FAKE' })
    }
  }

  const handleUserChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jsonUser = JSON.parse(event.currentTarget.value)
    setJsonUser(jsonUser)
    handleUpdateCreateCertificate(jsonUser.hsaId, jsonUser.enhetId)
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
                  onChange={handleDeepIntegrationParametersCheckbox}
                  className="ic-forms__checkbox"
                  type="checkbox"
                  checked={showDeepIntegrationParameters}
                  id="isDeepIntegration"
                  disabled={jsonUser.origin === 'NORMAL'}
                />
                <label htmlFor="isDeepIntegration">Aktivera integrationsparametrar</label>
                <input
                  onChange={handleFreestandingOriginCheckbox}
                  className="ic-forms__checkbox"
                  type="checkbox"
                  checked={jsonUser.origin === 'NORMAL'}
                  disabled={showDeepIntegrationParameters}
                  id="isFreestanding"
                />
                <label htmlFor="isFreestanding">Logga in som fristående</label>
                <div>
                  <RadioButton
                    key={'fake'}
                    label={'Fake-inloggning'}
                    value={'fake'}
                    checked={isFakeLogin}
                    id={'fake'}
                    name={'fake'}
                    onChange={() => setFakeLogin(true)}
                  />
                  <RadioButton
                    key={'siths'}
                    label={'SITHS-inloggning'}
                    value={'siths'}
                    checked={!isFakeLogin}
                    id={'siths'}
                    name={'siths'}
                    onChange={() => setFakeLogin(false)}
                  />
                </div>
                {showDeepIntegrationParameters && <WelcomeIntegrationParameters />}
                <CustomButton
                  buttonStyle="primary"
                  type="submit"
                  disabled={jsonUser.origin !== 'NORMAL' && !isCreateNewCertificate && existingCertificateId.length < 1}
                  onSubmit={handleLogin}
                >
                  Logga in
                </CustomButton>
              </StyledForm>
            </div>
            <div className="iu-grid-span-5">
              <h3>Inloggningsprofil</h3>
              <TextArea value={JSON.stringify(jsonUser, undefined, 4)} rows={11} onChange={handleUserChange} />
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
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/version.jsp" target="_blank" rel="noreferrer">
                    Versions- och bygginformation
                  </a>
                </p>
                <p>
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/pubapp/apis/index.html" target="_blank" rel="noreferrer">
                    REST-endpoints
                  </a>
                </p>
                <p>
                  <a href="https://webcert-devtest.intyg.nordicmedtest.se/pubapp/simulator/index.html" target="_blank" rel="noreferrer">
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
