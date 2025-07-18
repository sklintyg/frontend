import { render, screen } from '@testing-library/react'
import { TechnicalIssueAlert } from './TechnicalIssueAlert'

it('Should render without error id', () => {
  render(
    <TechnicalIssueAlert error={new Error('Some error')}>
      <p>Some error text</p>
    </TechnicalIssueAlert>
  )
  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <div
      class="ids-alert ids-alert--error"
      role="alert"
    >
      <div
        class="ids-alert__header"
      >
        <div
          class="ids-alert__icon_and_text"
        >
          <span
            class="ids-alert__state-icon"
            title=""
          />
          <div
            class="ids-alert__headline"
          >
            Tekniskt fel
          </div>
        </div>
      </div>
      <div
        class="ids-alert__content"
      >
        <div
          class="flex flex-col gap-4"
        >
          <p>
            Some error text
          </p>
        </div>
      </div>
    </div>
  `)
})

it('Should render with error id', () => {
  const error = { ...new Error('Some error'), id: 'some-error-id' }
  render(
    <TechnicalIssueAlert error={error}>
      <p>Some error text</p>
    </TechnicalIssueAlert>
  )
  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <div
      class="ids-alert ids-alert--error"
      role="alert"
    >
      <div
        class="ids-alert__header"
      >
        <div
          class="ids-alert__icon_and_text"
        >
          <span
            class="ids-alert__state-icon"
            title=""
          />
          <div
            class="ids-alert__headline"
          >
            Tekniskt fel
          </div>
        </div>
      </div>
      <div
        class="ids-alert__content"
      >
        <div
          class="flex flex-col gap-4"
        >
          <p>
            Some error text
          </p>
          <div
            class=""
          >
            <button
              aria-label="Kopiera fel-id"
              tabindex="0"
              type="button"
              value="some-error-id"
            >
              <p
                class="flex justify-center gap-1 align-bottom font-bold"
                data-state="closed"
              >
                <span>
                  Fel-id: 
                </span>
                 
                <span
                  class="font-normal"
                >
                  some-error-id
                </span>
                <ids-icon-copy-file
                  class="ids-icon"
                />
              </p>
              <p
                class="flex justify-items-start"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  `)
})
