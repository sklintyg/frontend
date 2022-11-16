import { ResourceLink, ResourceLinkType } from '@frontend/common'
import fileIcon from '@frontend/common/src/images/file.svg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { DeathCertificateConfirmModal } from '../../feature/certificate/Modals/DeathCertificateConfirmModal'
import { MissingRelatedCertificateModal } from '../../feature/certificate/Modals/MissingRelatedCertificateModal'
import { createNewCertificate, updateCreatedCertificateId } from '../../store/certificate/certificateActions'
import { getCertificateId } from '../../store/certificate/certificateSelectors'
import { getCertificateTypes } from '../../store/patient/patientActions'
import { getActivePatient, selectCertificateTypes } from '../../store/patient/patientSelectors'
import { setUserPreference } from '../../store/user/userActions'
import { getUserPreference } from '../../store/user/userSelectors'
import CertificateListRow from './CertificateListRow'
import { CreateCertificateButton } from './CreateCertificateButton'

const sortByFavorite = (a: boolean, b: boolean): number => {
  if (a > b) {
    return -1
  } else if (a < b) {
    return 1
  } else {
    return 0
  }
}

const CertificateBox = styled.div`
  max-height: 30.2em;
  overflow-y: auto;
`

const FlexWrapper = styled.div`
  flex: 1;
`

interface MissingRelatedCertificate {
  resourceLink: ResourceLink | undefined
  certificateType: string
  buttonText: string
}

const CertificateList: React.FC = () => {
  const certificateId = useSelector(getCertificateId())
  const userPreferences = useSelector(getUserPreference('wc.favoritIntyg'))
  const certificateTypes = useSelector(selectCertificateTypes)
  const patient = useSelector(getActivePatient)

  const [favorites, setFavorites] = useState<string[]>([])
  const [showDeathCertificateModal, setShowDeathCertificateModal] = useState(false)
  const [showMissingRelatedCertificateModal, setShowMissingRelatedCertificateModal] = useState(false)
  const [missingRelatedCertificate, setMissingRelatedCertificate] = useState<MissingRelatedCertificate>()

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    ReactTooltip.hide()
  }, [favorites])

  const handlePreferenceClick = (id: string) => {
    let updatedFavorites = []

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((f) => f !== id)
    } else {
      updatedFavorites = [...favorites, id]
    }

    setFavorites(updatedFavorites)
    dispatch(setUserPreference({ key: 'wc.favoritIntyg', value: JSON.stringify(updatedFavorites) }))
  }

  const handleCreateCertificate = (certificateType: string, links: ResourceLink[], label: string) => {
    const createDodsbevis = links.some((link) => link.type === ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION)
    const hasMissingRelatedCertificate = links.some((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION)

    if (createDodsbevis) {
      setShowDeathCertificateModal(true)
    } else if (hasMissingRelatedCertificate) {
      setMissingRelatedCertificate({
        resourceLink: links.find((link) => link.type === ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION),
        certificateType,
        buttonText: `Skapa ${label.toLowerCase()}`,
      })
      setShowMissingRelatedCertificateModal(true)
    } else {
      if (patient) {
        dispatch(createNewCertificate({ certificateType, patientId: patient.personId.id }))
      }
    }
  }

  useEffect(() => {
    if (patient) {
      dispatch(getCertificateTypes(patient.personId.id))
    }
  }, [dispatch, patient])

  useEffect(() => {
    if (userPreferences) {
      setFavorites([...JSON.parse(userPreferences)])
    }
  }, [userPreferences])

  useEffect(() => {
    if (certificateId) {
      dispatch(updateCreatedCertificateId(''))
      history.push(`/certificate/${certificateId}`)
    }
  }, [certificateId, dispatch, history])

  return (
    <div className="iu-flex">
      <div className="iu-mr-gutter">
        <img src={fileIcon} alt="Ikon för skapa intyg" className="iu-height-600" />
      </div>
      <FlexWrapper>
        <h3 className="iu-mb-05rem">Skapa intyg</h3>
        {patient && (
          <>
            <DeathCertificateConfirmModal patient={patient} setOpen={setShowDeathCertificateModal} open={showDeathCertificateModal} />
            {missingRelatedCertificate?.resourceLink && (
              <MissingRelatedCertificateModal
                createCertificateType={missingRelatedCertificate.certificateType}
                confirmButtonText={missingRelatedCertificate.buttonText}
                patient={patient}
                setOpen={setShowMissingRelatedCertificateModal}
                open={showMissingRelatedCertificateModal}
                {...missingRelatedCertificate.resourceLink}
              />
            )}
          </>
        )}
        <CertificateBox className="iu-border-secondary-light iu-shadow-sm iu-flex iu-flex-column">
          {[...certificateTypes]
            .sort(({ id: a }, { id: b }) => sortByFavorite(favorites.includes(a), favorites.includes(b)))
            .map(({ label, detailedDescription, id, issuerTypeId, links, message }) => {
              const createCertificateLink = links.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE)
              return (
                <CertificateListRow
                  certificateName={label}
                  certificateInfo={detailedDescription}
                  id={id}
                  issuerTypeId={issuerTypeId}
                  favorite={favorites.includes(id)}
                  link={links.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE)}
                  preferenceClick={handlePreferenceClick}
                  message={message}
                  key={id}>
                  {createCertificateLink && (
                    <CreateCertificateButton
                      id={id}
                      onClick={(certificateType: string) => {
                        handleCreateCertificate(certificateType, links, label)
                      }}
                      {...createCertificateLink}
                    />
                  )}
                </CertificateListRow>
              )
            })}
        </CertificateBox>
      </FlexWrapper>
    </div>
  )
}

export default CertificateList
