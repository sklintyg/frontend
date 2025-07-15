/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAppDispatch } from '../../../store/hooks'
import { updateShowAboutDialog } from '../../../store/slices/settings.slice'

export function AboutHeaderItem() {
  const dispatch = useAppDispatch()

  return (
    <button
      type="button"
      onClick={() => dispatch(updateShowAboutDialog(true))}
      className="ids-header-1177-admin__items__item ids-header-1177-admin__items__item--mobile"
    >
      <div className="ids-header-1177-admin__items__item-icon">
        <span className="ids-icon-question" />
      </div>
      <div className="ids-header-1177-admin__items__item-text">Om Rehabstöd</div>
    </button>
  )
}
