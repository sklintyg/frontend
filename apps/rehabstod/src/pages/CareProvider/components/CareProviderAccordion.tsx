import { IDSIconChevron, IDSRadio } from '@frontend/ids-react-ts'
import type { ReactNode} from 'react';
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
      <summary role="button" className="flex cursor-pointer items-start space-x-2">
        <div className="flex w-full items-center justify-between">
          <IDSRadio>
            <input
              type="radio"
              name="selectedUnit"
              value={unit.namn}
              id={unit.namn}
              checked={selectedRadio === unit.namn}
              onClick={(e) => {
                const detailsEl = e.currentTarget.closest('details')
                if (detailsEl) {
                  detailsEl.setAttribute('open', '')
                }
              }}
              onChange={(event) => handleChooseUnit(event, unit)}
            />
            <label
              htmlFor={unit.namn}
              className={`flex cursor-pointer items-center ${selectedRadio === unit.namn ? 'font-bold' : ''} mb-0 w-full justify-between`}
            >
              <span>{unit.namn}</span>
            </label>
          </IDSRadio>
          <span className="inline-block h-3 w-3 origin-center rotate-90 group-open:-rotate-90">
            <IDSIconChevron width="100%" height="100%" className="h-full w-full" />
          </span>
        </div>
      </summary>
      <div>{children}</div>
    </details>
  )
}
