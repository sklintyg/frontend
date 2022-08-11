import React, { useState } from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { ButtonWithConfirmModal, CustomButton, Question, ResourceLink, ResourceLinkType, getResourceLink } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { answerComplementCertificate, complementCertificate } from '../../store/certificate/certificateActions'
import { CannotComplementData, CannotComplementModalContent } from './CannotComplementModalContent'
import { useHistory } from 'react-router-dom'
import speechBubble from '@frontend/common/src/images/speech-bubble.svg'
import edit from '@frontend/common/src/images/edit.svg'
import ForwardCertificateButton from '../../feature/certificate/Buttons/ForwardCertificateButton'
import { getCertificateMetaData } from '../../store/certificate/certificateSelectors'

interface Props {
  questions: Question[]
}

const QuestionPanelFooter: React.FC<Props> = ({ questions }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [cannotComplement, setCannotComplement] = useState<CannotComplementData | null>(null)
  const certificateMetadata = useSelector(getCertificateMetaData)

  const onComplementClick = () => dispatch(complementCertificate({ message: '', history: history }))

  const onCannotComplementClick = () => {
    if (!cannotComplement) return

    if (cannotComplement.answerWithCertificate) {
      dispatch(complementCertificate({ message: cannotComplement.message, history: history }))
    } else {
      dispatch(answerComplementCertificate(cannotComplement.message))
    }
  }

  const getResourceLinkIfExists = (type: ResourceLinkType): ResourceLink | null => {
    const questionWithResourceLink = questions.find((question) => question.links.some((link) => link.type === type))

    if (questionWithResourceLink) {
      return getResourceLink(questionWithResourceLink.links, type)
    }

    return null
  }

  const showQuestionPanelFooter = () =>
    getResourceLinkIfExists(ResourceLinkType.COMPLEMENT_CERTIFICATE) ||
    getResourceLinkIfExists(ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE)

  const getComplementButton = () => {
    const complementResourceLink = getResourceLinkIfExists(ResourceLinkType.COMPLEMENT_CERTIFICATE)
    if (!complementResourceLink) {
      return null
    }

    return (
      <CustomButton
        buttonClasses={'iu-mr-300'}
        tooltip={complementResourceLink.description}
        disabled={!complementResourceLink.enabled}
        buttonStyle="primary"
        text={complementResourceLink.name}
        startIcon={<img src={edit} alt="Komplettera" />}
        onClick={onComplementClick}
      />
    )
  }

  const getCannotComplementButton = () => {
    const cannotComplementResourceLink = getResourceLinkIfExists(ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE)
    if (!cannotComplementResourceLink) {
      return null
    }

    return (
      <ButtonWithConfirmModal
        disabled={!cannotComplementResourceLink.enabled}
        confirmButtonDisabled={!(cannotComplement && cannotComplement.message)}
        onConfirm={onCannotComplementClick}
        modalTitle="Kan ej komplettera"
        confirmButtonText="Skicka svar"
        name={cannotComplementResourceLink.name}
        description={cannotComplementResourceLink.description}
        startIcon={<img src={speechBubble} alt="Kan ej komplettera" />}>
        <CannotComplementModalContent onChange={(data) => setCannotComplement(data)} />
      </ButtonWithConfirmModal>
    )
  }

  const getForwardButton = () => {
    const link = getResourceLinkIfExists(ResourceLinkType.FORWARD_QUESTION)
    if (!link || !certificateMetadata) {
      return null
    }

    return (
      <ForwardCertificateButton
        name={link.name}
        description={link.description}
        functionDisabled={false}
        enabled={link.enabled}
        forwarded={certificateMetadata.forwarded}
        unitName={certificateMetadata.unit.unitName}
        careProviderName={certificateMetadata.careProvider.unitName}
        certificateId={certificateMetadata.id}
        type={link.type}
      />
    )
  }

  if (!showQuestionPanelFooter()) {
    return null
  }

  return (
    <SidePanelFooter backgroundColor="iu-bg-grey-300" textColor="iu-color-white" additionalStyles={'iu-m-none'}>
      {getComplementButton()}
      {getCannotComplementButton()}
      {getForwardButton()}
    </SidePanelFooter>
  )
}

export default QuestionPanelFooter
