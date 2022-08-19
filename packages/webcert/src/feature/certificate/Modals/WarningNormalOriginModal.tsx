import React, { useState } from 'react'
import { CustomButton, InfoBox, ResourceLinkType, ModalBase } from '@frontend/common/src'
import { useSelector } from 'react-redux'
import { getUser, getUserResourceLink } from '../../../store/user/userSelectors'

const WarningNormalOriginModal: React.FC = () => {
  const user = useSelector(getUser)
  const resourceLink = useSelector(getUserResourceLink(ResourceLinkType.WARNING_NORMAL_ORIGIN))
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    if (!user) {
      return
    }
    setOpen(false)
    window.sessionStorage[user.loggedInUnit.unitId] = true
  }

  const openModal = () => {
    if (!user) {
      return false
    }

    return !!resourceLink && !window.sessionStorage[user.loggedInUnit.unitId] && open
  }

  if (!resourceLink || !user) {
    return null
  }

  const getModalContent = () => {
    return (
      <div>
        <InfoBox type="observe">Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem</InfoBox>
        <p className="iu-pt-400">
          <span className="iu-fw-bold">{user.loggedInUnit.unitName}</span> har integrerat sitt journalsystem med Webcert.
        </p>
        <p>Om du skapar intyg i fristående Webcert kommer intygen inte synkroniseras med journalsystemet.</p>
      </div>
    )
  }

  return (
    <ModalBase
      open={openModal()}
      handleClose={handleClose}
      title={resourceLink.name}
      buttons={<CustomButton onClick={handleClose} buttonStyle="default" text="Stäng" />}
      content={getModalContent()}
    />
  )
}

export default WarningNormalOriginModal
