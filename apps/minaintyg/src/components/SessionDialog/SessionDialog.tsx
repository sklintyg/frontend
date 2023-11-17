import { Dialog } from '@frontend/components'
import { IDSButton, IDSDialogActions } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { api } from '../../store/api'
import { useAppDispatch } from '../../store/hooks'

export function SessionDialog() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <Dialog open persistent dismissible={false} headline="Du håller på att bli utloggad på grund av inaktivitet">
      Vill du fortsätta vara inloggad?
      <IDSDialogActions>
        <IDSButton mblock onClick={() => navigate('/logga-ut')} secondary>
          Logga ut
        </IDSButton>
        <IDSButton mblock onClick={() => dispatch(api.util.invalidateTags(['User']))}>
          Fortsätt vara inloggad
        </IDSButton>
      </IDSDialogActions>
    </Dialog>
  )
}
