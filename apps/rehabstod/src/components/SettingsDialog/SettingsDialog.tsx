import { IDSDialog, IDSHeaderAvatarElement, IDSIcon } from '@frontend/ids-react-ts'
import { RefObject, useEffect, useRef, useState } from 'react'
import { IDSDialogElement } from '@frontend/ids-react-ts/src'
import { SettingsDialogContent } from './SettingsDialogContent'
import { User, UserPreferences } from '../../schemas'

export function SettingsDialog({ user, avatarRef }: { user: User; avatarRef: RefObject<IDSHeaderAvatarElement> }) {
  const ref = useRef<IDSDialogElement>(null)
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences | undefined>(user.preferences)

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('changedVisibility', () => {
        setSavedPreferences(user.preferences)
        if (avatarRef.current?.expanded && ref.current?.show === 'false') {
          avatarRef.current?.tooggleExpand()
        }
      })
    }
  }, [ref, user.preferences, avatarRef])

  if (!user.preferences || !savedPreferences) {
    return null
  }

  return (
    <IDSDialog dismissible headline="Inställningar" ref={ref}>
      <button
        trigger=""
        onClick={() => ref.current?.showDialog()}
        className="ids-my-5 text-primary-40 flex w-full items-center"
        type="submit">
        <div className="mr-2.5">
          <IDSIcon color="currentColor" color2="currentColor" height="20" width="20" name="cog" />
        </div>
        <div className="flex-auto text-left">Inställningar</div>
      </button>
      <SettingsDialogContent
        onClose={() => ref.current?.hideDialog()}
        preferences={savedPreferences}
        onChange={(preferences) => {
          setSavedPreferences(preferences)
        }}
        user={user}
      />
    </IDSDialog>
  )
}
