import { Dialog } from '@frontend/components'
import { IDSButton } from '@inera/ids-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../store/api'
import { useAppDispatch } from '../../store/hooks'

export function SessionDialog() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <Dialog
      initialOpen
      persistent
      dismissible={false}
      headline="Du håller på att bli utloggad på grund av inaktivitet"
      actions={
        <>
          <IDSButton mBlock onClick={() => navigate('/logga-ut')} secondary>
            Logga ut
          </IDSButton>
          <IDSButton mBlock onClick={() => dispatch(api.util.invalidateTags(['User']))}>
            Fortsätt vara inloggad
          </IDSButton>
        </>
      }
    >
      Vill du fortsätta vara inloggad?
    </Dialog>
  )
}
