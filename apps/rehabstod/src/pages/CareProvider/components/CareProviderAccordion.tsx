import { IDSIcon, IDSRadio } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { Vardenhet, Vardgivare } from '../../../schemas'

export function CareProviderAccordion({
  unit,
  provider,
  selectedRadio,
  handleChooseUnit,
  children,
}: {
  unit: Vardenhet
  provider: Vardgivare
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenhet) => void
  children: ReactNode
}) {
  return (
    <details className="border-neutral-90 group my-2 border-b pb-2">
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
              onChange={(event) => handleChooseUnit(event, provider, unit)}
            />
            <label
              htmlFor={unit.namn}
              className={`flex cursor-pointer items-center ${selectedRadio === unit.namn ? 'font-bold' : ''} mb-0 w-full justify-between`}>
              <span>{unit.namn}</span>
            </label>
          </IDSRadio>
          <span className="inline-block h-3 w-3 origin-center rotate-90 group-open:-rotate-90">
            <IDSIcon name="chevron" width="100%" height="100%" className="h-full w-full" />
          </span>
        </div>
      </summary>
      <div>{children}</div>
    </details>
  )
}
