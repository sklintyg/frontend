import React, { ReactNode } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import { ImageCentered } from '@frontend/common'
import questionsAndAnswersImg from './fragor_svar_flik.svg'

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const QuestionNotAvailablePanel: React.FC<Props> = ({ minimizeSidePanel }) => {
  return (
    <div>
      <PanelHeader description={'Kompletteringsbegäran och administrativa frågor'} minimizeSidePanel={minimizeSidePanel} />
      <ImageCentered imgSrc={questionsAndAnswersImg} alt={'Kompletteringsbegäran och administrativa frågor'}>
        <p>Intyget är inte skickat till Försäkringskassan.</p>
        <p className={'iu-mt-none'}>Det går därför inte att ställa frågor på intyget.</p>
      </ImageCentered>
    </div>
  )
}

export default QuestionNotAvailablePanel
