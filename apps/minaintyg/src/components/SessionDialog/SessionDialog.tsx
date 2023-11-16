import { Dialog } from '@frontend/components'
import { IDSButton, IDSDialogActions } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { api } from '../../store/api'
import { useAppDispatch } from '../../store/hooks'

export function SessionDialog() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <Dialog open dismissible={false} headline="Du håller på att bli utloggad på grund av inaktivitet">
      Vill du fortsätta vara inloggad?
      <IDSDialogActions>
        <IDSButton sblock onClick={() => navigate('/logga-ut')} secondary>
          Logga ut
        </IDSButton>
        <IDSButton sblock onClick={() => dispatch(api.util.invalidateTags(['User']))}>
          Fortsätt vara inloggad
        </IDSButton>
      </IDSDialogActions>
    </Dialog>
  )
}
