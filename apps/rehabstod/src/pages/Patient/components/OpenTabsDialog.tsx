import { IDSButton, IDSDialog, IDSDialogActions, IDSDialogElement } from '@frontend/ids-react-ts'
import { useCallback, useEffect, useRef } from 'react'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import { usePatient } from '../hooks/usePatient'

export function OpenTabsDialog() {
  const ref = useRef<IDSDialogElement>(null)
  const { tabs, hasOpenTabs, closeTabs } = usePatient()
  const blocker = useBlocker(useCallback(() => tabs.filter((window) => !window.closed).length > 0, [tabs]))
  const prevState = useRef(blocker.state)

  useEffect(() => {
    if (blocker.state === 'blocked' && !hasOpenTabs) {
      blocker.reset()
    }
    prevState.current = blocker.state
  }, [blocker, hasOpenTabs])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      ref.current?.showDialog()
    } else {
      ref.current?.hideDialog()
    }
  }, [blocker.state])

  return (
    <IDSDialog dismissible={false} headline="Öppnade patientfönster" ref={ref}>
      <p>
        Det finns {tabs.length.toLocaleString('sv-SE')} {tabs.length === 1 ? 'öppet' : 'öppna'} fönster för patienten
      </p>
      <IDSDialogActions>
        <IDSButton
          onClick={() => {
            closeTabs()
            blocker.proceed?.()
          }}>
          Stäng fönster och fortsätt
        </IDSButton>
        <IDSButton onClick={() => blocker.proceed?.()}>Fortsätt</IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}
