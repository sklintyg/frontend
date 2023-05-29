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

  useEffect(() => {
    const dialogEl = ref.current

    function handleVisibilityChanged() {
      if (dialogEl?.show === 'false') {
        blocker.reset?.()
      }
    }

    dialogEl?.addEventListener('changedVisibility', handleVisibilityChanged)
    return () => dialogEl?.removeEventListener('changedVisibility', handleVisibilityChanged)
  })

  return (
    <IDSDialog dismissible={false} headline="Öppnade patientfönster" ref={ref}>
      <p>Du har öppnat ett eller flera intyg i Webcert. När du stänger patientvyn kommer flikarna med intyg i Webcert också att stängas.</p>
      <IDSDialogActions>
        <IDSButton
          secondary
          onClick={() => {
            blocker.reset?.()
            ref.current?.hideDialog()
          }}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={() => blocker.proceed?.()}>Stäng patientvy</IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}
