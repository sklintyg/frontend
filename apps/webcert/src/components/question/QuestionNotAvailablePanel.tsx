import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import ImageCentered from '../image/image/ImageCentered'
import questionsAndAnswersImg from './fragor_svar_flik.svg'

const QuestionNotAvailablePanel = () => {
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
