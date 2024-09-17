import { IDSIconChevron } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { Vardenhet } from '../../../schemas'
import { CareProviderRadioButton } from './CareProviderRadio'

export function CareProviderAccordion({
  unit,
  selectedRadio,
  handleChooseUnit,
  children,
}: {
  unit: Vardenhet
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, unit: Vardenhet) => void
  children: ReactNode
}) {
  function selectedUnitIsSubUnit() {
    return (
      unit.mottagningar &&
      unit.mottagningar.length > 0 &&
      unit.mottagningar.filter((reception) => reception.namn === selectedRadio).length > 0
    )
  }

  useEffect(() => {
    const element = document.getElementById(unit.id)
    if (element && selectedUnitIsSubUnit()) {
      element.setAttribute('open', '')
    }
  })

  return (
    <details id={unit.id} className="group my-2 border-b border-neutral-90 pb-2">
      <summary role="button" className="flex cursor-pointer items-start space-x-2">
        <div className="flex w-full items-center justify-between [&:not(:last-child)]:mb-2">
          <CareProviderRadioButton
            id={unit.namn}
            value={unit.namn}
            label={unit.namn}
            checked={selectedRadio === unit.namn}
            onClick={(e) => {
              const detailsEl = e.currentTarget.closest('details')
              if (detailsEl) {
                detailsEl.setAttribute('open', '')
              }
            }}
            onChange={(event) => handleChooseUnit(event, unit)}
          />
          <span className="inline-block h-3 w-3 origin-center rotate-90 group-open:-rotate-90">
            <IDSIconChevron width="100%" height="100%" className="h-full w-full" />
          </span>
        </div>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  )
}
