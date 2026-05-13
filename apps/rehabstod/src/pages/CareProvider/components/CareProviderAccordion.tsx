import { Icon, Radio } from '@frontend/components'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { Vardenhet } from '../../../schemas'

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
      <summary role="button" className="block cursor-pointer [&::-webkit-details-marker]:hidden">
        <div className="flex w-full items-center justify-between">
          <div className="min-w-0 flex-1">
            <Radio
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
          </div>
          <Icon
            icon="chevron-right"
            className="ml-2 shrink-0 rotate-90 text-sm transition-transform group-open:-rotate-90"
            colorPreset={1}
          />
        </div>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  )
}
