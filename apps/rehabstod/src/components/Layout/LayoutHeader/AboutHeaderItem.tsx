/* eslint-disable jsx-a11y/anchor-is-valid */
import { IDSHeader1177AdminItem, IDSIconQuestion } from '@inera/ids-react'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'

export function AboutHeaderItem() {
  const dispatch = useAppDispatch()
  return (
    <IDSHeader1177AdminItem
      mobile
      onClick={() => dispatch(updateShowAboutDialog(true))}
      data-testid="ICON"
      onKeyDown={({ code }) => {
        if (['Enter', 'Space'].includes(code)) {
          dispatch(updateShowAboutDialog(true))
        }
      }}
      tabIndex={0}
    >
      <IDSIconQuestion />
      <a className="font-thin">Om Rehabstöd</a>
    </IDSHeader1177AdminItem>
  )
}
