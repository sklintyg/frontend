import React, { ReactNode } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import { ImageCentered } from '@frontend/common'
import questionsAndAnswersImg from './fragor_svar_flik.svg'

interface Props {
  tabIndex: number
  selectedTabIndex: number
}

const QuestionNotAvailablePanel: React.FC<Props> = () => {
  return (
    <div>
      <PanelHeader description={'Kompletteringsbegäran och administrativa frågor'} />
      <ImageCentered imgSrc={questionsAndAnswersImg} alt={'Kompletteringsbegäran och administrativa frågor'}>
        <p>Intyget är inte skickat till Försäkringskassan.</p>
        <p className={'iu-mt-none'}>Det går därför inte att ställa frågor på intyget.</p>
      </ImageCentered>
    </div>
  )
}

export default QuestionNotAvailablePanel
