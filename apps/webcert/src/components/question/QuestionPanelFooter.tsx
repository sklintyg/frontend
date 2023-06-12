import {
  ButtonWithConfirmModal,
  CustomButton,
  editImage,
  getResourceLink,
  Question,
  ResourceLink,
  ResourceLinkType,
  speechBubbleImage,
} from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import ForwardCertificateButton from '../../feature/certificate/Buttons/ForwardCertificateButton'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { answerComplementCertificate, complementCertificate } from '../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../store/certificate/certificateSelectors'
import { CannotComplementData, CannotComplementModalContent } from './CannotComplementModalContent'

interface Props {
  questions: Question[]
}

const ButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

const QuestionPanelFooter: React.FC<Props> = ({ questions }) => {
  const dispatch = useDispatch()
  const [cannotComplement, setCannotComplement] = useState<CannotComplementData | null>(null)
  const certificateMetadata = useSelector(getCertificateMetaData)

  const onComplementClick = () => dispatch(complementCertificate({ message: '' }))

  const onCannotComplementClick = () => {
    if (!cannotComplement) return

    if (cannotComplement.answerWithCertificate) {
      dispatch(complementCertificate({ message: cannotComplement.message }))
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
    getResourceLinkIfExists(ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE) ||
    getResourceLinkIfExists(ResourceLinkType.FORWARD_QUESTION)

  const getComplementButton = () => {
    const complementResourceLink = getResourceLinkIfExists(ResourceLinkType.COMPLEMENT_CERTIFICATE)
    if (!complementResourceLink) {
      return null
    }

    return (
      <CustomButton
        buttonClasses={'iu-mr-200'}
        tooltip={complementResourceLink.description}
        disabled={!complementResourceLink.enabled}
        buttonStyle="primary"
        text={complementResourceLink.name}
        startIcon={<img src={editImage} alt="Komplettera" />}
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
        buttonClasses="iu-mr-200"
        startIcon={<img src={speechBubbleImage} alt="Kan ej komplettera" />}
      >
        <CannotComplementModalContent onChange={(data) => setCannotComplement(data)} />
      </ButtonWithConfirmModal>
    )
  }

  const getForwardButton = () => {
    const question = questions.find((question) =>
      question.links.find((resourceLink) => resourceLink.type === ResourceLinkType.FORWARD_QUESTION)
    )
    if (!question || !certificateMetadata) {
      return null
    }

    const link = getResourceLink(question.links, ResourceLinkType.FORWARD_QUESTION)

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
        certificateType={certificateMetadata.type}
        type={link.type}
      />
    )
  }

  if (!showQuestionPanelFooter()) {
    return null
  }

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <ButtonsWrapper>
        {getComplementButton()}
        {getCannotComplementButton()}
        {getForwardButton()}
      </ButtonsWrapper>
    </SidePanelFooter>
  )
}

export default QuestionPanelFooter
