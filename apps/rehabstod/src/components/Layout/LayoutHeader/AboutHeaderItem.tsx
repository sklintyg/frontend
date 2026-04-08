import { IDSHeader1177AdminItem } from '@inera/ids-react'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'

export function AboutHeaderItem() {
  const dispatch = useAppDispatch()

  return (
    <IDSHeader1177AdminItem icon="question" mobile>
      <button type="button" onClick={() => dispatch(updateShowAboutDialog(true))}>
        Om Rehabstöd
      </button>
    </IDSHeader1177AdminItem>
  )
}
