import { skipToken } from '@reduxjs/toolkit/dist/query'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import Spinner from '../../../components/utils/Spinner'
import { useGetPrefillQuery } from '../../../store/api'
import { getCertificate } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'

export function PrefillModal() {
  const certificateId = useAppSelector((state) => getCertificate(state)?.metadata.id)
  const { data: prefillData, isLoading: isPrefillLoading } = useGetPrefillQuery(certificateId ?? skipToken, {
    pollingInterval: 3000,
    skip: certificateId == null,
  })
  const isLoading = isPrefillLoading || prefillData?.status === 'loading'

  return (
    <ModalBase
      open={isLoading}
      handleClose={() => null}
      title="Förifyllnad pågår"
      enableCross={false}
      focusTrap={false}
      content={
        <>
          <p>
            Ditt intygsutkast förifylls med journalinformation från patientens journal. Vänligen vänta medan informationen hämtas och fylls
            i.
          </p>
          <p className="iu-mb-500">
            Ifyllnaden sker automatiskt. När den är klar kommer du att kunna fortsätta arbeta med ditt intygsutkast.
          </p>
          <div className="iu-flex-center">
            <Spinner />
          </div>
        </>
      }
      buttons={null}
    ></ModalBase>
  )
}
