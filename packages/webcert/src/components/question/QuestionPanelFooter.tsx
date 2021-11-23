import React, { useState } from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { ButtonWithConfirmModal, CustomButton, Question, ResourceLink, ResourceLinkType } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faCopy } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { answerComplementCertificate, complementCertificate } from '../../store/certificate/certificateActions'
import { getResourceLink } from '@frontend/common/src'
import { CannotComplementData, CannotComplementModalContent } from './CannotComplementModalContent'
import { useHistory } from 'react-router-dom'

interface Props {
  questions: Question[]
}

const QuestionPanelFooter: React.FC<Props> = ({ questions }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [cannotComplement, setCannotComplement] = useState<CannotComplementData | null>(null)

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
        startIcon={<FontAwesomeIcon icon={faCopy} size="lg" />}
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
        modalTitle={'Kan ej komplettera'}
        confirmButtonText={'Skicka svar'}
        name={cannotComplementResourceLink.name}
        description={cannotComplementResourceLink.description}
        startIcon={<FontAwesomeIcon icon={faCommentAlt} size="lg" />}>
        <CannotComplementModalContent onChange={(data) => setCannotComplement(data)} />
      </ButtonWithConfirmModal>
    )
  }

  if (!showQuestionPanelFooter()) {
    return null
  }

  return (
    <SidePanelFooter backgroundColor="iu-bg-grey-300" textColor="iu-color-white">
      {getComplementButton()}
      {getCannotComplementButton()}
    </SidePanelFooter>
  )
}

export default QuestionPanelFooter
