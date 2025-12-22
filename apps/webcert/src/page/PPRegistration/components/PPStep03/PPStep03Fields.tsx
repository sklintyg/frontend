import TextInput from '../../../../components/Inputs/TextInput'
import { useGetHOSPInformationQuery } from '../../../../store/pp/ppApi'

const NO_INFORMATION_FETCHED = 'Inga uppgifter hämtade'

export function PPStep03Fields() {
  const { data } = useGetHOSPInformationQuery()

  const licensedHealthcareProfessions =
    data?.licensedHealthcareProfessions.map(({ description }) => description).join(', ') ?? NO_INFORMATION_FETCHED
  const specialities = data?.specialities.map(({ description }) => description).join(', ') ?? NO_INFORMATION_FETCHED

  return (
    <>
      <div>
        <TextInput
          label="Legitimerad yrkesgrupp"
          style={{ fontStyle: 'italic' }}
          value={licensedHealthcareProfessions.length > 0 ? licensedHealthcareProfessions : NO_INFORMATION_FETCHED}
          disabled
        />
      </div>

      <div>
        <TextInput
          label="Specialitet"
          style={{ fontStyle: 'italic' }}
          value={specialities.length > 0 ? specialities : NO_INFORMATION_FETCHED}
          disabled
        />
      </div>

      <div>
        <TextInput
          label="Förskrivarkod"
          style={{ fontStyle: 'italic' }}
          value={data?.personalPrescriptionCode ?? NO_INFORMATION_FETCHED}
          disabled
        />
      </div>
    </>
  )
}
