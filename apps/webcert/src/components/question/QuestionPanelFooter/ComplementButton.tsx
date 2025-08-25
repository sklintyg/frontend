import { editImage } from '../../../images'
import { complementCertificate } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import type { ResourceLink } from '../../../types'
import { CustomButton } from '../../Inputs/CustomButton'

export function ComplementButton({ link }: { link: ResourceLink }) {
  const dispatch = useAppDispatch()
  return (
    <CustomButton
      buttonClasses={'iu-mr-200'}
      tooltip={link.description}
      disabled={!link.enabled}
      buttonStyle="primary"
      text={link.name}
      startIcon={<img src={editImage} alt="Komplettera" />}
      onClick={() => dispatch(complementCertificate({ message: '' }))}
    />
  )
}
