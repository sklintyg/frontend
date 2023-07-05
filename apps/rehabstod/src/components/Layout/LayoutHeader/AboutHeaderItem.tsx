/* eslint-disable jsx-a11y/anchor-is-valid */
import { IDSHeaderItem, IDSIconQuestion } from '@frontend/ids-react-ts'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'

export function AboutHeaderItem() {
  const dispatch = useAppDispatch()
  return (
    <IDSHeaderItem type="inera-admin" mobile>
      <IDSIconQuestion />
      <a
        tabIndex={0}
        onClick={() => dispatch(updateShowAboutDialog(true))}
        onKeyDown={({ code }) => {
          if (['Enter', 'Space'].includes(code)) {
            dispatch(updateShowAboutDialog(true))
          }
        }}
        role="button"
      >
        Om Rehabstöd
      </a>
    </IDSHeaderItem>
  )
}
