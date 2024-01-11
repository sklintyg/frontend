import { IDSIconExternal } from '@frontend/ids-react-ts'
import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { TertiaryButton } from './TertiaryButton'

it('Should render as expected', () => {
  const { container } = render(<TertiaryButton>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link uppercase text-base font-normal underline"
        type="button"
      >
        <span
          class="ids-link__text"
        >
          Hello
        </span>
      </button>
    </div>
  `)
})

it('Should be possible to add icon before text', () => {
  const { container } = render(<TertiaryButton startIcon={IDSIconExternal}>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link uppercase text-base font-normal underline"
        type="button"
      >
        <span
          class="ids-link__icon"
        >
          <ids-icon-external
            class="ids-icon"
          />
        </span>
        <span
          class="ids-link__text"
        >
          Hello
        </span>
      </button>
    </div>
  `)
})

it('Should be possible to add icon after text', () => {
  const { container } = render(<TertiaryButton endIcon={IDSIconExternal}>Hello</TertiaryButton>)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        class="ids-link uppercase text-base font-normal underline"
        type="button"
      >
        <span
          class="ids-link__text"
        >
          Hello
        </span>
        <span
          class="ids-link__icon"
        >
          <ids-icon-external
            class="ids-icon"
          />
        </span>
      </button>
    </div>
  `)
})
