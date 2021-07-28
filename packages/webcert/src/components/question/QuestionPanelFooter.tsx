import React from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { CustomButton, Question, ResourceLink, ResourceLinkType } from '@frontend/common'
import { getResourceLink } from '@frontend/common/src'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { complementCertificate } from '../../store/certificate/certificateActions'

interface Props {
  questions: Question[]
}

const QuestionPanelFooter: React.FC<Props> = ({ questions }) => {
  const dispatch = useDispatch()

  const onComplementClick = () => dispatch(complementCertificate())

  const getComplementResourceLink = () =>
    questions.reduce(
      (resourceLink, question) => getResourceLink(question.links, ResourceLinkType.COMPLEMENT_CERTIFICATE),
      null as ResourceLink
    )

  const getComplementButton = () => {
    const complementResourceLink = getComplementResourceLink()
    if (!complementResourceLink) {
      return null
    }

    return (
      <CustomButton
        tooltip={complementResourceLink.description}
        disabled={!complementResourceLink.enabled}
        buttonStyle="primary"
        text={complementResourceLink.name}
        startIcon={<FontAwesomeIcon icon={faCopy} size="lg"></FontAwesomeIcon>}
        onClick={onComplementClick}
      />
    )
  }

  if (!getComplementResourceLink()) {
    return null
  }

  return (
    <SidePanelFooter backgroundColor="iu-bg-grey-300" textColor="iu-color-white">
      {getComplementButton()}
    </SidePanelFooter>
  )
}

export default QuestionPanelFooter
