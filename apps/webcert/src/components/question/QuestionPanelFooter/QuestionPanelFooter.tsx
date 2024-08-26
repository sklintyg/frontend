import { getByType } from '@frontend/utils'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import ForwardCertificateButton from '../../../feature/certificate/Buttons/ForwardCertificateButton'
import SidePanelFooter from '../../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import type { Question } from '../../../types'
import { ResourceLinkType } from '../../../types'
import { CannotComplementButton } from './CannotComplementButton'
import { ComplementButton } from './ComplementButton'

const ButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

export function QuestionPanelFooter({ questions }: { questions: Question[] }) {
  const certificateMetadata = useSelector(getCertificateMetaData)

  const links = questions.map(({ links }) => links).flat()

  const complementLink = getByType(links, ResourceLinkType.COMPLEMENT_CERTIFICATE)
  const cannotComplementLink = getByType(links, ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE)
  const cannotComplementOnlyMessageLink = getByType(links, ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE)
  const forwardQuestionLink = getByType(links, ResourceLinkType.FORWARD_QUESTION)

  const showQuestionPanelFooter = [complementLink, cannotComplementLink, cannotComplementOnlyMessageLink, forwardQuestionLink].some(Boolean)

  if (!showQuestionPanelFooter) {
    return null
  }

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <ButtonsWrapper>
        {complementLink && <ComplementButton link={complementLink} />}
        {cannotComplementLink && <CannotComplementButton link={cannotComplementLink} />}
        {cannotComplementOnlyMessageLink && <CannotComplementButton link={cannotComplementOnlyMessageLink} />}
        {forwardQuestionLink && certificateMetadata && (
          <ForwardCertificateButton
            name={forwardQuestionLink.name}
            description={forwardQuestionLink.description}
            functionDisabled={false}
            enabled={forwardQuestionLink.enabled}
            forwarded={certificateMetadata.forwarded}
            unitName={certificateMetadata.unit.unitName}
            careProviderName={certificateMetadata.careProvider.unitName}
            certificateId={certificateMetadata.id}
            certificateType={certificateMetadata.type}
            type={forwardQuestionLink.type}
          />
        )}
      </ButtonsWrapper>
    </SidePanelFooter>
  )
}
