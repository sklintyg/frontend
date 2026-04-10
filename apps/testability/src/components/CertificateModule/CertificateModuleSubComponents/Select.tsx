import { IDSContainer } from "@inera/ids-react";

import { useState, useEffect, useMemo } from "react";
import { getCareUnits } from "@src/api/testabilityServiceApi";
import { CareUnit } from "@src/api/dataFormat";


export function Select({ onCertificatesChange, onSelectedCareUnitChange }: { onCertificatesChange?: (hsaId: string) => void; onSelectedCareUnitChange?: (hsaId: string) => void }) {
  const [careUnits, setCareUnits] = useState<CareUnit[]>([])
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredCareUnits = useMemo(
    () => {
      const normalizedQuery = query.trim().toLowerCase()

      if (!normalizedQuery) {
        return []
      }

      return careUnits
        .filter((unit) => unit.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 10)
    },
    [careUnits, query],
  )

  const handleSelectUnit = (unit: CareUnit) => {
    setQuery(unit.name)
    setIsOpen(false)
    onCertificatesChange?.(unit.hsaId)
    onSelectedCareUnitChange?.(unit.hsaId)
  }

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const data = await getCareUnits(controller.signal)
        setCareUnits(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to fetch care units:', err)
        }
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <IDSContainer>
      <form noValidate onSubmit={() => {}}>
        <div className="flex items-end justify-stretch gap-4">
          <div
            className="relative flex-1"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setIsOpen(false)
              }
            }}
          >
            <div className="ids-input">
              <div className="ids-input__wrapper">
                <div className="ids-label-wrapper ids-label-wrapper--margin-bottom">
                  <label htmlFor="care-unit-combobox" className="ids-label">
                    Vårdenhet
                  </label>
                </div>

                <div className="ids-input__input-wrapper">
                  <input
                    id="care-unit-combobox"
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="care-unit-options"
                    aria-autocomplete="list"
                    aria-invalid="false"
                    value={query}
                    placeholder="Skriv för att söka vårdenhet"
                    onFocus={() => setIsOpen(query.trim().length > 0)}
                    onChange={(e) => {
                      const nextQuery = e.target.value
                      setQuery(nextQuery)
                      setIsOpen(nextQuery.trim().length > 0)
                    }}
                    className="ids-input__input"
                  />
                  <span className="ids-input__icon" aria-hidden="true">
                    <span />
                  </span>
                </div>
              </div>
            </div>

            {isOpen && filteredCareUnits.length > 0 && (
              <ul
                id="care-unit-options"
                role="listbox"
                className="absolute z-30 mt-1 max-h-56 w-full list-none overflow-y-auto rounded border border-ids-surface-border bg-ids-surface-background p-0"
              >
                {filteredCareUnits.map((unit) => (
                  <li key={unit.hsaId} role="option">
                    <button
                      type="button"
                      onClick={() => handleSelectUnit(unit)}
                      className="w-full cursor-pointer border-0 bg-ids-surface-background px-3 py-2 text-left text-ids-surface-text hover:bg-ids-interactive-hover hover:text-[var(--ids-color-interactive-text-on-hover)] focus:bg-ids-interactive-hover focus:text-[var(--ids-color-interactive-text-on-hover)]"
                    >
                      {unit.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </form>
    </IDSContainer>
  )
}

