import { DoctorFilter } from '../../../../components/Table/filter/DoctorFilter'
import { Lakare } from '../../../../schemas/lakareSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

export function LUCertificateDoctorFilter({ options }: { options: Lakare[] }) {
  const doctors = useAppSelector((state) => state.luCertificatesFilter.filter.doctors)
  const dispatch = useAppDispatch()

  return (
    <DoctorFilter
      onChange={(doctorIds) => dispatch(update({ doctors: doctorIds }))}
      doctors={options}
      selected={doctors}
      description="Filtrerar på den läkare som har utfärdat läkarutlåtandet."
    />
  )
}
